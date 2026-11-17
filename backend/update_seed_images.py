import re

with open('seed.py', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'("title": "Black Headphones",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"]'),
    (r'("title": "iPhone 14",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80"]'),
    (r'("title": "Blue Backpack",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"]'),
    (r'("title": "Water Bottle",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"]'),
    (r'("title": "Laptop \(MacBook Air\)",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"]'),
    (r'("title": "Wallet",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"]'),
    (r'("title": "Found Headphones",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"]'),
    (r'("title": "Found Laptop",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"]'),
    (r'("title": "Found Water Bottle",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"]'),
    (r'("title": "Found Wallet",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"]'),
    (r'("title": "Found Student ID Card",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1589332824982-f47285a7bd78?w=800&q=80"]'),
    (r'("title": "Found Calculator",.*?)"images": \[\]', r'\1"images": ["https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&q=80"]')
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content, flags=re.DOTALL)

with open('seed.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated seed.py with images")
