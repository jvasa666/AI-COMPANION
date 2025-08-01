# image_generator.py
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os

# Create output directory
os.makedirs('AI_Companion_Media', exist_ok=True)

# Generate 6 professional placeholder images (3:2 ratio, <5MB)
for i, (name, desc) in enumerate({
    'ui_customization': 'Avatar Customization Screen',
    'ar_demo': 'AR Room Integration',
    'voice_settings': 'Voice Cloning Panel',
    'architecture': 'System Architecture',
    'morphing_tech': 'Body Morphing Tech',
    'therapy_mode': 'Mental Health Mode'
}.items()):
    
    # Create 3000x2000 image (3:2 ratio)
    img = Image.new('RGB', (3000, 2000), color=(
        np.random.randint(30,60), 
        np.random.randint(30,60), 
        np.random.randint(30,60)
    )
    d = ImageDraw.Draw(img)
    
    # Add decorative elements
    for _ in range(20):
        x, y = np.random.randint(0,3000), np.random.randint(0,2000)
        d.ellipse([x,y,x+np.random.randint(50,300),y+np.random.randint(50,300)], 
                 fill=(np.random.randint(100,200), np.random.randint(100,200), np.random.randint(100,200)))
    
    # Add title text
    try:
        font = ImageFont.truetype("arial.ttf", 120)
    except:
        font = ImageFont.load_default()
    
    d.text((300,800), desc, fill=(240,240,240), font=font)
    d.text((300,1000), f"AI Companion App", fill=(200,200,255), font=font)
    
    # Save in appropriate format
    path = f"AI_Companion_Media/{name}.{'gif' if 'demo' in name else 'jpg'}"
    img.save(path, 
             quality=95 if path.endswith('jpg') else None,
             optimize=True,
             duration=1000 if path.endswith('gif') else None)
    
    print(f"Generated {path} ({os.path.getsize(path)/1e6:.1f}MB)")

print("\nZIP command:")
print("zip -r AI_Companion_Media.zip AI_Companion_Media/")