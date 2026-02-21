"""
Cricket Score Predictor - ML Model
Trains Linear Regression and Random Forest models on cricket dataset.
"""

import os
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# Path to dataset (relative to this script)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(SCRIPT_DIR, 'cricket_simple_dataset.csv')

# Model instances (trained on startup)
lr_model = None
rf_model = None
lr_r2 = None
rf_r2 = None


def train_models():
    """Load data and train both models. Call once on app startup."""
    global lr_model, rf_model, lr_r2, rf_r2

    df = pd.read_csv(DATASET_PATH)

    X = df[['PP_Runs', 'PP_Wkts', 'Venue_Avg']]
    y = df['Final_Score']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Linear Regression
    lr_model = LinearRegression()
    lr_model.fit(X_train, y_train)
    lr_pred = lr_model.predict(X_test)
    lr_r2 = r2_score(y_test, lr_pred)

    # Random Forest
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    rf_pred = rf_model.predict(X_test)
    rf_r2 = r2_score(y_test, rf_pred)


def predict(pp_runs: float, pp_wkts: float, venue_avg: float) -> dict:
    """
    Predict final score using both models.
    Returns dict with linear_regression, random_forest, lr_r2, rf_r2.
    """
    global lr_model, rf_model, lr_r2, rf_r2

    if lr_model is None or rf_model is None:
        raise RuntimeError("Models not trained. Call train_models() first.")

    import numpy as np
    X = np.array([[pp_runs, pp_wkts, venue_avg]])

    lr_pred = lr_model.predict(X)[0]
    rf_pred = rf_model.predict(X)[0]

    return {
        "linear_regression": int(round(lr_pred)),
        "random_forest": int(round(rf_pred)),
        "lr_r2": round(lr_r2, 2),
        "rf_r2": round(rf_r2, 2)
    }
