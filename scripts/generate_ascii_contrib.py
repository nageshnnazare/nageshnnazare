import os
import requests
import json
from datetime import datetime

TOKEN = os.getenv("GITHUB_TOKEN")
USERNAME = os.getenv("GITHUB_USERNAME")

query = """
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
"""

def get_contributions():
    url = "https://api.github.com/graphql"
    headers = {"Authorization": f"bearer {TOKEN}"}
    payload = {"query": query, "variables": {"username": USERNAME}}
    
    print(f"Fetching contributions for user: {USERNAME}")
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"Query failed with status {response.status_code}: {response.text}")
    
    res_json = response.json()
    if "errors" in res_json:
        raise Exception(f"GraphQL Errors: {json.dumps(res_json['errors'], indent=2)}")
        
    return res_json

def generate_ascii(data):
    weeks = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]["weeks"]
    
    # Limit to last ~7 months (30 weeks)
    weeks = weeks[-30:]
    
    # Symbols for different levels of contributions
    # 0, 1-3, 4-6, 7-9, 10+
    symbols = [" ", "░", "▒", "▓", "█"]
    
    # Grid for 7 days x 13 weeks
    grid = [[" " for _ in range(len(weeks))] for _ in range(7)]
    
    for w_idx, week in enumerate(weeks):
        for day in week["contributionDays"]:
            d_idx = datetime.strptime(day["date"], "%Y-%m-%d").weekday()
            # GitHub calendar starts on Sunday (index 0 usually in their API, 
            # but Python's weekday() is Mon=0, Sun=6. 
            # Let's adjust to Sun=0, Mon=1... Sat=6)
            d_idx = (d_idx + 1) % 7 
            
            count = day["contributionCount"]
            if count == 0:
                s = symbols[0]
            elif count < 3:
                s = symbols[1]
            elif count < 6:
                s = symbols[2]
            elif count < 10:
                s = symbols[3]
            else:
                s = symbols[4]
            grid[d_idx][w_idx] = s

    # Convert grid to string
    days_labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    output = "   " + " ".join([str(i%10) for i in range(len(weeks))]) + "\n"
    for i, row in enumerate(grid):
        output += f"{days_labels[i]} " + " ".join(row) + "\n"
    
    return output

def update_readme(ascii_art):
    # Search in current and parent dirs for local testing
    readme_path = "README.md"
    if not os.path.exists(readme_path):
        readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
    
    if not os.path.exists(readme_path):
        print(f"README.md not found at {readme_path}.")
        return

    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    start_tag = "<!-- ASCII_CONTRIBUTION_START -->"
    end_tag = "<!-- ASCII_CONTRIBUTION_END -->"
    
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)

    if start_idx != -1 and end_idx != -1:
        new_content = (
            content[:start_idx + len(start_tag)] + 
            "\n```text\n" + ascii_art + "```\n" + 
            content[end_idx:]
        )
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Successfully updated {readme_path} with ASCII contribution graph.")
    else:
        print("Placeholders not found in README.md.")

# Mock data for testing
MOCK_DATA = {
    "data": {
        "user": {
            "contributionsCollection": {
                "contributionCalendar": {
                    "weeks": [
                        {"contributionDays": [{"date": f"2023-01-{i:02d}", "contributionCount": i % 15} for i in range(1, 8)]}
                        for _ in range(53)
                    ]
                }
            }
        }
    }
}

if __name__ == "__main__":
    try:
        if not TOKEN or not USERNAME:
            print("No GITHUB_TOKEN or GITHUB_USERNAME found. Running in MOCK/TEST mode...")
            data = MOCK_DATA
        else:
            data = get_contributions()
            
        ascii_art = generate_ascii(data)
        
        # Write to a txt file as well for reference
        with open("CONTRIBUTIONS.txt", "w", encoding="utf-8") as f:
            f.write(ascii_art)
        
        # Inject into README
        update_readme(ascii_art)
        
        print("ASCII contribution graph process complete.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
