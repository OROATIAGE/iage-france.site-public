import csv
import os
import re
from collections import defaultdict

# --- Configuration ---
CSV_FILE_PATH = 'texts.csv'
# Try to find the 'src' directory relative to the script or CWD
# This makes the script more portable if it's not in the project root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT_CANDIDATES = [os.getcwd(), SCRIPT_DIR, os.path.dirname(SCRIPT_DIR)]

SRC_DIR_NAME = 'src'
SRC_DIR = None
for root_path in PROJECT_ROOT_CANDIDATES:
    potential_src_path = os.path.join(root_path, SRC_DIR_NAME)
    if os.path.isdir(potential_src_path):
        SRC_DIR = potential_src_path
        print(f"Found source directory: {SRC_DIR}")
        break

if not SRC_DIR:
    print(f"Error: Could not automatically find the '{SRC_DIR_NAME}' directory. Please ensure the script is run from the project root or adjust SRC_DIR.")
    exit()

JS_FILE_EXTENSIONS = ('.js', '.jsx')

# Regex patterns for finding key usages
# 1. Direct access: texts.some.key, texts?.some?.key
# 2. Bracket access: texts['some.key'], texts["some.key"], texts[`some.key`]
# 3. Helper functions: getText('some.key'), getDiagboxText('suffix.key'), getQnaText('suffix.key')
KEY_USAGE_PATTERNS = [
    # texts.key.path or texts?.key?.path (captures the full path after "texts.")
    re.compile(r'texts(?:\?)*\.((?:[\w-]+(?:\?)*\.?)+[\w-]+)'),
    # texts['key.path'] or texts["key.path"] or texts[`key.path`]
    re.compile(r'texts\[\s*([\'"`])((?:(?!\1).)+)\1\s*\]'),
    # getText('key.path', ...)
    re.compile(r'getText\(\s*([\'"`])((?:(?!\1).)+)\1\s*(?:,[^)]*)?\)'),
    # getDiagboxText('suffix.key', ...)
    re.compile(r'getDiagboxText\(\s*([\'"`])((?:(?!\1).)+)\1\s*(?:,[^)]*)?\)'),
    # getQnaText('suffix.key', ...)
    re.compile(r'getQnaText\(\s*([\'"`])((?:(?!\1).)+)\1\s*(?:,[^)]*)?\)'),
]

def load_all_keys_from_csv(csv_filepath):
    """Loads all keys from the CSV file and returns them as a set, along with all original rows."""
    keys = set()
    rows = []
    fieldnames = []
    if not os.path.exists(csv_filepath):
        print(f"Error: CSV file not found at {csv_filepath}")
        return keys, rows, fieldnames
    try:
        with open(csv_filepath, mode='r', encoding='utf-8', newline='') as infile:
            reader = csv.DictReader(infile)
            fieldnames = reader.fieldnames if reader.fieldnames else ['key', 'section', 'texte']
            for row in reader:
                # Ensure row is a dict and 'key' exists
                if isinstance(row, dict) and row.get('key'):
                    keys.add(row['key'])
                rows.append(row)
    except Exception as e:
        print(f"Error reading CSV file {csv_filepath}: {e}")
    return keys, rows, fieldnames

