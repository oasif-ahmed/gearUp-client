#!/usr/bin/env python3

import re

def replace_colors_in_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Replace all hardcoded colors with theme variables
    replacements = {
        'border-zinc-200': 'border-border',
        'border-zinc-100': 'border-border',
        'text-zinc-900': 'text-foreground',
        'text-zinc-700': 'text-foreground',
        'text-zinc-600': 'text-foreground',
        'text-zinc-500': 'text-muted-foreground',
        'text-zinc-400': 'text-muted-foreground',
        'text-zinc-300': 'text-muted-foreground',
        'bg-white': 'bg-card',
        'bg-zinc-200': 'bg-muted',
        'bg-[#FDFBF7]': 'bg-muted',
        'bg-zinc-950/60': 'bg-primary/60',
        'bg-zinc-950/40': 'bg-primary/40',
        'border-zinc-100/40': 'border-border/40',
        'border-zinc-100/60': 'border-border/60',
        'border-zinc-300': 'border-border',
    }
    
    # Apply replacements (need to be careful with quotes)
    content = content.replace('border-zinc-200', 'border-border')
    content = content.replace('border-zinc-100', 'border-border')
    content = content.replace('text-zinc-900', 'text-foreground')
    content = content.replace('text-zinc-700', 'text-foreground')
    content = content.replace('text-zinc-600', 'text-foreground')
    content = content.replace('text-zinc-500', 'text-muted-foreground')
    content = content.replace('text-zinc-400', 'text-muted-foreground')
    content = content.replace('text-zinc-300', 'text-muted-foreground')
    content = content.replace('bg-white', 'bg-card')
    content = content.replace('bg-zinc-200', 'bg-muted')
    content = content.replace('bg-[#FDFBF7]', 'bg-muted')
    content = content.replace('bg-zinc-950/60', 'bg-primary/60')
    content = content.replace('bg-zinc-950/40', 'bg-primary/40')
    content = content.replace('border-zinc-100/40', 'border-border/40')
    content = content.replace('border-zinc-100/60', 'border-border/60')
    content = content.replace('border-zinc-300', 'border-border')
    
    # Write back
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"Updated {file_path}")

if __name__ == "__main__":
    files = [
        'app/dashboard/admin/adminClient.tsx',
        'app/dashboard/provider/ProviderDashboard.tsx',
        'app/dashboard/provider/ProviderDashboard-aligned.tsx',
        'app/dashboard/provider/ProviderDashboard-updated.tsx',
    ]
    
    for file_path in files:
        replace_colors_in_file(file_path)