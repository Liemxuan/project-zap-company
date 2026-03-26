import re

file_path = 'src/zap/sections/color/body.tsx'
with open(file_path, 'r') as f:
    content = f.read()

replacements = {
    'text-iso-gray-600': 'text-theme-base/70',
    'text-iso-gray-500': 'text-theme-base/50',
    'border-white/20': 'border-layer-base/20'
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, 'w') as f:
    f.write(content)