def find_used_keys_in_code(src_directory, all_csv_keys):
    """
    Scans JS/JSX files for key usages and applies parent/child logic.
    Returns a set of keys considered "used".
    """
    used_keys = set()
    js_files = []
    for root, _, files in os.walk(src_directory):
        for file in files:
            if file.endswith(JS_FILE_EXTENSIONS):
                js_files.append(os.path.join(root, file))

    for js_file_path in js_files:
        try:
            with open(js_file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                for pattern in KEY_USAGE_PATTERNS:
                    for match in pattern.finditer(content):
                        key_found_in_code = None
                        if pattern.pattern.startswith('texts(?:\?)*\.'): # texts.key.path
                            key_found_in_code = match.group(1).replace("?.", ".") # Normalize optional chaining
                        elif pattern.pattern.startswith('texts\['): # texts['key.path']
                            key_found_in_code = match.group(2)
                        elif pattern.pattern.startswith('getText\('): # getText('key.path')
                            key_found_in_code = match.group(2)
                        elif pattern.pattern.startswith('getDiagboxText\('): # getDiagboxText('suffix')
                            key_found_in_code = f"diagbox.gazon.{match.group(2)}"
                        elif pattern.pattern.startswith('getQnaText\('): # getQnaText('suffix')
                            key_found_in_code = f"gazon.qna.{match.group(2)}"

                        if key_found_in_code:
                            # Key directly found in code
                            used_keys.add(key_found_in_code)

                            # Add all its children from CSV to used_keys
                            for csv_key in all_csv_keys:
                                if csv_key.startswith(key_found_in_code + '.'):
                                    used_keys.add(csv_key)
                            
                            # Add all its parents to used_keys
                            parts = key_found_in_code.split('.')
                            for i in range(1, len(parts)):
                                parent_key = '.'.join(parts[:i])
                                used_keys.add(parent_key)
        except Exception as e:
            print(f"Error reading or processing file {js_file_path}: {e}")
    
    # Second pass: For any key in used_keys, ensure its parents and children (from CSV) are also included.
    # This helps catch cases where a parent was added but not its children, or vice-versa initially.
    # This might be slightly redundant with the above but ensures completeness of the cascading logic.
    final_used_keys = set(used_keys) # Start with a copy
    for used_key_shell in used_keys:
        # Add children
        for csv_key in all_csv_keys:
            if csv_key.startswith(used_key_shell + '.'):
                final_used_keys.add(csv_key)
        # Add parents
        parts = used_key_shell.split('.')
        for i in range(1, len(parts)):
            parent_key = '.'.join(parts[:i])
            final_used_keys.add(parent_key)
            
    return final_used_keys

def reorganize_and_write_csv(csv_filepath, original_rows, csv_fieldnames, unused_keys_to_remove):
    """Writes back the CSV, removing unused keys and reorganizing the content."""
    kept_rows_data = [row for row in original_rows if isinstance(row, dict) and row.get('key') and row['key'] not in unused_keys_to_remove]

    if not kept_rows_data:
        print("Warning: No data to write after removing unused keys. Writing empty CSV with headers.")
        with open(csv_filepath, mode='w', encoding='utf-8', newline='') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=csv_fieldnames if csv_fieldnames else ['key', 'section', 'texte'])
            writer.writeheader()
        return

    # Reorganization: Group by the first segment of the key
    grouped_texts = defaultdict(list)
    misc_category_key = "_misc_general" 

    for row_data in kept_rows_data:
        key = row_data.get('key')
        if key:
            first_segment = key.split('.')[0] if '.' in key else misc_category_key
            grouped_texts[first_segment].append(row_data)
        else:
            grouped_texts[misc_category_key].append(row_data)

    # Define the preferred order of top-level key segments
    # This order will dictate how major sections appear in the CSV
    PREFERRED_TOP_LEVEL_ORDER = [
        'navbar', 'home', 'about', 'services', 'sectors', 
        'diagbox', # This will catch 'diagbox.gazon', 'diagbox.buttons', etc.
        'gazon',   # This will catch 'gazon.qna' if such direct keys exist
        'contact', 'legal', 'privacy', 'footer'
        # Add other primary key segments here in your preferred order
    ]

    ordered_group_names = []
    remaining_group_names = set(grouped_texts.keys())

    # Add groups based on preferred order
    for preferred_name in PREFERRED_TOP_LEVEL_ORDER:
        if preferred_name in remaining_group_names:
            ordered_group_names.append(preferred_name)
            remaining_group_names.remove(preferred_name)
    
    # Add any remaining groups, sorted alphabetically
    if misc_category_key in remaining_group_names: # Ensure misc is last of the remaining
        remaining_group_names.remove(misc_category_key)
        ordered_group_names.extend(sorted(list(remaining_group_names)))
        ordered_group_names.append(misc_category_key)
    else:
        ordered_group_names.extend(sorted(list(remaining_group_names)))


    with open(csv_filepath, mode='w', encoding='utf-8', newline='') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=csv_fieldnames)
        writer.writeheader()
        for group_name in ordered_group_names:
            items = grouped_texts[group_name]
            # Sort items within each group by the full key
            sorted_items = sorted(items, key=lambda x: x.get('key', ''))
            for item in sorted_items:
                writer.writerow(item)
    print(f"CSV file '{csv_filepath}' has been reorganized, and {len(unused_keys_to_remove)} unused keys removed.")


def main():
    """Main function to execute the script."""
    print("Starting script to identify and remove unused text keys...")
    print(f"Source directory for JS/JSX files: {SRC_DIR}")
    print(f"CSV file to process: {CSV_FILE_PATH}")
    
    print(f"IMPORTANT: Please make sure to backup your '{CSV_FILE_PATH}' file before proceeding.")
    
    # User confirmation
    confirm = input("Type 'yes' to continue with the script: ")
    if confirm.lower() != 'yes':
        print("Operation cancelled by the user.")
        return

    all_csv_keys, original_csv_rows, csv_fieldnames = load_all_keys_from_csv(CSV_FILE_PATH)

    if not original_csv_rows: # Check if any rows were loaded
        print("No data found in CSV or CSV could not be read. Exiting.")
        return
    if not all_csv_keys: # Check if any keys were extracted
        print("No keys extracted from CSV. Please check CSV format. Exiting.")
        return
    if not csv_fieldnames: # Check if fieldnames were obtained
        print("Could not determine CSV fieldnames. Exiting.")
        return

    print(f"Found {len(all_csv_keys)} total unique keys in '{CSV_FILE_PATH}'.")

    used_in_code_keys = find_used_keys_in_code(SRC_DIR, all_csv_keys)
    print(f"Found {len(used_in_code_keys)} keys considered 'used' in the codebase (after applying parent/child logic).")

    # Determine unused keys
    unused_keys = all_csv_keys - used_in_code_keys
    
    if not unused_keys:
        print("No unused keys were identified. The CSV file will only be reorganized if you proceed.")
    else:
        print(f"\nIdentified {len(unused_keys)} potentially unused keys to be removed:")
        for k in sorted(list(unused_keys)):
            print(f"  - {k}")
    
    print(f"\nThe script will now attempt to rewrite '{CSV_FILE_PATH}'.")
    print("It will remove the keys listed above (if any) and then reorganize the remaining keys by their first segment.")
    
    confirm_delete = input(f"Proceed with modifying '{CSV_FILE_PATH}'? (yes/no): ")
    if confirm_delete.lower() == 'yes':
        reorganize_and_write_csv(CSV_FILE_PATH, original_csv_rows, csv_fieldnames, unused_keys)
        print(f"\nProcess complete.")
        print(f"IMPORTANT: Remember to run 'npm run generate-texts' (or your equivalent script) to update 'src/content/texts.js'.")
    else:
        print("Operation cancelled. No changes were made to the CSV file.")

if __name__ == '__main__':
    if not SRC_DIR:
        print("Script cannot run because the source directory was not found.")
    else:
        main() 