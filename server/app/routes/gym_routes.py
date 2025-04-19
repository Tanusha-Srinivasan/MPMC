from flask import Blueprint, jsonify, request
from app.utils.gym_utils import calculate_consistency_score

gymBP = Blueprint("gym", __name__, url_prefix='/gym/v1')


@gymBP.route('/score', methods=['POST'])
def get_score():
    """
    Calculate consistency score for a gym user based on their RFID logs.
    
    Request body:
    {
        "uid": "AA6A06B0"  # RFID UID of the user
    }
    
    Returns:
        JSON response with consistency score and supporting metrics
    """
    try:
        data = request.get_json()
        
        if not data or 'uid' not in data:
            return jsonify({"error": "Missing UID parameter"}), 400
        
        uid = data.get('uid')
        score_data = calculate_consistency_score(uid)
        
        return jsonify(score_data)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
