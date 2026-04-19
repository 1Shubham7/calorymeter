# How the Calorie Estimation Model Works — A Beginner's Guide

This document explains the thinking behind how we estimate calories from a food name and ingredients. It is written for someone who knows how to code but has not worked with machine learning before. No prior ML knowledge assumed.

---

## The Problem, Simply Stated

The user types:

```
Dish: Chicken Biryani
Ingredients: chicken, basmati rice, onion, yogurt, spices
```

We need to return something like:

```
Calories: 490
Fat: 14g
Protein: 28g
```

The question is: **how do we go from text to numbers?**

---

## The Wrong Mental Model (and Why It Is Wrong)

Your first instinct might be: *"just look it up in a table."*

That is actually not far off — but the hard part is the "look up" step. Here is why:

Imagine you have a table of 14,000 foods from the USDA (the US government's official nutrition database). The entry for chicken biryani might be stored as:

```
"BIRYANI, CHICKEN, RESTAURANT-STYLE"
```

But the user typed `"Chicken Biryani"`. A simple string match (`user_input == table_entry`) will fail because the words are in a different order and the formatting is different.

What if you try partial matching (does the table entry *contain* "chicken")?

- You would match 400+ entries: chicken nuggets, chicken soup, chicken tikka, chicken salad, fried chicken, etc.
- Which one is biryani? You have no idea.

This is the core problem: **text matching is too brittle**. We need something smarter — something that understands that "Chicken Biryani" and "BIRYANI, CHICKEN, RESTAURANT-STYLE" mean the same thing, even though the words are arranged differently and there are hyphens and commas.

This is where the ML model comes in.

---

## The Key Idea: Meaning as a List of Numbers

Modern NLP (Natural Language Processing) models can convert a sentence into a list of numbers called an **embedding** (also called a vector).

The magic property of a good embedding model is:

> **Two sentences that mean similar things will produce similar lists of numbers.**

For example:

```
"Chicken Biryani"                    → [0.12, -0.45, 0.78, 0.03, ...]  (384 numbers)
"BIRYANI, CHICKEN, RESTAURANT-STYLE" → [0.11, -0.43, 0.80, 0.01, ...]  (384 numbers, very similar)
"Apple Pie"                          → [-0.34, 0.12, -0.22, 0.91, ...]  (very different numbers)
```

You do not need to understand how the model produces these numbers internally. Think of it as a black box that converts meaning into coordinates in a 384-dimensional space.

> **Analogy**: Imagine a map where similar things are placed close together. "Cat" and "kitten" are nearby. "Cat" and "airplane" are far apart. The embedding model creates this map, but for all possible sentences, in 384 dimensions instead of 2.

---

## The Model We Are Using: `all-MiniLM-L6-v2`

The model is called `all-MiniLM-L6-v2`. It is available for free from HuggingFace (the GitHub of ML models).

**What kind of model is it?**

It is a **sentence transformer** — a neural network trained specifically to produce embeddings where similar sentences end up close together.

It is built on top of BERT (Bidirectional Encoder Representations from Transformers), which is a large language model developed by Google in 2018. `all-MiniLM-L6-v2` is a distilled (smaller, faster) version of that. It has 6 layers and produces 384-dimensional embeddings.

**Why this specific model?**

- Small: ~90MB on disk. You can ship it with a college project.
- Fast: runs on a regular laptop CPU in milliseconds.
- Good at semantic similarity: it was trained specifically to pull similar-meaning sentences close together.
- Free: no API key, no account, no cost.

**What does "trained" mean here?**

The model was trained by the team at Hugging Face / UKP Lab on millions of sentence pairs labeled as "similar" or "dissimilar". During training, it adjusted its internal parameters (weights) so that similar-meaning sentences produce nearby vectors. We are not training this model ourselves — we are downloading it already trained and using its knowledge.

This is called **transfer learning**: someone else spent the compute and time training a general-purpose model, and we reuse it for our specific task.

---

## The Full Pipeline, Step by Step

Here is what happens when the user clicks "Calculate Calories":

### Step 1 — Pre-computation (happens once when the server starts)

We load the USDA FoodData Central dataset. This is a free, government-published dataset of ~14,000 foods with their nutrition information. Each row looks like:

```
description                          | calories | fat  | protein
-------------------------------------|----------|------|--------
Chicken, broiled, with skin          | 239      | 14g  | 27g
BIRYANI, CHICKEN, RESTAURANT-STYLE  | 190      | 8g   | 14g
Apple pie, commercially prepared     | 237      | 11g  | 2g
...
```

We feed every food description through `all-MiniLM-L6-v2` and store the resulting 384-number vector for each food. This creates a big matrix of shape `[14000, 384]`. We save this to disk so we only compute it once.

Think of it as pre-computing where every food sits on our "meaning map".

### Step 2 — Query (happens when the user clicks the button)

The user's input:
```
dish: "Chicken Biryani"
ingredients: "chicken, basmati rice, onion, yogurt, spices"
```

We combine these into one string: `"Chicken Biryani, chicken, basmati rice, onion, yogurt, spices"`

We run this through the same `all-MiniLM-L6-v2` model. We get a 384-number vector representing what this food "means".

### Step 3 — Similarity Search

We compare the query vector against all 14,000 pre-computed vectors using **cosine similarity**.

Cosine similarity measures the angle between two vectors. If they point in the same direction (angle ≈ 0°), similarity = 1.0 (identical meaning). If they point in opposite directions, similarity = -1.0 (opposite meaning). Two random unrelated vectors → similarity ≈ 0.

We compute this for all 14,000 foods and rank them. The top 5 closest matches might be:

```
1. BIRYANI, CHICKEN, RESTAURANT-STYLE     → similarity: 0.91  → 190 cal
2. Chicken, rice dish, Indian-style       → similarity: 0.87  → 210 cal
3. Rice with chicken, homemade            → similarity: 0.79  → 175 cal
4. Chicken fried rice                     → similarity: 0.71  → 220 cal
5. Chicken tikka masala with rice         → similarity: 0.65  → 230 cal
```

### Step 4 — Weighted Average

We do not just take the top match — that would be too noisy. Instead, we take the top-5 and compute a **weighted average** of their calories, where higher-similarity matches count more.

```
calories = (0.91×190 + 0.87×210 + 0.79×175 + 0.71×220 + 0.65×230)
           ÷ (0.91 + 0.87 + 0.79 + 0.71 + 0.65)

         ≈ 203 calories
```

This is more robust than taking just the top match. If one entry is slightly off, the others balance it out.

### Step 5 — Return the result

We return `{calories: 203, fat: 9, protein: 16, matched_food: "BIRYANI, CHICKEN, RESTAURANT-STYLE"}` to the frontend, which auto-fills the form.

---

## The Alternatives We Considered (and Why We Rejected Them)

### Alternative 1: Simple String Matching on nutrition101.csv

The project already has a file `Food-Image-Recognition/nutrition101.csv` with 101 foods and their macros.

**Why not just use this?**

Two problems:

1. **Coverage**: Only 101 dishes, all western restaurant food (apple pie, baby back ribs, baklava…). A user typing "daal makhani" or "upma" or "overnight oats" would get a completely wrong match. TF-IDF on 101 items will confidently match "idli" to "ice cream" because it finds partial word overlap. A wrong answer with high confidence is worse than no answer.

2. **No calories column**: The CSV has `protein`, `fat`, `carbohydrates`, `calcium`, `vitamins` — but no `calories` field. Calories would have to be derived as `protein×4 + carbs×4 + fat×9`. That math is fine but the data is still only 101 foods with no portion size information.

**Verdict**: Too narrow, will produce wrong results for most real inputs.

---

### Alternative 2: Train a DistilBERT Regression Model

We could take DistilBERT (~260MB), replace its output head with a regression layer, and fine-tune it on a food-name-to-calorie dataset (e.g. a 1,000-row CSV of food names + calorie counts).

**What is fine-tuning?** It means taking a model already trained on general language understanding and doing additional training on your specific data to adapt it to your task.

**Why not do this?**

- **Data problem**: Regression (predicting a number) from text is hard. With only 1,000 training examples, DistilBERT will memorize the training set but generalize poorly to new foods. You need tens of thousands of diverse, clean examples to train a regression model this way.
- **Training time**: Fine-tuning even a small transformer on a laptop CPU takes hours. On a GPU, minutes — but most students don't have a spare GPU.
- **The output would be worse than our approach**: A poorly trained regression model gives overconfident wrong numbers. Our retrieval approach gives numbers that are grounded in real USDA measurements.

**Verdict**: Theoretically clean but practically produces worse results than retrieval for this data size.

---

### Alternative 3: Use Gemini / ChatGPT API

Just send the food name to an LLM and ask it to return calories.

**Why not?**

- **External API dependency**: Requires an API key, costs money per call, needs internet, and the college project evaluator would see it as "just calling someone else's model".
- **Not a model you own or control**: The whole point of the college project is to demonstrate you built something.
- **Hallucination risk**: LLMs sometimes confidently return wrong calorie numbers. At least our retrieval approach is grounded in real USDA measurements.

We do use Gemini in this project already — for the nutrition tips feature — but that is acceptable because tips are general advice, not precise numbers.

**Verdict**: Rejected for the calorie calculation feature specifically because it does not meet the "use your own model" requirement.

---

### Alternative 4: Quantized Small LLM (TinyLlama, Phi-3)

Run a small LLM locally (no API, no internet) using GGUF quantization (a technique to make big models smaller and faster).

**Why not?**

- TinyLlama in Q4 format is ~670MB — larger than we want to bundle with a project.
- Inference on CPU takes 5–30 seconds per query. That is too slow for an interactive button click.
- Still has hallucination risk (generates plausible but incorrect calorie numbers).

**Verdict**: Interesting direction, but too slow and too large for our use case.

---

### Alternative 5: Open Food Facts Database

The world's largest open food database (~4 million packaged products). Could be used as the retrieval corpus instead of USDA.

**Why not use it as the primary source?**

- Covers packaged and processed foods (biscuits, cereals, branded products). Not good for home-cooked meals or restaurant dishes.
- Many entries have missing or erroneous calorie values.
- The full dataset is several gigabytes — too large to ship with the project.

**Verdict**: USDA FoodData Central is more appropriate for cooked/whole foods and is a manageable ~50MB.

---

## Why Our Chosen Approach is the Right One

To summarize the reasoning:

| Requirement | Our Approach |
|---|---|
| No external API calls | Runs 100% locally after setup |
| Uses a real ML model | `all-MiniLM-L6-v2` (transformer, transfer learning) |
| Handles arbitrary food names | Yes — semantic similarity, not string matching |
| Academically defensible | Published in NutriTransform (arXiv 2503.04755, 2025) |
| Reasonable accuracy | ~117 kcal RMSE — good for a food tracker |
| Fast inference | <100ms per query on CPU |
| Manageable size | ~140MB total (90MB model + 50MB USDA data) |
| Explainable | Embeddings → cosine similarity → weighted average |

---

## Glossary (Quick Reference)

| Term | What it means |
|---|---|
| **Embedding** | A list of numbers that represents the "meaning" of a piece of text |
| **Vector** | Another word for a list of numbers |
| **Cosine similarity** | A way to measure how similar two vectors are (1 = identical direction, 0 = unrelated) |
| **Transformer** | A type of neural network architecture that understands language well |
| **Transfer learning** | Reusing a model trained for one task as a starting point for another |
| **Fine-tuning** | Additional training on your specific data after transfer learning |
| **USDA FoodData Central** | US government nutrition database — authoritative, free, public domain |
| **Retrieval** | Finding the closest match in a database, rather than generating an answer from scratch |
| **Weighted average** | An average where some values count more than others (here: higher-similarity matches count more) |

---

## What Happens Under the Hood — Full Request Walkthrough

This section traces exactly what happens from the moment the user clicks **Calculate Calories** to the moment the calories field fills in. Every layer of the stack is covered.

---

### The Complete Flow

```
User clicks button
       │
       ▼
[React – entries.components.js]
  sets calcLoading = true
  calls POST http://localhost:8000/food/calculate-calories
  body: { dish: "Chicken Biryani", ingredients: "chicken, rice, spices" }
       │
       ▼
[Go Backend – api/calories.go]
  receives the request
  validates: dish must not be empty
  forwards request to POST http://localhost:5001/calculate
       │
       ▼
[Python Flask – ml-service/app.py]
  receives { dish, ingredients }
  builds query string: "Chicken Biryani, chicken, rice, spices"
  runs query through all-MiniLM-L6-v2 → gets 384-number vector
  computes cosine similarity against 7,756 pre-computed food vectors
  picks top 5 closest matches
  computes weighted average of their calories/fat/protein
  returns { calories: 490, fat: 14, protein: 28, matched_food: "...", confidence: 0.87 }
       │
       ▼
[Go Backend – api/calories.go]
  receives Flask response
  forwards JSON as-is back to the frontend
       │
       ▼
[React – entries.components.js]
  sets newEntry.calories = 490
  sets newEntry.fat = 14
  sets calcMatch = "CHICKEN, BROILED, MEAT ONLY"
  sets calcLoading = false
  form fields visually update
```

---

### Layer 1: React (the button click)

File: `frontend/src/components/Food/entries.components.js`

When the user clicks the button, the `calculateCalories()` function runs:

```
1. Sets calcLoading = true  →  button shows "Calculating..."
2. Sends POST to Go at :8000/food/calculate-calories
   with { dish, ingredients } from the form state
3. Awaits response
4. On success: writes calories and fat into newEntry state
              writes matched_food into calcMatch state
              React re-renders → inputs show the new values
5. On failure: writes error message into calcError state
              React re-renders → error text appears below button
6. Always: sets calcLoading = false  →  button returns to normal
```

The inputs are **controlled** (they have `value={newEntry.calories}`), which is what makes step 4 work visually. If they were uncontrolled, the state would update but the user would see no change on screen.

---

### Layer 2: Go Backend (the proxy)

File: `api/calories.go`

Go's job here is simple — it is a thin proxy. It does not do any ML work itself.

```
1. Parses JSON body from the React request
2. Checks that dish is not empty — returns 400 if it is
3. Re-encodes the body as JSON
4. Makes an HTTP POST to http://localhost:5001/calculate  (the Flask service)
   with a 30-second timeout
5. If Flask is unreachable → returns 503 with a helpful message
6. If Flask responds → forwards its response body and status code as-is
```

The 30-second timeout means: if the ML service takes longer than 30 seconds (it should not — it typically takes under 100ms), Go cancels the request and returns an error rather than hanging forever.

---

### Layer 3: Flask ML Service (where the model runs)

File: `ml-service/app.py`

This is where the actual inference happens. There are two distinct phases:

**Phase A — Startup (happens once when you run `python app.py`)**

```
1. Load all-MiniLM-L6-v2 from disk (downloaded from HuggingFace on first run)
2. Read foods.csv into memory
   → descriptions[]  : list of 7,756 food name strings
   → calories_arr[]  : numpy array of 7,756 calorie values
   → fat_arr[]       : numpy array of 7,756 fat values
   → protein_arr[]   : numpy array of 7,756 protein values
3. Check if food_embeddings.npy exists on disk
   YES → load the pre-computed matrix (fast, ~0.5s)
   NO  → run all 7,756 descriptions through the model in batches of 64
         this takes ~15 seconds on CPU
         save result to food_embeddings.npy for next time
4. food_embeddings shape: [7756, 384]
   → 7,756 rows, one per food
   → 384 columns, one per embedding dimension
```

**Phase B — Per-request inference (happens every time the button is clicked)**

```
Input: { dish: "Chicken Biryani", ingredients: "chicken, rice, spices" }

Step 1 — Build query string
  query = "Chicken Biryani, chicken, rice, spices"
  (combining dish + ingredients gives the model more signal)

Step 2 — Encode the query
  query_embedding = model.encode(["Chicken Biryani, chicken, rice, spices"])
  result shape: [1, 384]  → one vector of 384 numbers

Step 3 — Cosine similarity
  similarities = cosine_similarity(query_embedding, food_embeddings)
  result shape: [1, 7756]  → one similarity score per food item
  e.g. [0.12, 0.03, 0.91, 0.44, ...]

Step 4 — Rank and pick top 5
  sort similarities descending → get indices of top 5
  e.g.:
    index 3421 → "BIRYANI, CHICKEN, RESTAURANT-STYLE"  score: 0.91
    index 1823 → "Chicken, rice, Indian preparation"   score: 0.84
    index 5012 → "Rice with chicken, cooked"           score: 0.76
    index 2201 → "Chicken fried rice"                  score: 0.68
    index 4490 → "Chicken tikka masala with rice"      score: 0.61

Step 5 — Weighted average
  weights = [0.91, 0.84, 0.76, 0.68, 0.61] / sum([0.91, 0.84, 0.76, 0.68, 0.61])
          = [0.245, 0.226, 0.205, 0.183, 0.164]  (they add up to 1.0)

  calories = 0.245×190 + 0.226×205 + 0.205×180 + 0.183×220 + 0.164×230
           = 203  (rounded to nearest integer)

  same calculation for fat and protein

Step 6 — Return JSON
  {
    "calories":     203,
    "fat":          9,
    "protein":      16,
    "matched_food": "BIRYANI, CHICKEN, RESTAURANT-STYLE",
    "confidence":   0.91
  }
```

---

### Why the Embeddings Are Pre-Computed

Computing the embedding for a single sentence takes ~5ms. For 7,756 sentences that would be ~38 seconds — unacceptable for a button click.

Instead, we compute all 7,756 embeddings once at startup and store them as a matrix in memory. At request time we only need to:
1. Encode the user's query (1 sentence, ~5ms)
2. Do a matrix multiply against the pre-computed 7756×384 matrix (~2ms)

Total inference time: **under 10ms**. The pre-computation cost is paid once.

The matrix is also saved to `food_embeddings.npy` on disk so it does not have to be recomputed every time you restart the service.

---

### What Cosine Similarity Actually Computes

For two vectors A and B:

```
cosine_similarity(A, B) = (A · B) / (|A| × |B|)
```

`A · B` is the dot product (multiply element-by-element, then sum).
`|A|` is the length (magnitude) of vector A.

Dividing by the magnitudes normalises for vector length, so it only measures direction — two vectors pointing in the same direction score 1.0 regardless of how long they are.

In practice for our use case: two food descriptions that mean the same thing produce vectors pointing in nearly the same direction → high similarity score. Two unrelated foods produce vectors pointing in very different directions → low score.

---

## One-Line Summary

We convert food names into meaning-vectors using a pre-trained transformer model, then find the most similar foods in the USDA nutrition database using cosine similarity, and return a weighted average of their calorie values. No API. No training. Academically grounded. Fast.
