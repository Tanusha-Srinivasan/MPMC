import pandas as pd
import numpy as np
import datetime
from collections import defaultdict
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Get the directory where your script is located
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
csv_path = os.path.join(BASE_DIR, 'RFID_logs.csv')

def calculate_consistency_score(uid):
    """
    Calculate a consistency score out of 100 for a specific gym user based on their RFID logs.
    """
    try:
        # Use absolute path to the CSV file
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        csv_path = os.path.join(base_dir, 'RFID_logs.csv')
        
        if not os.path.exists(csv_path):
            csv_path = os.path.join(os.getcwd(), 'RFID_logs.csv')
            
        # Load RFID logs
        df = pd.read_csv(csv_path)
        
        # Normalize UIDs to uppercase for case-insensitive comparison
        uid = uid.upper()
        df['UID'] = df['UID'].str.upper()
        
        # Filter data for the specific user
        user_data = df[df['UID'] == uid]
        
        if user_data.empty:
            return {"error": f"No gym attendance records found for RFID: {uid}"}
            
        # Continue with existing code...
        
        # Filter logs for the specific user
        user_logs = user_data.copy()
        
        if user_logs.empty:
            return {"score": 0, "message": "No gym activity found for this user"}
        
        # Convert date strings to datetime objects
        user_logs['DateTime'] = pd.to_datetime(user_logs['Date'] + ' ' + user_logs['Time'])
        user_logs['Date'] = pd.to_datetime(user_logs['Date'])
        
        # Group by date to count visits per day (multiple scans in one day = one visit)
        daily_visits = user_logs.groupby(user_logs['Date'].dt.date).size()
        
        # Calculate base metrics
        today = datetime.datetime.now().date()
        earliest_visit = min(daily_visits.index)
        total_days = (today - earliest_visit).days + 1
        visit_days = len(daily_visits)
        
        # Extract visit patterns
        user_logs['hour'] = user_logs['DateTime'].dt.hour
        user_logs['day_of_week'] = user_logs['DateTime'].dt.dayofweek  # 0=Monday, 6=Sunday
        
        # Feature extraction for ML model
        
        # 1. Frequency features
        frequency = visit_days / total_days
        
        # 2. Regularity features - how consistent are the days between visits
        visit_dates = sorted(daily_visits.index)
        if len(visit_dates) > 1:
            gaps = [(visit_dates[i+1] - visit_dates[i]).days for i in range(len(visit_dates)-1)]
            avg_gap = sum(gaps) / len(gaps)
            gap_std = np.std(gaps) if len(gaps) > 1 else 0
            consistency = 1 / (1 + gap_std) if gap_std > 0 else 1  # Higher consistency with lower std dev
        else:
            avg_gap = 0
            gap_std = 0
            consistency = 0
            
        # 3. Time of day preference
        morning_visits = len(user_logs[user_logs['hour'] < 12])
        afternoon_visits = len(user_logs[(user_logs['hour'] >= 12) & (user_logs['hour'] < 18)])
        evening_visits = len(user_logs[user_logs['hour'] >= 18])
        
        # 4. Day of week pattern
        day_counts = user_logs.groupby('day_of_week').size()
        days_visited = len(day_counts)
        
        # 5. Recent activity
        last_visit_date = max(daily_visits.index)
        days_since_last_visit = (today - last_visit_date).days
        
        # Generate user features for ML model
        features = {
            'frequency': frequency,
            'visit_days': visit_days, 
            'total_days': total_days,
            'avg_gap': avg_gap,
            'gap_std': gap_std,
            'consistency': consistency,
            'days_visited': days_visited,
            'morning_ratio': morning_visits / len(user_logs) if len(user_logs) > 0 else 0,
            'afternoon_ratio': afternoon_visits / len(user_logs) if len(user_logs) > 0 else 0,
            'evening_ratio': evening_visits / len(user_logs) if len(user_logs) > 0 else 0,
            'days_since_last_visit': days_since_last_visit
        }
        
        # Add day of week proportions
        for i in range(7):
            day_name = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i]
            features[f'day_{day_name}_ratio'] = day_counts.get(i, 0) / len(user_logs) if len(user_logs) > 0 else 0
            
        # Calculate traditional score based on heuristics (similar to original implementation)
        frequency_score = min(40, (frequency * 100) * 0.4)
        
        regularity_score = min(30, (days_visited / 7) * 15 + (1 - min(1, gap_std / 10)) * 15)
        
        recency_score = 0
        if days_since_last_visit == 0:
            recency_score = 30
        elif days_since_last_visit <= 2:
            recency_score = 25
        elif days_since_last_visit <= 5:
            recency_score = 15
        elif days_since_last_visit <= 10:
            recency_score = 10
        else:
            recency_score = max(0, 30 - days_since_last_visit)
        
        traditional_score = frequency_score + regularity_score + recency_score
        
        # Apply ML model enhancement
        ml_score = apply_ml_model(features)
        
        # Blend traditional and ML scores
        final_score = round(0.7 * traditional_score + 0.3 * ml_score)
        
        # User profile classification through clustering
        user_type, user_insights = classify_user_profile(features)
        
        # Prepare response with comprehensive insights
        result = {
            "score": final_score,
            "user_type": user_type,
            "insights": user_insights,
            "frequency": {
                "days_visited": visit_days,
                "total_days": total_days,
                "percentage": round(frequency * 100, 1),
                "score": round(frequency_score)
            },
            "regularity": {
                "distinct_days": days_visited,
                "avg_gap_between_visits": round(avg_gap, 1),
                "consistency_metric": round(consistency * 100, 1),
                "score": round(regularity_score),
                "day_pattern": {
                    "Monday": round(features["day_Monday_ratio"] * 100),
                    "Tuesday": round(features["day_Tuesday_ratio"] * 100),
                    "Wednesday": round(features["day_Wednesday_ratio"] * 100),
                    "Thursday": round(features["day_Thursday_ratio"] * 100),
                    "Friday": round(features["day_Friday_ratio"] * 100),
                    "Saturday": round(features["day_Saturday_ratio"] * 100),
                    "Sunday": round(features["day_Sunday_ratio"] * 100)
                },
                "time_pattern": {
                    "morning": round(features["morning_ratio"] * 100),
                    "afternoon": round(features["afternoon_ratio"] * 100),
                    "evening": round(features["evening_ratio"] * 100)
                }
            },
            "recency": {
                "days_since_last_visit": days_since_last_visit,
                "score": round(recency_score)
            }
        }
        
        return result
        
    except Exception as e:
        return {"score": 0, "error": str(e)}


