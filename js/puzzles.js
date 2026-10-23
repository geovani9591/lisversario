export const PASSWORDS = {
  s1: "1",
  s2: "2",
  s3: "3",
};

export const HINT_PASSWORDS = {
  g1: "a",
  g2: "b",
  g3: "c",
};

export const HINT_STORAGE_KEY = "lisversario-hints-v1";

export const NODES = [
  {
    id: "s1",
    type: "sigil",
    x: 26,
    y: 16,
    password: PASSWORDS.s1,
    unlocks: "s2",
    reveals: "g2",
  },
  { id: "g1", type: "gate", x: 84, y: 8, waits: "s1", hint: "./n/7f3c91e2a64b.html" },
  { id: "g2", type: "gate", x: 16, y: 42, waits: "s2", hint: "./n/b18e04d9c27f.html" },
  {
    id: "s2",
    type: "sigil",
    x: 78,
    y: 48,
    password: PASSWORDS.s2,
    unlocks: "s3",
    reveals: "g3",
  },
  { id: "g3", type: "gate", x: 86, y: 70, waits: "s3", hint: "./n/e5a0c6b13d88.html" },
  {
    id: "s3",
    type: "sigil",
    x: 32,
    y: 88,
    password: PASSWORDS.s3,
    unlocks: null,
    reveals: null,
  },
];

export const EDGES = [
  ["s1", "g1"],
  ["s1", "g2"],
  ["g2", "s2"],
  ["s2", "g3"],
  ["g3", "s3"],
];

export const INITIAL = {
  unlocked: ["s1"],
  visibleGates: ["g1"],
  solvedSigils: [],
};
