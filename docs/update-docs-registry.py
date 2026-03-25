import os
import re

def extract_metadata(filepath):
    """Extracts a title/description from the first H1 header or meaningful text."""
    try:
        title = "No description provided."
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
            # Find the first H1
            for line in lines:
                if line.startswith("# "):
                    return line.strip("# \n")
            # Fallback to first non-empty line
            for line in lines:
                line = line.strip()
                if line and not line.startswith("---") and not line.startswith("name:") and not line.startswith("description:"):
                    return line
        return title
    except Exception:
        return "Unreadable file."

def main():
    docs_dir = "/Users/zap/Workspace/olympus/docs"
    if not os.path.exists(docs_dir):
        print(f"Error: Docs directory not found at {docs_dir}")
        return

    os.chdir(docs_dir)

    docs_data = {}

    # Define directories to scan (excluding the root docs_dir index files)
    ignore_files = ["docs-directory.md", "master-registry.md", "readme.md"]
    ignore_dirs = [".git", "node_modules"]

    for root, dirs, files in os.walk("."):
        # Modify dirs in-place to skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ignore_dirs]
        
        for file in files:
            if not file.endswith(".md") or file in ignore_files:
                continue
            
            # Category based on top-level folder
            rel_path = os.path.relpath(os.path.join(root, file), ".")
            parts = rel_path.split(os.sep)
            
            if len(parts) == 1:
                category = "CORE"
            else:
                category = parts[0].upper()
            
            filename = parts[-1]
            shortcut = filename.replace(".md", "")
            
            # For SOPs and BLASTs, use the prefix (e.g., /sop-001) as the shortcut for AI
            # If the filename already looks like an ID, use it. Otherwise, use a cleaner shortcut.
            if shortcut.lower().startswith("sop-") or shortcut.lower().startswith("blast-") or shortcut.lower().startswith("prj-"):
                # Clean up for the shortcut, e.g. sop-001
                id_match = re.search(r'([a-zA-Z]+-\d+)', shortcut)
                if id_match:
                    command = f"@{id_match.group(1).lower()}"
                else:
                    command = f"@{shortcut}"
            else:
                command = f"@{shortcut}"

            title = extract_metadata(rel_path)
            
            if category not in docs_data:
                docs_data[category] = []
            
            # Use relative path as the link
            docs_data[category].append((filename, rel_path, command, title))

    # Generate Markdown
    md_content = """# 📚 Olympus Documentation Registry

This directory contains the central index of all Standard Operating Procedures (SOPs), B.L.A.S.T. protocols, Projects, and internal documentation for ZAP-OS agents and human staff.

## 📖 SOP: How to Use the Documentation Registry

**For Humans (Engineers & Staff):**
When writing prompts, reference the **Shortcut Command** (e.g., `@SOP-001` or `@architecture`) to instruct your AI immediately to fetch and follow that document. You can also click the File Name links to read them yourself.
*Example:* *"Hey Claude, analyze this layout against the `@SOP-005` rules."*

**For Agents (Antigravity, Tommy, Jerry):**
When you receive a user prompt containing an `@Shortcut` or when you encounter a task matching a document's title, you **MUST** automatically read the corresponding `.md` file before writing a single line of code.

---

"""

    for category in sorted(docs_data.keys()):
        md_content += f"## {category}\n\n"
        md_content += "| File Name | Shortcut Command | Title / Scope |\n"
        md_content += "| :--- | :--- | :--- |\n"
        
        # Sort by filename
        items = sorted(docs_data[category], key=lambda x: x[0])
        for filename, rel_path, shortcut, title in items:
            # Create a clickable markdown link
            md_content += f"| [{filename}]({rel_path}) | **`{shortcut}`** | {title} |\n"
        md_content += "\n"

    # Append manual global skills registry
    md_content += "## SKILLS REGISTRY\n\n"
    md_content += "| File Name | Shortcut Command | Title / Scope |\n"
    md_content += "| :--- | :--- | :--- |\n"
    md_content += "| [skills-directory.md](../.agent/skills/skills-directory.md) | **`@skills-directory`** | 🛠️ ZAP-OS Master Skills Directory |\n\n"

    target_registry_file = os.path.join(docs_dir, "master-registry.md")
    with open(target_registry_file, "w") as f:
        f.write(md_content)

    print("SUCCESS: Updated master-registry.md")

if __name__ == "__main__":
    main()
