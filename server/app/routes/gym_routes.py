from flask import Blueprint, jsonify, request
from app.utils.gym_utils import calculate_consistency_score, train_models_from_data

gymBP = Blueprint("gym", __name__, url_prefix='/gym/v1')


@gymBP.route('/score', methods=['POST'])
def get_score():
    """
    Calculate ML-enhanced consistency score for a gym user based on their RFID logs.
    
    Request body:
    {
        "uid": "AA6A06B0"  # RFID UID of the user
    }
    
    Returns:
        JSON response with consistency score, user classification, and insights
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


@gymBP.route('/train-models', methods=['POST'])
def train_models():
    """
    Admin endpoint to train or retrain the ML models based on current data.
    
    Returns:
        JSON response with training status
    """
    try:
        result = train_models_from_data()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@gymBP.route('/users/<uid>/insights', methods=['GET'])
def get_user_insights(uid):
    """
    Get detailed insights for a specific user.
    
    Returns:
        JSON response with detailed user insights and recommendations
    """
    try:
        score_data = calculate_consistency_score(uid)
        
        # Add personalized recommendations based on user profile
        if "user_type" in score_data:
            recommendations = generate_recommendations(score_data)
            score_data["recommendations"] = recommendations
            
        return jsonify(score_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def generate_recommendations(score_data):
    """
    Generate personalized recommendations based on user profile.
    
    Args:
        score_data (dict): User score and profile data
        
    Returns:
        list: Personalized recommendations
    """
    recommendations = []
    
    # Frequency recommendations
    if score_data["frequency"]["percentage"] < 30:
        recommendations.append("Try setting a goal to visit the gym at least 2-3 times per week")
    
    # Consistency recommendations
    regularity = score_data["regularity"]
    
    if regularity["consistency_metric"] < 50:
        recommendations.append("Your workout schedule varies a lot. Try to establish a more consistent routine")
    
    # Time pattern recommendations
    time_pattern = regularity["time_pattern"]
    max_time = max(time_pattern, key=time_pattern.get)
    
    if max_time == "morning" and time_pattern["morning"] > 70:
        recommendations.append("You're a morning person! Consider joining our early bird group classes")
    elif max_time == "evening" and time_pattern["evening"] > 70:
        recommendations.append("You prefer evening workouts. Our evening HIIT classes might be perfect for you")
    
    # Day pattern recommendations
    day_pattern = regularity["day_pattern"]
    
    # Find days with low attendance
    low_days = [day for day, pct in day_pattern.items() if pct < 5]
    if low_days:
        day_str = ", ".join(low_days)
        recommendations.append(f"You rarely visit on {day_str}. Our special classes on these days might interest you")
    
    # Recency recommendations
    if score_data["recency"]["days_since_last_visit"] > 7:
        recommendations.append("It's been a while since your last visit. We miss you! Come back for a free fitness assessment")
    
    return recommendations