def apply_ml_model(features):
    """
    Apply a machine learning model to enhance the consistency score.
    If the model doesn't exist yet, falls back to a heuristic approach.
    
    Args:
        features (dict): User features extracted from gym visit data
        
    Returns:
        float: ML-enhanced score from 0-100
    """
    model_path = 'app/models/gym_consistency_model.joblib'
    scaler_path = 'app/models/gym_consistency_scaler.joblib'
    
    try:
        # Check if model exists
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            # Load model and scaler
            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)
            
            # Convert features to vector
            feature_vector = np.array([
                features['frequency'],
                features['consistency'],
                features['days_since_last_visit'],
                features['morning_ratio'],
                features['afternoon_ratio'],
                features['evening_ratio'],
                features['day_Monday_ratio'],
                features['day_Tuesday_ratio'],
                features['day_Wednesday_ratio'],
                features['day_Thursday_ratio'],
                features['day_Friday_ratio'],
                features['day_Saturday_ratio'],
                features['day_Sunday_ratio']
            ]).reshape(1, -1)
            
            # Scale features
            scaled_features = scaler.transform(feature_vector)
            
            # Get prediction from model (assumes model outputs a score from 0-100)
            score = float(model.predict(scaled_features)[0])
            
            return score
        else:
            # If model doesn't exist, fall back to a synthetic score based on features
            frequency_weight = 45
            consistency_weight = 30
            recency_weight = 25
            
            # Frequency component
            frequency_component = features['frequency'] * 100
            
            # Consistency component
            consistency_component = features['consistency'] * 100
            
            # Recency component (higher score for more recent visits)
            recency_days = features['days_since_last_visit']
            if recency_days == 0:
                recency_component = 100
            elif recency_days <= 2:
                recency_component = 80
            elif recency_days <= 5:
                recency_component = 60
            elif recency_days <= 10:
                recency_component = 40
            else:
                recency_component = max(0, 100 - recency_days * 3)
                
            # Combine components
            synthetic_score = (
                frequency_component * frequency_weight / 100 +
                consistency_component * consistency_weight / 100 +
                recency_component * recency_weight / 100
            )
            
            return synthetic_score
    except Exception as e:
        print(f"ML model error: {e}")
        # Fallback if anything fails
        return features['frequency'] * 100


