from flask import Blueprint, request, jsonify, make_response
import pandas as pd
import os
from app.utils.gym_utils import calculate_consistency_score, train_models_from_data

# Create the blueprint with proper configuration
gymBP = Blueprint('gym', __name__)

@gymBP.route('/score', methods=['POST', 'OPTIONS'])
def get_consistency_score():
    """
    Calculate ML-enhanced consistency score for a gym user based on their RFID logs.
    
    Request body:
    {
        "uid": "AA6A06B0"  # RFID UID of the user
    }
    
    Returns:
        JSON response with consistency score, user classification, and insights
    """
    # Handle OPTIONS request (preflight)
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        return response
        
    # Handle POST request
    data = request.get_json()
    uid = data.get('uid', '')
    
    if not uid:
        return jsonify({"error": "UID is required"}), 400
    
    result = calculate_consistency_score(uid)
    return jsonify(result)

@gymBP.route('/available-rfids', methods=['GET', 'OPTIONS'])
def get_available_rfids():
    # Handle OPTIONS request (preflight)
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        return response
        
    try:
        # Use absolute path to the CSV file
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        csv_path = os.path.join(base_dir, 'RFID_logs.csv')
        
        # Check if file exists
        if not os.path.exists(csv_path):
            csv_path = os.path.join(os.getcwd(), 'RFID_logs.csv')
        
        # Load RFID logs
        df = pd.read_csv(csv_path)
        
        # Get unique UIDs
        uids = df['UID'].unique().tolist()
        
        # Count occurrences of each UID
        uid_counts = df['UID'].value_counts().to_dict()
        
        # Format response
        result = [
            {"uid": uid, "records": uid_counts.get(uid, 0)} 
            for uid in sorted(uids)
        ]
        
        return jsonify({"rfids": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@gymBP.route('/v1/train-models', methods=['POST'])
def train_models():
    """
    Admin endpoint to train or retrain the ML models based on current data.
    
    Returns:
        JSON response with training status
    """
    try:
        result = train_models_from_data()
        return jsonify({"message": "Models trained successfully", "details": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
