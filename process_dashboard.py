#!/usr/bin/env python3

import re

def process_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Replace common hardcoded color patterns with theme variables
    content = content.replace(/border-zinc-200/g, 'border-border')
    content = content.replace(/border-zinc-100/g, 'border-border')
    content = content.replace(/border-zinc-300/g, 'border-border')
    content = content.replace(/border-zinc-100\/60/g, 'border-border\/60')
    content = content.replace(/border-zinc-100\/40/g, 'border-border\/40')
    content = content.replace(/text-zinc-900/g, 'text-foreground')
    content = content.replace(/text-zinc-700/g, 'text-foreground')
    content = content.replace(/text-zinc-600/g, 'text-foreground')
    content = content.replace(/text-zinc-500/g, 'text-muted-foreground')
    content = content.replace(/text-zinc-400/g, 'text-muted-foreground')
    content = content.replace(/text-zinc-300/g, 'text-muted-foreground')
    content = content.replace(/bg-white/g, 'bg-card')
    content = content.replace(/bg-zinc-200/g, 'bg-muted')
    content = content.replace(/bg-[#FDFBF7]/g, 'bg-muted')
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"Processed {file_path}")

# Process the main dashboard files
files_to_process = [
    'app/dashboard/admin/adminClient.tsx',
    'app/dashboard/provider/ProviderDashboard.tsx',
    'app/dashboard/provider/ProviderDashboard-aligned.tsx',
    'app/dashboard/provider/ProviderDashboard-updated.tsx',
]

for file_path in files_to_process:
    try:
        process_file(file_path)
    except Exception as e:
        print(f"Error processing {file_path}: {e}")