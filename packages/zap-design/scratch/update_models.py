import os
import re

directory = r'g:\zap-builder-v4\packages\zap-design\src\services'
models = [
    'brand/brand.model.ts',
    'category/category.model.ts',
    'collection/collection.model.ts',
    'country/country.model.ts',
    'customer/customer.model.ts',
    'dining-option/dining-option.model.ts',
    'group-product/group-product.model.ts',
    'location/location.model.ts',
    'membership/membership.model.ts',
    'menu/menu.model.ts',
    'modifier-group/modifier-group.model.ts',
    'modifier-item/modifier-item.model.ts',
    'policy/policy.model.ts',
    'product/product.model.ts',
    'promotion/promotion.model.ts',
    'unit/unit.model.ts'
]

# Mapping of file to interface name (usually same as file but capitalized or specific)
# I'll just look for the first interface that starts with export interface Name {
for model_path in models:
    full_path = os.path.join(directory, model_path)
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        continue
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to find the end of the main interface
    # Assuming the main interface is the first exported one or matches the name
    basename = os.path.basename(model_path).replace('.model.ts', '')
    # Convert kebab to Pascal
    interface_name = ''.join(word.capitalize() for word in basename.split('-'))
    if interface_name == 'Unit': interface_name = 'Unit' # Already matches
    
    # Pattern to match the main interface and add the field before the closing brace
    pattern = rf'(export interface {interface_name} \{{)(.*?)(\}})'
    
    if 'acronymn?:' in content:
        print(f"Field already exists in {model_path}")
        continue

    # Find the closing brace of the main interface
    # This might be tricky if there are nested braces, but usually there aren't many in these models
    match = re.search(rf'export interface {interface_name} \{{', content)
    if match:
        start_idx = match.end()
        # Find the matching closing brace
        brace_count = 1
        end_idx = -1
        for i in range(start_idx, len(content)):
            if content[i] == '{': brace_count += 1
            elif content[i] == '}': 
                brace_count -= 1
                if brace_count == 0:
                    end_idx = i
                    break
        
        if end_idx != -1:
            new_content = content[:end_idx] + '  acronymn?: string;\n' + content[end_idx:]
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {model_path}")
        else:
            print(f"Could not find closing brace for {interface_name} in {model_path}")
    else:
        print(f"Could not find interface {interface_name} in {model_path}")
