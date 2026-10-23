import { HINT_STORAGE_KEY } from "./puzzles.js?v=21";

const hintId = document.body.dataset.hint;

function isUnlocked() {
  try {
    const map = JSON.parse(localStorage.getItem(HINT_STORAGE_KEY) || "{}");
    return Boolean(map[hintId]);
  } catch {
    return false;
  }
}

if (!hintId || !isUnlocked()) {
  window.location.replace("../index.html");
} else {
  document.documentElement.classList.remove("hint-locked");
}
