import os
import requests
import json
from datetime import datetime

TOKEN = os.getenv("GITHUB_TOKEN")
USERNAME = os.getenv("GITHUB_USERNAME", "nageshnnazare")

def get_stats():
    url = "https://api.github.com/graphql"
    headers = {"Authorization": f"bearer {TOKEN}"}
    query = """
    query($username: String!) {
      user(login: $username) {
        repositories(first: 5, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            name
            stargazers { totalCount }
            forkCount
            languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
              nodes { name }
            }
          }
        }
        contributionsCollection {
          totalCommitContributions
        }
        followers { totalCount }
        starredRepositories { totalCount }
      }
    }
    """
    response = requests.post(url, json={"query": query, "variables": {"username": USERNAME}}, headers=headers)
    if response.status_code == 200:
        return response.json()
    return None

def generate_top_block(data):
    if not data or "data" not in data:
        return "(Stats generation failed... link your GITHUB_TOKEN)"
    
    user = data["data"]["user"]
    total_commits = user["contributionsCollection"]["totalCommitContributions"]
    followers = user["followers"]["totalCount"]
    stars_given = user["starredRepositories"]["totalCount"]
    repos = user["repositories"]["nodes"]
    
    now = datetime.now().strftime("%H:%M:%S")
    uptime = "85 days" # Just for aesthetic
    
    top = [
        f"top - {now} up {uptime},  1 user,  load average: 0.{total_commits % 100:02d}, 0.12, 0.05",
        f"Tasks: {len(repos)} total,   1 running, {len(repos)-1} sleeping,   0 stopped,   0 zombie",
        f"%Cpu(s): {total_commits % 20:04.1f} us, {total_commits % 5:04.1f} sy,  0.0 ni, 80.2 id,  0.1 wa,  0.0 hi,  0.1 si,  0.0 st",
        f"MiB Mem : {followers * 128:8.1f} total, {followers * 32:8.1f} free, {followers * 64:8.1f} used, {followers * 32:8.1f} buff/cache",
        f"MiB Swap:   4096.0 total,   4096.0 free,      0.0 used. {followers * 24:8.1f} avail Mem ",
        "",
        "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND",
    ]
    
    pids = [1024, 2048, 4096, 8192, 16384]
    for i, repo in enumerate(repos):
        lang = repo["languages"]["nodes"][0]["name"] if repo["languages"]["nodes"] else "N/A"
        stars = repo["stargazers"]["totalCount"]
        # Dummy performance stats based on real repo data
        cpu = (stars % 10) + 1.2
        mem = (repo["forkCount"] % 5) + 0.5
        time = f"0:{stars:02d}.{repo['forkCount']:02d}"
        top.append(f"{pids[i]:5d} nagesh    20   0  1.2g  340m  120m R  {cpu:4.1f}  {mem:4.1f}   {time} {repo['name'][:15]}")

    return "\n".join(top)

def update_readme(top_art):
    readme_path = "README.md"
    if not os.path.exists(readme_path):
        readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
    
    if not os.path.exists(readme_path): return

    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    start_tag = "<!-- TOP_STATS_START -->"
    end_tag = "<!-- TOP_STATS_END -->"
    
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)

    if start_idx != -1 and end_idx != -1:
        new_content = content[:start_idx + len(start_tag)] + "\n```text\n" + top_art + "\n```\n" + content[end_idx:]
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(new_content)

if __name__ == "__main__":
    if not TOKEN:
        # Mock mode
        data = {"data": {"user": {"repositories": {"nodes": [{"name": "mock-repo", "stargazers": {"totalCount": 10}, "forkCount": 2, "languages": {"nodes": [{"name": "C++"}]}}] * 5}, "contributionsCollection": {"totalCommitContributions": 150}, "followers": {"totalCount": 10}, "starredRepositories": {"totalCount": 42}}}}
    else:
        data = get_stats()
    
    top_art = generate_top_block(data)
    update_readme(top_art)
    print("Top stats updated.")
