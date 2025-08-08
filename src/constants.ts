import { Set } from 'immutable';

export const BOARD_SIZE = 16;
export const SET_SIZE = 3;
export const SET_COUNT = 6;

export const ALL_CARDS: string[] = [
    "baaa", "bcca", "bbab", "bcab", "bcbc", "acbb", "caba", "caca", "bcaa", "abcc", "cbab", "acbc", "abab",
    "aaaa", "bbac", "baca", "abcb", "cbca", "aabb", "ccab", "ccba", "bbca", "bcba", "caaa", "ccbc", "cbba",
    "aaac", "cbbc", "abbc", "accc", "ccca", "caab", "cabc", "bbbb", "cbcb", "babb", "aabc", "bbbc", "bacb",
    "bacc", "cbaa", "bcbb", "abba", "baac", "cccb", "ccaa", "abbb", "caac", "baab", "aacb", "cacc", "abaa",
    "bbcc", "acba", "abac", "baba", "aaab", "ccbb", "aaca", "aaba", "babc", "acac", "cbac", "cbcc", "cccc",
    "bbba", "abca", "bccb", "acaa", "bccc", "accb", "aacc", "bbaa", "cabb", "bbcb", "ccac", "bcac", "acab",
    "acca", "cbbb", "cacb"
];

export const ALL_VALID_SETS: Set<string>[] = [
    Set(["aabc", "bccb", "cbaa"]), Set(["accb", "cbab", "babb"]), Set(["bcaa", "cbba", "aaca"]), Set(["bcac", "abbc", "cacc"]),
    Set(["abcb", "bcab", "cabb"]), Set(["abab", "bcab", "caab"]), Set(["babc", "ccac", "abcc"]), Set(["caba", "bcab", "abcc"]),
    Set(["cbaa", "aaba", "bcca"]), Set(["aabc", "bcab", "cbca"]), Set(["acac", "caac", "bbac"]), Set(["baca", "abbc", "ccab"]),
    Set(["bbbc", "acbc", "cabc"]), Set(["caac", "bcbc", "abcc"]), Set(["bcac", "caac", "abac"]), Set(["caba", "acca", "bbaa"]),
    Set(["aaab", "cbab", "bcab"]), Set(["bbca", "caaa", "acba"]), Set(["accc", "cbac", "babc"]), Set(["aabc", "bcac", "cbcc"]),
    Set(["bacb", "abbc", "ccaa"]), Set(["ccab", "baba", "abcc"]), Set(["cbab", "bcbb", "aacb"]), Set(["abbc", "babc", "ccbc"]),
    Set(["abca", "bcba", "caaa"]), Set(["abbb", "bcab", "cacb"]), Set(["acbb", "bbcb", "caab"]), Set(["abab", "bccb", "cabb"]),
    Set(["abab", "ccab", "baab"]), Set(["caab", "abcb", "bcbb"]), Set(["bcac", "cbac", "aaac"]), Set(["aabc", "bcbc", "cbbc"]),
    Set(["baac", "abcc", "ccbc"]), Set(["bcac", "cbca", "aabb"]), Set(["aabc", "babc", "cabc"]), Set(["cbcb", "bcab", "aabb"]),
    Set(["caba", "abca", "bcaa"]), Set(["caba", "bcca", "abaa"]), Set(["acac", "baac", "cbac"]), Set(["bccb", "cbab", "aabb"]),
    Set(["baac", "ccac", "abac"]), Set(["abcb", "ccbb", "baab"]), Set(["cbac", "aacc", "bcbc"]), Set(["baaa", "ccba", "abca"]),
    Set(["acca", "baba", "cbaa"]), Set(["cbbc", "babc", "acbc"]), Set(["accb", "cabb", "bbab"]), Set(["bbab", "acab", "caab"]),
    Set(["aabc", "bccc", "cbac"]), Set(["bccc", "cabc", "abac"]), Set(["baba", "abca", "ccaa"]), Set(["abbc", "ccac", "bacc"]),
    Set(["abba", "caca", "bcaa"]), Set(["bcba", "caab", "abcc"]), Set(["cabb", "acab", "bbcb"]), Set(["cbab", "acab", "baab"]),
    Set(["abbc", "bcab", "caca"]), Set(["bcac", "cabc", "abcc"]), Set(["acac", "bbcc", "cabc"]), Set(["ccba", "abcc", "baab"]),
    Set(["caac", "acbc", "bbcc"]), Set(["bcab", "aacc", "cbba"]), Set(["cbbc", "bcac", "aacc"]), Set(["baca", "abba", "ccaa"]),
    Set(["abbc", "bcbc", "cabc"]), Set(["caba", "bbca", "acaa"]), Set(["abcb", "ccab", "babb"]), Set(["bcab", "aacb", "cbbb"]),
    Set(["accc", "cabc", "bbac"]), Set(["abbc", "bcaa", "cacb"]), Set(["caba", "acab", "bbcc"]), Set(["aaba", "bcaa", "cbca"]),
    Set(["cbaa", "bcba", "aaca"]), Set(["abbb", "bacb", "ccab"]), Set(["aabc", "cbab", "bcca"]), Set(["aabc", "bcaa", "cbcb"])
];