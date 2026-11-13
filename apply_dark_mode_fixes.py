import os

# Define the mappings for theme-aware tokens
replacements = {
    'bg-white': 'bg-card',
    'border-zinc-200': 'border-border',
    'border-zinc-300': 'border-border',
    'text-zinc-700': 'text-foreground',
    'text-zinc-500': 'text-muted-foreground',
    'text-zinc-600': 'text-foreground',
    'bg-zinc-100': 'bg-muted',
    'bg-zinc-50': 'bg-muted',
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    modified = False
    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    if modified:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated: {filepath}")

# Process recursively in the app directory
for root, dirs, files in os.walk('app'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            process_file(os.path.join(root, file))

print("Dark mode color migration completed.")
