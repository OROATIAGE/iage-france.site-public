import csv
import os
from collections import defaultdict

# --- Configuration ---
CSV_FILE_PATH = 'texts.csv'

# Define the preferred order of top-level key segments
# This order will dictate how major sections appear in the CSV
PREFERRED_TOP_LEVEL_ORDER = [
    'navbar', 'home', 'about', 'services', 'sectors',
    'diagbox',  # This will catch 'diagbox.gazon', 'diagbox.buttons', etc.
    'gazon',    # This will catch 'gazon.qna' if such direct keys exist
    'contact', 'legal', 'privacy', 'footer'
    # Add other primary key segments here in your preferred order
]

def load_all_rows_from_csv(csv_filepath):
    """Loads all rows from the CSV file."""
    rows = []
    fieldnames = []
    if not os.path.exists(csv_filepath):
        print(f"Error: CSV file not found at {csv_filepath}")
        return rows, fieldnames
    try:
        with open(csv_filepath, mode='r', encoding='utf-8', newline='') as infile:
            reader = csv.DictReader(infile)
            fieldnames = reader.fieldnames if reader.fieldnames else ['key', 'section', 'texte']
            for row in reader:
                rows.append(row)
    except Exception as e:
        print(f"Error reading CSV file {csv_filepath}: {e}")
    return rows, fieldnames

def reorganize_and_write_csv(csv_filepath, original_rows, csv_fieldnames):
    """Writes back the CSV, reorganizing the content based on PREFERRED_TOP_LEVEL_ORDER."""
    if not original_rows:
        print("Warning: No data to write. CSV file might be empty or unreadable.")
        # Optionally, write headers even if empty
        with open(csv_filepath, mode='w', encoding='utf-8', newline='') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=csv_fieldnames if csv_fieldnames else ['key', 'section', 'texte'])
            writer.writeheader()
        return

    # Reorganization: Group by the first segment of the key
    grouped_texts = defaultdict(list)
    misc_category_key = "_misc_general"  # For keys without a clear first segment or if errors occur

    for row_data in original_rows:
        key = row_data.get('key')
        if key:
            first_segment = key.split('.')[0] if '.' in key else misc_category_key
            grouped_texts[first_segment].append(row_data)
        else:
            # Handle rows that might be missing a key (though all should have one)
            grouped_texts[misc_category_key].append(row_data)

    ordered_group_names = []
    remaining_group_names = set(grouped_texts.keys())

    # Add groups based on preferred order
    for preferred_name in PREFERRED_TOP_LEVEL_ORDER:
        if preferred_name in remaining_group_names:
            ordered_group_names.append(preferred_name)
            remaining_group_names.remove(preferred_name)

    # Add any remaining groups, sorted alphabetically
    if misc_category_key in remaining_group_names:  # Ensure misc is last of the remaining
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
    print(f"CSV file '{csv_filepath}' has been reorganized.")

def main():
    """Main function to execute the script."""
    print("Starting script to reorganize text keys...")
    print(f"CSV file to process: {CSV_FILE_PATH}")

    print(f"IMPORTANT: Please make sure to backup your '{CSV_FILE_PATH}' file before proceeding.")

    # User confirmation
    confirm = input("Type 'yes' to continue with the script: ")
    if confirm.lower() != 'yes':
        print("Operation cancelled by the user.")
        return

    original_csv_rows, csv_fieldnames = load_all_rows_from_csv(CSV_FILE_PATH)

    if not original_csv_rows:
        print("No data found in CSV or CSV could not be read. Exiting.")
        return
    if not csv_fieldnames:
        print("Could not determine CSV fieldnames. Exiting.")
        return

    print(f"Read {len(original_csv_rows)} rows from '{CSV_FILE_PATH}'.")

    reorganize_and_write_csv(CSV_FILE_PATH, original_csv_rows, csv_fieldnames)
    print(f"\nProcess complete.")
    print(f"IMPORTANT: Remember to run 'npm run generate-texts' (or your equivalent script) to update 'src/content/texts.js' if you use such a generation step.")

if __name__ == '__main__':
    main() 