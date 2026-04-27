import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import os

print("Starting model training...")

# ─── CROP RECOMMENDATION MODEL ────────────────────────────
print("\n[1/2] Training Crop Recommendation Model...")

try:
    df = pd.read_csv("Crop_recommendation.csv")
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"Crops: {df['label'].unique()}")

    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=None,
        min_samples_split=2
    )
    model.fit(X_train, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test))
    print(f"Crop model accuracy: {accuracy * 100:.2f}%")

    joblib.dump(model, "crop_model.pkl")
    joblib.dump(le, "label_encoder.pkl")
    print("crop_model.pkl saved!")
    print("label_encoder.pkl saved!")

except FileNotFoundError:
    print("ERROR: Crop_recommendation.csv not found!")
    print("Please download from: https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset")
    print("Creating dummy model for testing...")

    # Create dummy model so app still runs
    from sklearn.datasets import make_classification
    X_dummy, y_dummy = make_classification(
        n_samples=1000, n_features=7,
        n_classes=10, n_informative=7,
        n_redundant=0, random_state=42
    )
    dummy_model = RandomForestClassifier(n_estimators=10)
    dummy_model.fit(X_dummy, y_dummy)
    joblib.dump(dummy_model, "crop_model.pkl")

    le = LabelEncoder()
    le.fit(['rice','maize','chickpea','kidneybeans','pigeonpeas',
            'mothbeans','mungbean','blackgram','lentil','pomegranate',
            'banana','mango','grapes','watermelon','muskmelon','apple',
            'orange','papaya','coconut','cotton','jute','coffee'])
    joblib.dump(le, "label_encoder.pkl")
    print("Dummy crop_model.pkl created for testing!")

# ─── YIELD PREDICTION MODEL ───────────────────────────────
print("\n[2/2] Training Yield Prediction Model...")

np.random.seed(42)
n = 2000

area        = np.random.uniform(0.5, 15, n)
rainfall    = np.random.uniform(50, 300, n)
temperature = np.random.uniform(18, 42, n)
fertilizer  = np.random.uniform(10, 150, n)

# Realistic yield formula
yield_val = (
    area * 2.8
    + rainfall * 0.012
    + fertilizer * 0.06
    - (temperature - 28) * 0.15
    + np.random.normal(0, 0.25, n)
)
yield_val = np.clip(yield_val, 0.5, 12)

data = pd.DataFrame({
    'area': area,
    'rainfall': rainfall,
    'temperature': temperature,
    'fertilizer': fertilizer,
    'yield': yield_val
})

X_yield = data[['area', 'rainfall', 'temperature', 'fertilizer']]
y_yield = data['yield']

yield_model = LinearRegression()
yield_model.fit(X_yield, y_yield)

score = yield_model.score(X_yield, y_yield)
print(f"Yield model R² score: {score:.4f}")

joblib.dump(yield_model, "yield_model.pkl")
print("yield_model.pkl saved!")

# ─── VERIFY ALL FILES EXIST ───────────────────────────────
print("\n─── Verification ───")
files = ["crop_model.pkl", "label_encoder.pkl", "yield_model.pkl"]
for f in files:
    if os.path.exists(f):
        size = os.path.getsize(f)
        print(f"✅ {f} — {size} bytes")
    else:
        print(f"❌ {f} — MISSING!")

print("\n✅ All models ready! Now run: python app.py")