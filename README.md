#  Cricket Score Predictor

A Machine Learning web application that predicts the final score of a cricket innings
based on powerplay statistics and venue data.

Built as a Data Science project by **Tahreem Malik (023-23-0113)**

---
# Overview of the Project
This project applies regression-based machine learning on a cricket dataset to predict
the final innings score. Two models are compared: Linear Regression and Random Forest.

---

#  Dataset

| Feature | Description | Range |
|---|---|---|
| PP_Runs | Runs scored in powerplay | 30 – 70 |
| PP_Wkts | Wickets lost in powerplay | 0 – 3 |
| Venue_Avg | Average score at the venue | 140 – 190 |
| Final_Score | Target: Final innings total | 120 – 210 |

- Total records: 120
- No missing values

---

# Models Used

| Model | MAE | RMSE | R² Score |
|---|---|---|---|
| Linear Regression | 4.40 | 5.30 | 0.94 |
| Random Forest | 4.29 | 6.06 | 0.92 |

**Winner: Linear Regression** (higher R² on this dataset)

---

# Project Structure
```
cricket-score-predictor/
├── app.py                  # Flask backend
├── model.py                # ML model training and prediction
├── cricket_simple_dataset.csv  # Dataset
├── CricDS_Project.ipynb    # Jupyter Notebook (full analysis)
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html          # Frontend UI
└── static/
    ├── style.css           # Styling
    └── script.js           # Frontend logic
```

---

##  Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/cricket-score-predictor.git
cd cricket-score-predictor
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Flask app
```bash
python app.py
```

### 4. Open in browser
```
http://localhost:5000
```

---

##  Requirements
```
flask
flask-cors
pandas
numpy
scikit-learn
```

---

##  UI Features

- Input sliders for PP_Runs, PP_Wkts, and Venue_Avg
- Dual prediction cards (Linear Regression + Random Forest)
- Score interpretation labels (Below Par → Match-Winning)
- Bar chart comparison using Chart.js
- Responsive dark cricket-themed design

---
# Author

**Tahreem Malik**
Student ID: 023-23-0113
Data Science Project