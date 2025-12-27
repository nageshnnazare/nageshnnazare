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
    
    width = 900
    height = 300
    line_height = 18.2
    start_x = 60
    start_y = 90
    col_w = 18.5
    row_h = 16.8

    # Game Logic Setup
    ladders = [(2, 6, 5, 1), (12, 5, 14, 0), (28, 4, 30, 0), (35, 6, 37, 2)]
    snakes = [(8, 0, 10, 5), (20, 1, 22, 6), (33, 0, 35, 4)]
    
    def get_coords(w, d):
        return start_x + (w * col_w) + 8, start_y + (d * row_h) - 4

    # Board Decoration
    board_deco = ""
    # Data Bridges (Ladders)
    for w1, d1, w2, d2 in ladders:
        x1, y1 = get_coords(w1, d1)
        x2, y2 = get_coords(w2, d2)
        board_deco += f"""
        <g opacity="0.6">
            <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#7AA2F7" stroke-width="8" stroke-linecap="round" filter="url(#glow)"/>
            <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#1F2335" stroke-width="4" stroke-dasharray="2,2"/>
        </g>"""
    
    # Corruption Splines (Snakes)
    for w1, d1, w2, d2 in snakes:
        x1, y1 = get_coords(w1, d1)
        x2, y2 = get_coords(w2, d2)
        cx, cy = (x1 + x2) / 2 + 20, (y1 + y2) / 2
        board_deco += f"""
        <path d="M{x1} {y1} Q{cx} {cy} {x2} {y2}" stroke="#F7768E" stroke-width="5" fill="none" stroke-dasharray="5,2" opacity="0.5" filter="url(#redglow)">
            <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1s" repeatCount="indefinite" />
        </path>"""

    # Player Motion Path
    game_path = f"M{start_x+8} {start_y-4} "
    curr_w, curr_d = 0, 0
    for _ in range(150):
        curr_d += 1
        if curr_d > 6:
            curr_d = 0
            curr_w += 1
        if curr_w >= 40: break
        
        gx, gy = get_coords(curr_w, curr_d)
        game_path += f"L{gx} {gy} "
        
        # Check Ladders/Snakes
        for w1, d1, w2, d2 in ladders + snakes:
            if curr_w == w1 and curr_d == d1:
                curr_w, curr_d = w2, d2
                nx, ny = get_coords(curr_w, curr_d)
                game_path += f"L{nx} {ny} "

    svg_template = f"""<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="redglow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood flood-color="#F7768E" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        <linearGradient id="headerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#24283b" />
            <stop offset="100%" stop-color="#1a1b26" />
        </linearGradient>
    </defs>

    <style>
        .terminal {{ font-family: 'Courier New', Courier, monospace; font-size: 14px; fill: #7AA2F7; white-space: pre; }}
        .bg {{ fill: #1a1b26; rx: 12; }}
        .header {{ fill: url(#headerGrad); rx: 12 12 0 0; }}
        .label {{ fill: #565f89; font-family: monospace; font-size: 11px; font-weight: bold; }}
        .grid-line {{ stroke: #24283b; stroke-width: 0.5; }}
    </style>
    
    <rect width="{width}" height="{height}" class="bg" stroke="#24283b" stroke-width="2"/>
    <rect width="{width}" height="35" class="header" />
    
    <!-- Window Controls -->
    <circle cx="20" cy="18" r="6" fill="#F7768E" />
    <circle cx="40" cy="18" r="6" fill="#E0AF68" />
    <circle cx="60" cy="18" r="6" fill="#9ECE6A" />
    <text x="85" y="22" class="label">SSH: nagesh@hpc_cluster/games/snakes_n_ladders --live</text>
    
    <!-- Scanlines -->
    <path d="M0 50 L{width} 50 M0 100 L{width} 100 M0 150 L{width} 150 M0 200 L{width} 200 M0 250 L{width} 250" stroke="#7AA2F7" stroke-width="1" opacity="0.03" />

    <g>
        <text x="20" y="55" class="terminal">
"""
    for line in lines:
        svg_template += f'            <tspan x="20" dy="1.2em">{line}</tspan>\n'
        
    svg_template += f"""        </text>
        
        {board_deco}

        <!-- Player: HPC Process Node -->
        <g>
            <!-- Outer Glow -->
            <circle r="6" fill="#9ECE6A" opacity="0.3" filter="url(#glow)">
                <animateMotion dur="15s" repeatCount="indefinite" path="{game_path}" />
            </circle>
            <!-- Core Dot -->
            <circle r="4" fill="#FFFFFF">
                <animateMotion dur="15s" repeatCount="indefinite" path="{game_path}" />
            </circle>
        </g>
    </g>
</svg>"""
    
    with os.fdopen(os.open("contributions.svg", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644), "w", encoding="utf-8") as f:
        f.write(svg_template)

def update_readme(ascii_art):
    # This function is now a NO-OP or strictly minimal to respect "do not modify readme.md"
    # Actually, the user said "do not modify readme.md", so I will skip the write part.
    # But wait, if the placeholders are already there, the script usually updates them.
    # I will keep the function but prevent it from executing if the user is strict.
    pass

if __name__ == "__main__":
    try:
        if not TOKEN or not USERNAME:
            data = {"data": {"user": {"contributionsCollection": {"contributionCalendar": {"weeks": [{"contributionDays": [{"date": f"2023-01-{i:02d}", "contributionCount": i % 15} for i in range(1, 8)]} for _ in range(53)]}}}}}
        else:
            data = get_contributions()
            
        ascii_art = generate_ascii(data)
        generate_svg(ascii_art)
        print("Legendary Snakes & Ladders SVG generated.")
    except Exception as e:
        print(f"Error: {e}")
        exit(1)
