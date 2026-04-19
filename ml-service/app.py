"""
Calorie estimation microservice.

Startup:
    python app.py          (runs on port 5001)

Endpoint:
    POST /calculate
    Body: {"dish": "Chicken Biryani", "ingredients": "chicken, rice, spices"}
    Returns: {"calories": 490, "fat": 14, "protein": 28, "matched_food": "...", "confidence": 0.87}
"""

import csv
import os

import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

BASE_DIR        = os.path.dirname(os.path.abspath(__file__))
FOODS_CSV       = os.path.join(BASE_DIR, "foods.csv")
EMBEDDINGS_FILE = os.path.join(BASE_DIR, "food_embeddings.npy")
MODEL_NAME      = "all-MiniLM-L6-v2"
TOP_K           = 5

# Module-level — loaded once at startup, shared across all requests
model: SentenceTransformer = None
descriptions: list = []
calories_arr: np.ndarray = None
fat_arr:      np.ndarray = None
protein_arr:  np.ndarray = None
food_embeddings: np.ndarray = None


def load():
    """Load the sentence transformer model and food data into memory."""
    global model, descriptions, calories_arr, fat_arr, protein_arr, food_embeddings

    if not os.path.exists(FOODS_CSV):
        raise FileNotFoundError(
            f"{FOODS_CSV} not found.\n"
            "Run setup first:  python setup.py"
        )

    print(f"Loading model '{MODEL_NAME}' (downloads ~90 MB on first run)...")
    model = SentenceTransformer(MODEL_NAME)
    print("Model loaded.")

    print("Loading food database...")
    _calories, _fat, _protein = [], [], []
    with open(FOODS_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                cal = float(row["calories"])
            except (ValueError, KeyError):
                continue
            if cal <= 0:
                continue
            descriptions.append(row["description"])
            _calories.append(cal)
            _fat.append(float(row.get("fat", 0) or 0))
            _protein.append(float(row.get("protein", 0) or 0))

    calories_arr = np.array(_calories)
    fat_arr      = np.array(_fat)
    protein_arr  = np.array(_protein)
    print(f"Loaded {len(descriptions):,} food items.")

    if os.path.exists(EMBEDDINGS_FILE):
        print("Loading cached embeddings from disk...")
        food_embeddings = np.load(EMBEDDINGS_FILE)
    else:
        print("Computing embeddings for all foods (one-time, ~1 min on CPU)...")
        food_embeddings = model.encode(descriptions, show_progress_bar=True, batch_size=64)
        np.save(EMBEDDINGS_FILE, food_embeddings)
        print(f"Embeddings cached to {EMBEDDINGS_FILE}")

    print("\nService ready. Listening on http://localhost:5001\n")


@app.route("/calculate", methods=["POST"])
def calculate():
    data        = request.get_json(silent=True) or {}
    dish        = (data.get("dish") or "").strip()
    ingredients = (data.get("ingredients") or "").strip()

    if not dish:
        return jsonify({"error": "dish is required"}), 400

    # Combining dish + ingredients gives the model more context
    query = f"{dish}, {ingredients}" if ingredients else dish

    query_embedding = model.encode([query])
    similarities    = cosine_similarity(query_embedding, food_embeddings)[0]

    top_indices      = np.argsort(similarities)[::-1][:TOP_K]
    top_similarities = similarities[top_indices]

    # Weighted average: higher-similarity matches count more
    weights = top_similarities / top_similarities.sum()

    calories = int(round(float(np.dot(weights, calories_arr[top_indices]))))
    fat      = int(round(float(np.dot(weights, fat_arr[top_indices]))))
    protein  = int(round(float(np.dot(weights, protein_arr[top_indices]))))

    best_match = descriptions[top_indices[0]]
    confidence = round(float(top_similarities[0]), 2)

    return jsonify({
        "calories":     calories,
        "fat":          fat,
        "protein":      protein,
        "matched_food": best_match,
        "confidence":   confidence,
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status":       "ok",
        "foods_loaded": len(descriptions),
    })


if __name__ == "__main__":
    load()
    app.run(port=5001, debug=False)
