import os

# Card properties mapping
shapes = {
    'a': 'diamond',
    'b': 'oval', 
    'c': 'square'
}

stroke_colors = {
    'a': '#4CAF50',  # green
    'b': '#2196F3',  # blue
    'c': '#E91E63'   # pink/red
}

fill_colors = {
    'a': '#4CAF50',  # green
    'b': '#2196F3',  # blue
    'c': '#E91E63'   # pink/red
}

counts = {
    'a': 1,
    'b': 2,
    'c': 3
}

def create_diamond(x, y, stroke_color, fill_color):
    w = 80
    h = 40
    cx = x + w/2
    cy = y + h/2
    
    path = f"M {cx} {cy - h/2} L {cx + w/2} {cy} L {cx} {cy + h/2} L {cx - w/2} {cy} Z"
    
    return f'<path d="{path}" fill="{fill_color}" stroke="{stroke_color}" stroke-width="2"/>'

def create_oval(x, y, stroke_color, fill_color):
    w = 80
    h = 40
    cx = x + w/2
    cy = y + h/2
    rx = w/2
    ry = h/2
    
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill_color}" stroke="{stroke_color}" stroke-width="2"/>'

def create_square(x, y, stroke_color, fill_color):
    w = 80
    h = 40
    
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill_color}" stroke="{stroke_color}" stroke-width="2"/>'

def generate_shapes(shape, stroke_color, fill_color, count):
    spacing = 90
    start_x = 60 if count == 1 else 25 if count == 2 else 10
    y = 30
    
    shapes = ''
    
    for i in range(count):
        x = start_x + (i * spacing)
        
        if shape == 'diamond':
            shapes += create_diamond(x, y, stroke_color, fill_color)
        elif shape == 'oval':
            shapes += create_oval(x, y, stroke_color, fill_color)
        elif shape == 'square':
            shapes += create_square(x, y, stroke_color, fill_color)
    
    return shapes

def generate_card(card_code):
    shape_code, stroke_color_code, fill_color_code, count_code = list(card_code)
    
    shape = shapes[shape_code]
    stroke_color = stroke_colors[stroke_color_code]
    fill_color = fill_colors[fill_color_code]
    count = counts[count_code]
    
    shapes_markup = generate_shapes(shape, stroke_color, fill_color, count)
    
    return f'''<svg width="280" height="100" viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg">
  {shapes_markup}
</svg>'''

# Generate all 81 cards
cards_dir = os.path.join('public', 'cards')

# Delete existing SVG files
for file in os.listdir(cards_dir):
    if file.endswith('.svg'):
        os.remove(os.path.join(cards_dir, file))

for shape in ['a', 'b', 'c']:
    for color in ['a', 'b', 'c']:
        for fill in ['a', 'b', 'c']:
            for count in ['a', 'b', 'c']:
                card_code = shape + color + fill + count
                svg = generate_card(card_code)
                
                with open(os.path.join(cards_dir, f'{card_code}.svg'), 'w') as f:
                    f.write(svg)
                    
                print(f'Generated {card_code}.svg')

print('Generated all 81 cards!')