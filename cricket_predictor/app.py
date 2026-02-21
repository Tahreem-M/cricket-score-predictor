"""
Cricket Score Predictor - Flask Backend
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from model import train_models, predict

app = Flask(__name__)
CORS(app)

# Train models once on startup
train_models()


@app.route('/')
def index():
    """Render main UI."""
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict_route():
    """Accept JSON with pp_runs, pp_wkts, venue_avg and return predictions."""
    try:
        data = request.get_json(force=True)
        pp_runs = float(data.get('pp_runs', 50))
        pp_wkts = float(data.get('pp_wkts', 1))
        venue_avg = float(data.get('venue_avg', 165))

        result = predict(pp_runs, pp_wkts, venue_avg)
        return jsonify(result)

    except (TypeError, ValueError) as e:
        return jsonify({'error': 'Invalid input', 'detail': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
