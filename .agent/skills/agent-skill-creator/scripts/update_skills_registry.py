import os
import re
import sys

def main():
    # Force the path to the definitive Olympus skills directory
    olympus_skills_dir = "/Users/zap/Workspace/olympus/.agent/skills"
    
    if not os.path.exists(olympus_skills_dir):
        print(f"Error: Olympus skills directory not found at {olympus_skills_dir}")
        sys.exit(1)
        
    os.chdir(olympus_skills_dir)

    skills_data = {}
    
    # Iterate through folders and extract names and descriptions
    for folder in sorted(os.listdir(".")):
        if os.path.isdir(folder) and not folder.startswith("."):
            skill_file = os.path.join(folder, "SKILL.md")
            description = "No description provided."
            
            if os.path.exists(skill_file):
                with open(skill_file, "r") as f:
                    content = f.read()
                    match = re.search(r"description:\s*(.*?)\n", content)
                    if match:
                        description = match.group(1).strip()
            
            category = folder.split("-")[0].upper()
            if category not in skills_data:
                skills_data[category] = []
            
            shortcut = f"/{folder}"
            skills_data[category].append((folder, shortcut, description))

    # Construct the Markdown content
    md_content = """# 🧠 Olympus Skills Directory & Global Registry

This directory contains all canonical behaviors, rules, and SOPs for ZAP-OS agents and staff. 
The naming convention follows a strict `[CATEGORY]-[SKILL_NAME]` format to prevent fragmentation.

## 📖 SOP: How to Use Skills (For Humans & Agents)

**For Humans (Engineers & Staff):**
When programming or reviewing code, use the **Shortcut** in your prompt or IDE (like Cursor or Claude) to instantly command the AI to follow that exact protocol. 
*Example:* *"Hey Claude, build a new dashboard widget using the `/zap-project-structure` and `/frontend-design` rules."*

**For Agents (Antigravity, Tommy, Jerry):**
When you receive a user prompt containing a `/[shortcut]` or when you encounter a task matching a skill's description, you **MUST** automatically read the `SKILL.md` file located inside that designated folder before writing a single line of code.

---

"""

    for category in sorted(skills_data.keys()):
        md_content += f"## {category}\n\n"
        md_content += "| Skill Folder | Shortcut Command | Description |\n"
        md_content += "| :--- | :--- | :--- |\n"
        for folder, shortcut, desc in skills_data[category]:
            md_content += f"| `{folder}` | **`{shortcut}`** | {desc} |\n"
        md_content += "\n"

    # Write the output file
    target_registry_file = os.path.join(olympus_skills_dir, "SKILLS_DIRECTORY.md")
    with open(target_registry_file, "w") as f:
        f.write(md_content)

    print(f"SUCCESS: Updated SKILLS_DIRECTORY.md at {target_registry_file}")

if __name__ == "__main__":
    main()
