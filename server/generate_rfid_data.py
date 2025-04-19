import csv
import random
import datetime

# Define UIDs for several users
uids = [
    "AA6A06B0",  # Existing user ID
    "23FF6AAD",  # Existing user ID
    "5F9E2C14",
    "B7D8A621",
    "3C41E9F5",
    "76A2D0BE",
    "9F83C475",
    "12E5B94D"
]

# Define parameters for generating logs
start_date = datetime.datetime(2025, 1, 1)  # Start from Jan 1, 2025
end_date = datetime.datetime(2025, 4, 19)   # End at current date
gym_open_hour = 6   # Gym opens at 6 AM
gym_close_hour = 23 # Gym closes at 11 PM

# Create user patterns (some users are morning people, some evening, some irregular)
user_patterns = {
    "AA6A06B0": {"frequency": 0.8, "morning": 0.7, "afternoon": 0.2, "evening": 0.1},  # Morning person, frequent
    "23FF6AAD": {"frequency": 0.3, "morning": 0.1, "afternoon": 0.3, "evening": 0.6},  # Evening person, less frequent
    "5F9E2C14": {"frequency": 0.6, "morning": 0.2, "afternoon": 0.6, "evening": 0.2},  # Afternoon person
    "B7D8A621": {"frequency": 0.9, "morning": 0.4, "afternoon": 0.4, "evening": 0.2},  # Very frequent, varied times
    "3C41E9F5": {"frequency": 0.2, "morning": 0.3, "afternoon": 0.3, "evening": 0.4},  # Infrequent
    "76A2D0BE": {"frequency": 0.7, "morning": 0.1, "afternoon": 0.2, "evening": 0.7},  # Evening person, frequent
    "9F83C475": {"frequency": 0.4, "morning": 0.5, "afternoon": 0.3, "evening": 0.2},  # Somewhat regular, morning
    "12E5B94D": {"frequency": 0.5, "morning": 0.3, "afternoon": 0.4, "evening": 0.3}   # Average all around
}

# Generate logs
logs = []

# Add existing data from the file
existing_logs = [
    ["Month", "Week", "Day", "Date", "Time", "UID"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:10", "AA6A06B0"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:13", "23FF6AAD"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:15", "AA6A06B0"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:17", "AA6A06B0"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:19", "AA6A06B0"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:21", "23FF6AAD"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:24", "AA6A06B0"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:25", "AA6A06B0"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:27", "23FF6AAD"],
    ["April", "15", "Saturday", "2025-04-19", "11:15:28", "23FF6AAD"]
]

logs.extend(existing_logs)

# Generate new data
current_date = start_date
while current_date <= end_date:
    # For each day
    date_str = current_date.strftime("%Y-%m-%d")
    day_name = current_date.strftime("%A")
    month_name = current_date.strftime("%B")
    week_num = current_date.strftime("%U")  # Week number of the year
    
    # For each user
    for uid in uids:
        pattern = user_patterns[uid]
        
        # Check if user visits the gym today based on their frequency
        if random.random() < pattern["frequency"]:
            # Determine what time of day they visit
            time_of_day = random.choices(
                ["morning", "afternoon", "evening"],
                weights=[pattern["morning"], pattern["afternoon"], pattern["evening"]]
            )[0]
            
            # Generate a time based on time of day
            if time_of_day == "morning":
                hour = random.randint(6, 11)
            elif time_of_day == "afternoon":
                hour = random.randint(12, 17)
            else:  # evening
                hour = random.randint(18, 22)
                
            minute = random.randint(0, 59)
            second = random.randint(0, 59)
            time_str = f"{hour:02d}:{minute:02d}:{second:02d}"
            
            # Add an entry for when they check in
            logs.append([month_name, week_num, day_name, date_str, time_str, uid])
            
            # Sometimes add multiple swipes in succession (forgot something, etc.)
            if random.random() < 0.3:
                for _ in range(random.randint(1, 4)):
                    # A few seconds later
                    second = (second + random.randint(1, 10)) % 60
                    time_str = f"{hour:02d}:{minute:02d}:{second:02d}"
                    logs.append([month_name, week_num, day_name, date_str, time_str, uid])
    
    # Move to next day
    current_date += datetime.timedelta(days=1)

# Shuffle the non-header logs to make it more realistic
header = logs[0]
data = logs[1:]
random.shuffle(data)
logs = [header] + data

# Ensure we have at least 500 entries by duplicating if needed
while len(logs) < 500:
    duplicate = random.choice(logs[1:])  # Skip header when choosing
    logs.append(duplicate)

# Write to CSV file
with open('/home/navadeep/Documents/Projects/MPMC/server/RFID_logs.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    for row in logs:
        writer.writerow(row)

print(f"Generated {len(logs)} RFID log entries")