def classify_user_profile(features):
    """
    Classify the user into different gym attendance profiles using K-means clustering.
    If clustering model doesn't exist, creates a simple rule-based classification.
    
    Args:
        features (dict): User features extracted from gym visit data
        
    Returns:
        tuple: (user_type, insights) where user_type is a string and insights is a list of strings
    """
    # Simple rule-based classification if no model exists
    
    # Frequency classification
    frequency = features['frequency']
    if frequency > 0.7:
        frequency_type = "Frequent"
    elif frequency > 0.4:
        frequency_type = "Regular"
    elif frequency > 0.2:
        frequency_type = "Occasional"
    else:
        frequency_type = "Infrequent"
        
    # Time preference
    time_prefs = {
        "morning": features['morning_ratio'],
        "afternoon": features['afternoon_ratio'],
        "evening": features['evening_ratio']
    }
    preferred_time = max(time_prefs, key=time_prefs.get)
    
    # Day preference
    day_prefs = {
        "Weekday": sum([
            features['day_Monday_ratio'],
            features['day_Tuesday_ratio'],
            features['day_Wednesday_ratio'],
            features['day_Thursday_ratio'],
            features['day_Friday_ratio']
        ]),
        "Weekend": sum([
            features['day_Saturday_ratio'],
            features['day_Sunday_ratio']
        ])
    }
    preferred_days = max(day_prefs, key=day_prefs.get)
    
    # Consistency
    if features['consistency'] > 0.8:
        consistency_type = "highly consistent"
    elif features['consistency'] > 0.5:
        consistency_type = "somewhat consistent"
    else:
        consistency_type = "variable"
        
    # Determine user type
    user_type = f"{frequency_type} {preferred_time.title()} {preferred_days}"
    
    # Generate insights
    insights = []
    
    if frequency_type in ["Frequent", "Regular"]:
        insights.append(f"You maintain a {consistency_type} gym schedule.")
    else:
        insights.append("Increasing your gym visit frequency would significantly improve your score.")
    
    # Add time-specific insights
    if preferred_time == "morning":
        insights.append("You're an early bird! Morning workouts help boost metabolism all day.")
    elif preferred_time == "evening":
        insights.append("Evening workouts can help relieve stress from the day.")
    
    # Add regularity insights
    if features['gap_std'] > 5:
        insights.append("Your gym visits are somewhat irregular. A more consistent schedule could improve results.")
    
    # Add recency insights
    if features['days_since_last_visit'] > 7:
        insights.append(f"It's been {features['days_since_last_visit']} days since your last visit. Time to get back!")
    
    return user_type, insights


def train_models_from_data():
    """
    Train ML models for scoring and clustering based on existing data.
    """
    try:
        # Use absolute path to the CSV file
        csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'RFID_logs.csv')
        
        # Load RFID logs
        df = pd.read_csv(csv_path)
        
        if df.empty:
            return {"error": "No data available for training"}
            
        # Get unique users
        unique_uids = df['UID'].unique()
        
        # Extract features for all users
        all_features = []
        
        for uid in unique_uids:
            user_logs = df[df['UID'] == uid].copy()
            
            # Convert date strings to datetime objects
            user_logs['DateTime'] = pd.to_datetime(user_logs['Date'] + ' ' + user_logs['Time'])
            user_logs['Date'] = pd.to_datetime(user_logs['Date'])
            
            # Group by date to count visits per day
            daily_visits = user_logs.groupby(user_logs['Date'].dt.date).size()
            
            # Skip users with too few visits
            if len(daily_visits) < 3:
                continue
                
            # Calculate metrics (similar to those in calculate_consistency_score function)
            today = datetime.datetime.now().date()
            earliest_visit = min(daily_visits.index)
            total_days = (today - earliest_visit).days + 1
            visit_days = len(daily_visits)
            
            # Extract features
            frequency = visit_days / total_days
            
            # Gaps between visits
            visit_dates = sorted(daily_visits.index)
            gaps = [(visit_dates[i+1] - visit_dates[i]).days for i in range(len(visit_dates)-1)]
            avg_gap = sum(gaps) / len(gaps) if gaps else 0
            gap_std = np.std(gaps) if len(gaps) > 1 else 0
            consistency = 1 / (1 + gap_std) if gap_std > 0 else 1
            
            # Time and day patterns
            user_logs['hour'] = user_logs['DateTime'].dt.hour
            user_logs['day_of_week'] = user_logs['DateTime'].dt.dayofweek
            
            morning_visits = len(user_logs[user_logs['hour'] < 12])
            afternoon_visits = len(user_logs[(user_logs['hour'] >= 12) & (user_logs['hour'] < 18)])
            evening_visits = len(user_logs[user_logs['hour'] >= 18])
            
            day_counts = user_logs.groupby('day_of_week').size()
            days_visited = len(day_counts)
            
            # Recent activity
            last_visit_date = max(daily_visits.index)
            days_since_last_visit = (today - last_visit_date).days
            
            # Create feature vector
            feature_vector = [
                frequency,
                consistency,
                days_since_last_visit,
                morning_visits / len(user_logs) if len(user_logs) > 0 else 0,
                afternoon_visits / len(user_logs) if len(user_logs) > 0 else 0,
                evening_visits / len(user_logs) if len(user_logs) > 0 else 0
            ]
            
            # Add day of week ratios
            for i in range(7):
                feature_vector.append(day_counts.get(i, 0) / len(user_logs) if len(user_logs) > 0 else 0)
                
            all_features.append(feature_vector)
        
        if not all_features:
            return {"error": "Not enough data to train models"}
            
        # Convert to numpy array
        X = np.array(all_features)
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train K-means clustering model
        kmeans = KMeans(n_clusters=4, random_state=42)
        kmeans.fit(X_scaled)
        
        # Save models
        os.makedirs('app/models', exist_ok=True)
        joblib.dump(kmeans, 'app/models/gym_consistency_model.joblib')
        joblib.dump(scaler, 'app/models/gym_consistency_scaler.joblib')
        
        return {"success": "Models trained successfully"}
        
    except Exception as e:
        return {"error": str(e)}