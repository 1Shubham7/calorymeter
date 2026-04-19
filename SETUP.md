# Subprojects Setup Guide

This file covers setup for the two subprojects included in this repo:

- **[caloritrack-app](#caloritrack-app)** — React Native mobile app (food photo → calorie estimation)
- **[caloritrack-engine](#caloritrack-engine)** — Python/Jupyter model training notebooks

---

# caloritrack-app

A React Native + Expo app that uses a TensorFlow.js deep learning model to analyze food photos and predict food category, ingredients, calories, carbs, protein, and fat. The model runs fully on-device — no backend needed.

## How It Works

1. You take/upload a food photo
2. The app downloads a pre-trained TF.js model from GitHub releases (first launch only)
3. Model runs locally on your phone — predicts food type + macros
4. You adjust portion size; results are saved to local SQLite

---

## Prerequisites

| Tool | Required version | Check |
|---|---|---|
| Node.js | >= 16 | `node --version` |
| npm | any | `npm --version` |
| Expo account | free | [expo.dev](https://expo.dev/signup) |
| EAS CLI | latest | installed in Step 1 |
| Android phone | any modern Android | for installing the APK |

> You already have Node 24 installed — you're good there.

---

## Step 1 — Install EAS CLI and Log In

EAS (Expo Application Services) builds your APK in the cloud — you don't need Android Studio or an Android SDK installed locally.

```bash
npm install -g eas-cli
```

Create a free account at [expo.dev/signup](https://expo.dev/signup) if you don't have one, then:

```bash
eas login
# Enter your Expo email and password when prompted
```

---

## Step 2 — Install Dependencies

```bash
cd caloritrack-app
npm install
```

---

## Step 3 — Link to Your Own Expo Project

The `eas.json` currently has the original author's project ID. You need to register this project under your own account:

```bash
eas build:configure
```

When it asks:
- **"Would you like to automatically create an EAS project..."** → press **Y**
- This updates `app.config.js` with a new `projectId` tied to your account

---

## Step 4 — Build the APK

Run the EAS cloud build for Android:

```bash
eas build --profile development --platform android
```

What happens:
1. EAS uploads your code to Expo's build servers
2. Builds a debug APK in the cloud (takes ~10–15 minutes)
3. When done, prints a **download URL** for the APK

Download the APK from that URL (or scan the QR code it shows).

> The `development` profile builds a debug APK that includes a dev client. This is what you want for testing on your phone.

---

## Step 5 — Install the APK on Your Phone

**On your Android phone:**

1. Go to **Settings → Security** (or Privacy) → enable **"Install unknown apps"** / **"Unknown sources"**
2. Transfer the downloaded APK to your phone (send via Google Drive, email, USB, etc.)
3. Open the APK file on your phone → tap Install

---

## Step 6 — Run the Dev Server and Connect

After installing the app on your phone, start the development server on your computer:

```bash
npm start
```

This prints a URL and QR code. Open the installed app on your phone → it will ask for the server URL. Either:
- Scan the QR code, or
- Type the URL shown (like `exp+FoodNet-App://expo-development-client/?url=http://192.168.x.x:8081`)

Make sure **your phone and computer are on the same Wi-Fi network**.

---

## Building a Standalone APK (No Dev Server Needed)

If you want an APK that runs without a dev server — i.e., a proper self-contained app:

```bash
eas build --profile preview --platform android
```

The `preview` profile in `eas.json` builds a standalone internal distribution APK. Install it the same way as above, and it runs without needing `npm start`.

---

## Troubleshooting

| Error | Fix |
|---|---|
| `eas: command not found` | Run `npm install -g eas-cli` |
| `Not logged in` | Run `eas login` |
| Build fails with "project not found" | Run `eas build:configure` first |
| App installs but shows blank screen | Make sure dev server is running (`npm start`) and phone/PC are on same Wi-Fi |
| APK won't install on phone | Enable "Install unknown apps" in phone Settings |
| `npm install` fails | Delete `node_modules/` and `package-lock.json`, then retry |

---

# caloritrack-engine

The model training project that produced the TF.js model used by caloritrack-app. This is a set of **Jupyter notebooks** — not a running service. You only need this if you want to re-train or experiment with the model.

> **If you just want to run the app:** skip this section entirely. The app auto-downloads the pre-trained model from GitHub releases.

---

## What's Inside

```
caloritrack-engine/
├── environment.yml              # Conda environment (Python 3.8 + TF 2.8)
├── Food Datasets/               # Dataset setup instructions (data downloaded separately)
│   ├── Nutrition5k/             # ~271k images with nutrition labels
│   ├── Food101/                 # 101 food categories, ~75k images
│   ├── Recipes5k/               # ~40k recipe images
│   └── final-dataset/           # Preprocessed combined dataset
├── main/
│   ├── data_pipeline.ipynb      # Step 1: serialize datasets to TFRecord
│   └── build_model.ipynb        # Step 2: train EfficientNetB1 multi-task model
└── Ingredient Embeddings/
    └── ingredient_embeddings_similarity.ipynb
```

---

## Prerequisites

- **Anaconda or Miniconda** — the environment is managed via conda

Install Miniconda (lighter than full Anaconda):

```bash
# Linux
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
# Follow prompts, restart terminal after
```

---

## Step 1 — Create the Conda Environment

```bash
cd caloritrack-engine
conda env create -f environment.yml
conda activate PY38-TF28
```

This installs: Python 3.8, TensorFlow 2.8, Keras, pandas, numpy, matplotlib, scikit-learn, jupyter.

---

## Step 2 — Launch Jupyter

```bash
jupyter notebook
```

Opens in your browser. Navigate to the `main/` folder.

---

## Step 3 — Explore or Train (Optional)

The notebooks must be run in order:

1. **First:** Follow the README in each `Food Datasets/` subdirectory to download the datasets (large downloads — several GB total)
2. **Then:** Run `main/data_pipeline.ipynb` to preprocess datasets into TFRecord format
3. **Finally:** Run `main/build_model.ipynb` to train the model (~many hours, GPU recommended)

### GPU Setup (Optional but strongly recommended for training)

Without GPU, training will take days. If you have an NVIDIA GPU:

```bash
# Install CUDA 11.2 + cuDNN 8.1 (required for TF 2.8)
# Follow: https://www.tensorflow.org/install/pip
```

> Training is not required to use the app. The app already uses the pre-trained model hosted at github.com/Cheng-K/FoodNet-Model/releases/latest

---

## Troubleshooting

| Error | Fix |
|---|---|
| `conda: command not found` | Restart terminal after Miniconda install, or run `~/miniconda3/bin/conda init` |
| `conda env create` fails | Run `conda update conda` first |
| Jupyter won't open | Run `pip install jupyter` inside the activated env |
| TF import error in notebook | Make sure env is activated: `conda activate PY38-TF28` |
