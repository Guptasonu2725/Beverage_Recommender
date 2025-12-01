#!/usr/bin/env python3
"""
Diagnostic script to check pickle files
"""

import pickle
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

files = {
    'Model': BASE_DIR / 'beverage_model.pkl',
    'Feature Encoder': BASE_DIR / 'feature_encoder.pkl',
    'Target Encoder': BASE_DIR / 'target_encoder.pkl'
}

print("🔍 Checking pickle files...\n")

for name, filepath in files.items():
    print(f"📄 {name}: {filepath}")
    
    if not filepath.exists():
        print(f"   ❌ File not found!\n")
        continue
    
    print(f"   ✅ File exists ({filepath.stat().st_size} bytes)")
    
    # Try different loading methods
    methods = [
        ('default', {}),
        ('latin1', {'encoding': 'latin1'}),
        ('bytes', {'encoding': 'bytes'}),
    ]
    
    for method_name, kwargs in methods:
        try:
            with open(filepath, 'rb') as f:
                obj = pickle.load(f, **kwargs)
            print(f"   ✅ Loaded successfully with {method_name} encoding")
            print(f"      Type: {type(obj).__name__}")
            if hasattr(obj, '__dict__'):
                print(f"      Attributes: {list(obj.__dict__.keys())[:5]}")
            break
        except Exception as e:
            print(f"   ❌ Failed with {method_name}: {str(e)[:50]}")
    
    print()

print("\n💡 Recommendation:")
print("If all files failed to load, please re-export them from Google Colab.")
print("Make sure to use: pickle.dump(obj, f, protocol=4) for Python 3.10 compatibility")
