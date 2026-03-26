import re

file_path = 'src/zap/sections/inputs/body.tsx'
with open(file_path, 'r') as f:
    content = f.read()

replacements = {
    'bg-layer-canvas-alt': 'bg-layer-canvas',
    'bg-iso-gray-50': 'bg-layer-cover',
    'bg-iso-gray-100': 'bg-layer-panel',
    'bg-iso-gray-200': 'bg-layer-panel',
    'bg-iso-gray-900': 'bg-brand-midnight',
    'bg-iso-white': 'bg-layer-cover',
    'bg-iso-black': 'bg-brand-midnight',
    'bg-black': 'bg-brand-midnight',
    'bg-brand-primary': 'bg-theme-main',
    'bg-white': 'bg-layer-cover',
    'text-iso-gray-900': 'text-brand-midnight',
    'text-iso-gray-600': 'text-theme-base/70',
    'text-iso-gray-500': 'text-theme-base/60',
    'text-iso-gray-400': 'text-theme-base/50',
    'text-iso-gray-300': 'text-theme-base/40',
    'text-iso-gray-200': 'text-theme-base/30',
    'text-iso-black': 'text-brand-midnight',
    'text-iso-white': 'text-layer-base',
    'text-brand-primary': 'text-theme-main',
    'text-black': 'text-brand-midnight',
    'text-white': 'text-layer-base',
    'text-primary': 'text-theme-main',
    'border-iso-black': 'border-card-border',
    'border-iso-gray-100': 'border-card-border/20',
    'border-iso-gray-200': 'border-card-border/30',
    'border-iso-gray-300': 'border-card-border/40',
    'border-brand-primary': 'border-theme-main',
    'border-black': 'border-card-border',
    'border-white': 'border-layer-base',
    'border-primary': 'border-theme-main',
    'shadow-hard': 'shadow-card rounded-[calc(var(--card-radius)/2)]',
    'shadow-soft': 'shadow-card rounded-[calc(var(--card-radius)/2)]',
    'border ': 'border-[length:var(--card-border-width,0px)] ',
    'border-b ': 'border-b-[length:var(--card-border-width,0px)] ',
    'border-t ': 'border-t-[length:var(--card-border-width,0px)] ',
    'border-l-4': 'border-l-[length:var(--card-border-width,0px)]',
    'border-r-iso-black': 'border-r-theme-main'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Fix some specifics
content = content.replace('border border-[length:var(--card-border-width,0px)]', 'border-[length:var(--card-border-width,0px)]')
content = content.replace('border-[length:var(--card-border-width,0px)] border-[length:var(--card-border-width,0px)]', 'border-[length:var(--card-border-width,0px)]')

# Buttons and pills
content = re.sub(r'bg-brand-midnight text-layer-base px-2 py-1 text-sm font-black', r'bg-brand-midnight text-layer-base px-2 py-1 text-sm font-black rounded-btn', content)

with open(file_path, 'w') as f:
    f.write(content)

