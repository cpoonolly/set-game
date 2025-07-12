# shape = one_of({a, b, c})
# color = one_of({a, b, c})
# fill = one_of({a, b, c})
# count = one_of({a, b, c})

# card = str([shape, color, fill, count])
# 81 possible cards

import random
from typing import List, Set
from itertools import permutations, combinations


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

prop_perms = list(list(perm) for perm in permutations(prop_vals))
prop_perms.extend([[v] * len(prop_vals) for v in prop_vals])

all_valid_sets = frozenset([
    frozenset([''.join(valid_props) for valid_props in zip(*valid_prop_vals)])
    for valid_prop_vals in combinations(prop_perms, num_props)
])

def get_valid_sets(board: Set[str]) -> Set[Set[str]]:
    return set([
        frozenset(potential_set)
        for potential_set in combinations(board, len(prop_vals))
        if frozenset(potential_set) in all_valid_sets
    ])

def generate_random_board(num_cards: int, num_sets: int):
    for _ in range(5000):
        valid_sets = random.sample(list(all_valid_sets), num_sets)
        cards = set([
            card
            for valid_set in valid_sets
            for card in valid_set
        ])

        iterations = 0
        while len(cards) < num_cards:
            random_card = random.choice(list(all_cards - cards))
            potential_board = set(cards | {random_card})
            if len(get_valid_sets(potential_board)) == num_sets:
                cards = potential_board
            elif iterations > 100:
                break
            else:
                iterations += 1


        if len(cards) > num_cards:
            continue
        
        board = list(cards)
        random.shuffle(board)
        return board


num_cards = 16
num_sets = 5
generate_random_board(num_cards, num_sets)