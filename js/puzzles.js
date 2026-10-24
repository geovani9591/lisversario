export const PASSWORDS = {
  s1: "auditoria",
  s2: "brilhar",
  s3: "melchior",
};

export const HINT_PASSWORDS = {
  g1: "",
  g2: "camomila",
  g3: "semicolcheia",
};

export const HINT_STORAGE_KEY = "lisversario-hints-v1";

export const NODES = [
  {
    id: "s1",
    type: "sigil",
    x: 26,
    y: 16,
    password: PASSWORDS.s1,
    prompt: "Digite a senha do sigilo de verbo",
    unlocks: "s2",
    reveals: "g2",
    reward: "https://libraryofbabel.info/bookmark.cgi?g,,zc_qztxuch_hjzrqvslf106",
  },
  { id: "g1", type: "gate", x: 82, y: 8, waits: "s1", hint: "./n/7f3c91e2a64b.html" },
  { id: "g2", type: "gate", x: 16, y: 42, waits: "s2", hint: "./n/b18e04d9c27f.html" },
  {
    id: "s2",
    type: "sigil",
    x: 70,
    y: 48,
    password: PASSWORDS.s2,
    user: "vigilia",
    prompt: "Digite o usuário e a senha do sigilo de som",
    unlocks: "s3",
    reveals: "g3",
    reward: "https://open.spotify.com/playlist/4YQdCufLGRH278FpQEQPoO",
  },
  { id: "g3", type: "gate", x: 82, y: 70, waits: "s3", hint: "./n/e5a0c6b13d88.html" },
  {
    id: "s3",
    type: "sigil",
    x: 32,
    y: 88,
    password: PASSWORDS.s3,
    prompt: "Digite a senha do sigilo de vislumbre",
    unlocks: null,
    reveals: null,
    reward: "./n/4c8e1b07d9a2.html",
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
