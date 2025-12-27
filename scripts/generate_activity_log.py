import os
import requests
from datetime import datetime

TOKEN = os.getenv("GITHUB_TOKEN")
USERNAME = os.getenv("GITHUB_USERNAME", "nageshnnazare")

def get_activity():
    url = f"https://api.github.com/users/{USERNAME}/events/public"
    headers = {"Authorization": f"bearer {TOKEN}"} if TOKEN else {}
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    return []

def format_log(events):
    if not events:
        return "(No recent activity found in system logs...)"
    
    logs = []
    # Limit to top 10 recent events
    for event in events[:10]:
        e_type = event["type"]
        repo = event["repo"]["name"].split("/")[-1]
        dt = datetime.strptime(event["created_at"], "%Y-%m-%dT%H:%M:%SZ")
        timestamp = dt.strftime("%b %d %H:%M:%S")
        
        msg = ""
        if e_type == "PushEvent":
            commits = len(event["payload"].get("commits", []))
            msg = f"kernel: [PUSH] {commits} commits to '{repo}'"
        elif e_type == "CreateEvent":
            ref_type = event["payload"].get("ref_type", "resource")
            msg = f"systemd[1]: Created new {ref_type} in '{repo}'"
        elif e_type == "PullRequestEvent":
            action = event["payload"].get("action", "processed")
            number = event["payload"].get("number", "0")
            msg = f"systemd[1]: {action.capitalize()} PR #{number} in '{repo}'"
        elif e_type == "WatchEvent":
            msg = f"sshd[{1024 + dt.second}]: Starred repository '{repo}'"
        else:
            msg = f"systemd[1]: Processed {e_type} in '{repo}'"
            
        logs.append(f"{timestamp} hpc {msg}")
        
    return "\n".join(logs)

def update_readme(log_text):
    readme_path = "README.md"
    if not os.path.exists(readme_path):
        readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
    
    if not os.path.exists(readme_path): return

    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    start_tag = "<!-- ACTIVITY_LOG_START -->"
    end_tag = "<!-- ACTIVITY_LOG_END -->"
    
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)

    if start_idx != -1 and end_idx != -1:
        replacement = f'\n```text\n{log_text}\n```\n'
        new_content = content[:start_idx + len(start_tag)] + replacement + content[end_idx:]
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(new_content)

if __name__ == "__main__":
    events = get_activity()
    log_text = format_log(events)
    update_readme(log_text)
    print("Activity log updated.")
