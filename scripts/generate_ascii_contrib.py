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
    
    # Limit to last ~9 months (40 weeks)
    weeks = weeks[-40:]
    
    # Symbols for different levels of contributions
    symbols = [" ", "░", "▒", "▓", "█"]
    
    # Grid for 7 days x 40 weeks
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

def generate_svg(ascii_art):
    tux = [
        "       .--.      ",
        "      |o_o |     ",
        "      |:_/ |     ",
        "     //   \\ \\    ",
        "    (|     | )   ",
        "   /'\\_   _/` \\  ",
        "   \\___)=(___/   "
    ]
    
    # Escape for XML
    safe_ascii = ascii_art.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    contrib_lines = safe_ascii.split("\n")
    
    # Merge Tux (left) and Contrib (right)
    # Tux has 7 lines, Contrib usually has 8-9 including labels
    max_lines = max(len(tux), len(contrib_lines))
    merged_lines = []
    for i in range(max_lines):
        tux_part = tux[i] if i < len(tux) else " " * 17
        contrib_part = contrib_lines[i] if i < len(contrib_lines) else ""
        merged_lines.append(tux_part + "  " + contrib_part)
    
    # Calculate dimensions
    width = 1000
    line_height = 20
    height = len(merged_lines) * line_height + 60
    
    svg_template = f"""<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
        .terminal {{
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px;
            fill: #7AA2F7;
            white-space: pre;
            text-shadow: 0 0 2px #7AA2F7;
        }}
        .bg {{ fill: #1a1b26; rx: 10; }}
        .header {{ fill: #24283b; rx: 10 10 0 0; }}
        .label {{ fill: #565f89; font-family: monospace; font-size: 12px; }}
    </style>
    
    <rect width="{width}" height="{height}" class="bg" />
    
    <!-- Moving Scanline -->
    <rect width="{width}" height="4" fill="#7AA2F7" opacity="0.05">
        <animateTransform attributeName="transform" type="translate" from="0 -10" to="0 {height}" dur="7s" repeatCount="indefinite" />
    </rect>
    
    <!-- Static Header -->
    <rect width="{width}" height="30" class="header" />
    <circle cx="20" cy="15" r="5" fill="#F7768E" />
    <circle cx="40" cy="15" r="5" fill="#E0AF68" />
    <circle cx="60" cy="15" r="5" fill="#9ECE6A" />
    <text x="80" y="20" class="label">nagesh@hpc:~/contributions</text>
    
    <g>
        <animate attributeName="opacity" values="0.97;1;0.98;1;0.97" dur="0.1s" repeatCount="indefinite" />
        
        <text x="20" y="50" class="terminal">
"""
    for i, line in enumerate(merged_lines):
        svg_template += f'            <tspan x="20" dy="1.2em">{line}</tspan>\n'
        
    svg_template += f"""        </text>
        
        <!-- Typing Cursor -->
        <rect x="20" y="55" width="8" height="15" fill="#7AA2F7">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
            <animate attributeName="x" from="200" to="800" dur="10s" repeatCount="indefinite" />
            <animate attributeName="y" values="55;{height-20}" dur="60s" repeatCount="indefinite" />
        </rect>
    </g>
</svg>"""
    
    with os.fdopen(os.open("contributions.svg", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644), "w", encoding="utf-8") as f:
        f.write(svg_template)
    print("contributions.svg generated.")

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
        # Show both the animated SVG and the raw text log
        replacement = f'\n<p align="center"><img src="./contributions.svg" width="100%" /></p>\n\n```text\n{ascii_art}```\n'
        new_content = (
            content[:start_idx + len(start_tag)] + 
            replacement + 
            content[end_idx:]
        )
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Successfully updated {readme_path} with ASCII contribution graph and SVG.")
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
        
        # Generate SVG
        generate_svg(ascii_art)
        
        # Inject into README
        update_readme(ascii_art)
        
        print("ASCII contribution graph process complete.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
