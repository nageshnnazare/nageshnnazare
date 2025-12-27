import requests
import json
import os
from datetime import datetime

TOKEN = os.getenv("GITHUB_TOKEN")
USERNAME = os.getenv("GITHUB_USERNAME", "nageshnnazare")

query = """
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
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
    symbols = [" ", "░", "▒", "▓", "█"]
    grid = [[" " for _ in range(len(weeks))] for _ in range(7)]
    
    for w_idx, week in enumerate(weeks):
        for day in week["contributionDays"]:
            d_idx = (datetime.strptime(day["date"], "%Y-%m-%d").weekday() + 1) % 7 
            count = day["contributionCount"]
            if count == 0: s = symbols[0]
            elif count < 3: s = symbols[1]
            elif count < 6: s = symbols[2]
            elif count < 10: s = symbols[3]
            else: s = symbols[4]
            grid[d_idx][w_idx] = s

    days_labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    output = "   " + " ".join([str(i%10) for i in range(len(weeks))]) + "\n"
    for i, row in enumerate(grid):
        output += f"{days_labels[i]} " + " ".join(row) + "\n"
    
    return output

def generate_svg(ascii_art):
    # Escape for XML
    safe_ascii = ascii_art.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    lines = safe_ascii.split("\n")
    
    # Calculate dimensions for a clean look with padding
    width = 850
    line_height = 18.5
    height = 280
    
    # Snakes & Ladders Board Elements
    ladders = [
        (4, 6, 6, 2),   # (w_start, d_start, w_end, d_end)
        (15, 5, 17, 1),
        (28, 6, 30, 0)
    ]
    snakes = [
        (10, 0, 12, 5),
        (22, 1, 24, 6),
        (36, 1, 38, 5)
    ]
    
    start_x = 56
    start_y = 88
    col_w = 18.2
    row_h = 16.8
    
    def get_coords(w, d):
        return start_x + (w * col_w), start_y + (d * row_h)

    # SVG Elements for Board
    board_elements = ""
    # Draw Ladders (Blue)
    for w1, d1, w2, d2 in ladders:
        x1, y1 = get_coords(w1, d1)
        x2, y2 = get_coords(w2, d2)
        board_elements += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#7AA2F7" stroke-width="4" stroke-linecap="round" opacity="0.4" />\n'
        board_elements += f'<line x1="{x1-4}" y1="{y1}" x2="{x2-4}" y2="{y2}" stroke="#7AA2F7" stroke-width="2" opacity="0.3" />\n'
        board_elements += f'<line x1="{x1+4}" y1="{y1}" x2="{x2+4}" y2="{y2}" stroke="#7AA2F7" stroke-width="2" opacity="0.3" />\n'

    # Draw Snakes (Red/Orange)
    for w1, d1, w2, d2 in snakes:
        x1, y1 = get_coords(w1, d1)
        x2, y2 = get_coords(w2, d2)
        ctrl_x = (x1 + x2) / 2 + 30
        ctrl_y = (y1 + y2) / 2
        board_elements += f'<path d="M{x1} {y1} Q{ctrl_x} {ctrl_y} {x2} {y2}" stroke="#F7768E" stroke-width="6" fill="none" opacity="0.4" stroke-dasharray="4,4" />\n'

    # Game Path Logic
    game_path_points = []
    # Current logical position (w, d)
    curr_w, curr_d = 0, 0
    path_str = f"M{start_x} {start_y} "
    
    # Simulate 100 steps of game
    for _ in range(120):
        # Move forward
        curr_d += 1
        if curr_d > 6:
            curr_d = 0
            curr_w += 1
        if curr_w >= 40: break
        
        gx, gy = get_coords(curr_w, curr_d)
        path_str += f"L{gx} {gy} "
        
        # Check for Ladders
        for w1, d1, w2, d2 in ladders:
            if curr_w == w1 and curr_d == d1:
                curr_w, curr_d = w2, d2
                nx, ny = get_coords(curr_w, curr_d)
                path_str += f"L{nx} {ny} "
        
        # Check for Snakes
        for w1, d1, w2, d2 in snakes:
            if curr_w == w1 and curr_d == d1:
                curr_w, curr_d = w2, d2
                nx, ny = get_coords(curr_w, curr_d)
                path_str += f"L{nx} {ny} "

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
        .player {{ filter: drop-shadow(0 0 5px #FFFFFF); }}
    </style>
    
    <rect width="{width}" height="{height}" class="bg" />
    <rect width="{width}" height="30" class="header" />
    <circle cx="20" cy="15" r="5" fill="#F7768E" />
    <circle cx="40" cy="15" r="5" fill="#E0AF68" />
    <circle cx="60" cy="15" r="5" fill="#9ECE6A" />
    <text x="80" y="20" class="label">nagesh@hpc:~/snakes-n-ladders --play</text>
    
    <g>
        <animate attributeName="opacity" values="0.97;1;0.98;1;0.97" dur="0.1s" repeatCount="indefinite" />
        <text x="20" y="55" class="terminal">
"""
    for line in lines:
        svg_template += f'            <tspan x="20" dy="1.2em">{line}</tspan>\n'
        
    svg_template += f"""        </text>
        
        <!-- Board Elements -->
        {board_elements}

        <!-- Player 1 (Fast) -->
        <circle r="6" fill="#FFFFFF" class="player">
            <animateMotion dur="20s" repeatCount="indefinite" path="{path_str}" />
            <animate attributeName="fill" values="#FFFFFF;#9ECE6A;#FFFFFF" dur="2s" repeatCount="indefinite" />
        </circle>

        <!-- Player 2 (Ghost) -->
        <circle r="4" fill="#7AA2F7" opacity="0.4">
            <animateMotion dur="25s" repeatCount="indefinite" path="{path_str}" rotate="auto" />
        </circle>
    </g>
</svg>"""
    
    with os.fdopen(os.open("contributions.svg", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644), "w", encoding="utf-8") as f:
        f.write(svg_template)

def update_readme(ascii_art):
    readme_path = "README.md"
    if not os.path.exists(readme_path):
        readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
    
    if not os.path.exists(readme_path): return

    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    start_tag = "<!-- ASCII_CONTRIBUTION_START -->"
    end_tag = "<!-- ASCII_CONTRIBUTION_END -->"
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)

    if start_idx != -1 and end_idx != -1:
        replacement = f'\n<p align="center"><img src="./contributions.svg" width="100%" /></p>\n\n```text\n{ascii_art}```\n'
        new_content = content[:start_idx + len(start_tag)] + replacement + content[end_idx:]
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(new_content)

if __name__ == "__main__":
    try:
        if not TOKEN or not USERNAME:
            print("No token/username. Using MOCK data.")
            data = {"data": {"user": {"contributionsCollection": {"contributionCalendar": {"weeks": [{"contributionDays": [{"date": f"2023-01-{i:02d}", "contributionCount": i % 15} for i in range(1, 8)]} for _ in range(53)]}}}}}
        else:
            data = get_contributions()
            
        ascii_art = generate_ascii(data)
        
        # Write to a txt file as well for reference
        with open("CONTRIBUTIONS.txt", "w", encoding="utf-8") as f:
            f.write(ascii_art)

        generate_svg(ascii_art)
        update_readme(ascii_art)
        print("Snake contribution graph complete.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
