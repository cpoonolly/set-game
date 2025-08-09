# shape = one_of({a, b, c})
# color = one_of({a, b, c})
# fill = one_of({a, b, c})
# count = one_of({a, b, c})

# card = str([shape, color, fill, count])
# 81 possible cards

from itertools import product


num_props = 4
prop_vals = list('abc')

def generate_cards(prop: int):
    if prop == 1:
        return list(prop_vals)
    
    return [
        f"{val}{card}"
        for card in generate_cards(prop-1)
        for val in prop_vals
    ]

all_cards = frozenset(generate_cards(num_props))

def is_valid_set(card1: str, card2: str, card3: str) -> bool:
    return all(
        a == b == c or (a != b and b != c and a != c)
        for a, b, c in zip(card1, card2, card3)
    )

def find_all_valid_sets() -> frozenset:
    all_variations = list(frozenset(variation) for variation in product(all_cards, repeat=3))

    return frozenset(
        variation for variation in all_variations
        if len(variation) == 3 and is_valid_set(*variation)
    )

# Generate all valid sets
all_valid_sets = find_all_valid_sets()

print("export const ALL_VALID_SETS: Set<string>[] = [")

# Convert to list and sort for consistent output
sorted_sets = sorted(list(all_valid_sets))

# Print sets in the requested format, 4 per line
for i, valid_frozen_set in enumerate(sorted_sets):
    valid_set = list(valid_frozen_set)
    set_str = f'Set(["{valid_set[0]}", "{valid_set[1]}", "{valid_set[2]}"])'
    
    if i == len(sorted_sets) - 1:  # Last set
        print(f"    {set_str}")
    elif (i + 1) % 4 == 0:  # End of line (every 4th set)
        print(f"    {set_str},")
    else:  # Continue on same line
        print(f"    {set_str},", end=" ")

print("];")

print(f"\n// Total: {len(all_valid_sets)} valid sets from {len(all_cards)} cards")

# def get_valid_sets(board: Set[str]) -> Set[Set[str]]:
#     return set([
#         frozenset(potential_set)
#         for potential_set in combinations(board, len(prop_vals))
#         if frozenset(potential_set) in all_valid_sets
#     ])

# def generate_random_board(num_cards: int, num_sets: int):
#     for _ in range(5000):
#         valid_sets = random.sample(list(all_valid_sets), num_sets)
#         cards = set([
#             card
#             for valid_set in valid_sets
#             for card in valid_set
#         ])

#         iterations = 0
#         while len(cards) < num_cards:
#             random_card = random.choice(list(all_cards - cards))
#             potential_board = set(cards | {random_card})
#             if len(get_valid_sets(potential_board)) == num_sets:
#                 cards = potential_board
#             elif iterations > 100:
#                 break
#             else:
#                 iterations += 1


#         if len(cards) > num_cards:
#             continue
        
#         board = list(cards)
#         random.shuffle(board)
#         return board


# num_cards = 16
# num_sets = 5
# generate_random_board(num_cards, num_sets)