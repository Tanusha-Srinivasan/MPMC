import pandas as pd
import datetime
from collections import defaultdict

def calculate_consistency_score(uid):
    """
    Calculate a consistency score out of 100 for a specific gym user based on their RFID logs.
    
    The scoring algorithm considers:
    - Frequency of gym visits
    - Regularity (consistent days/times)
    - Recent activity
    
    Args:
        uid (str): The UID of the gym member
        
    Returns:
        dict: Dictionary containing score and supporting metrics
    """
    try:
        # Load RFID logs
        df = pd.read_csv('RFID_logs.csv')
        
        # Filter logs for the specific user
        user_logs = df[df['UID'] == uid].copy()
        
        if user_logs.empty:
            return {"score": 0, "message": "No gym activity found for this user"}
        
        # Convert date strings to datetime objects
        user_logs['DateTime'] = pd.to_datetime(user_logs['Date'] + ' ' + user_logs['Time'])
        
        # Group by date to count visits per day (multiple scans in one day = one visit)
        user_logs['Date'] = pd.to_datetime(user_logs['Date'])
        daily_visits = user_logs.groupby(user_logs['Date'].dt.date).size()
        
        # Calculate metrics
        total_days = (datetime.datetime.now().date() - min(daily_visits.index)).days + 1
        visit_days = len(daily_visits)
        
        # Calculate frequency score (percentage of days visited, max 40 points)
        frequency_score = min(40, (visit_days / total_days) * 40)
        
        # Calculate regularity score (consistency of visit days, max 30 points)
        day_counts = defaultdict(int)
        for date_val in user_logs['Date']:
            day_name = date_val.day_name()
            day_counts[day_name] += 1
        
        # Higher score for consistent weekly patterns
        distinct_days = len(day_counts)
        regularity_score = min(30, (distinct_days / 7) * 30)
        
        # Calculate recency score (max 30 points)
        today = datetime.datetime.now().date()
        latest_visit = max(user_logs['Date']).date()
        days_since_last_visit = (today - latest_visit).days
        
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
        
        # Calculate final score
        final_score = round(frequency_score + regularity_score + recency_score)
        
        # Prepare response
        result = {
            "score": final_score,
            "frequency": {
                "days_visited": visit_days,
                "total_days": total_days,
                "score": round(frequency_score)
            },
            "regularity": {
                "distinct_days": distinct_days,
                "day_pattern": dict(day_counts),
                "score": round(regularity_score)
            },
            "recency": {
                "days_since_last_visit": days_since_last_visit,
                "score": round(recency_score)
            }
        }
        
        return result
        
    except Exception as e:
        return {"score": 0, "error": str(e)}