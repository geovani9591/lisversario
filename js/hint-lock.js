const hintId = document.body.dataset.hint;
const sigilId = document.body.dataset.sigil;
const needsLock = document.body.dataset.lock === "1";
const hintKey = "lisversario-hints-v1";
const mapKey = "lisversario-mock-v3";

function bounce() {
  location.replace("../index.html");
}

if (sigilId) {
  let ok = false;
  try {
    const map = JSON.parse(localStorage.getItem(mapKey) || "{}");
    ok = Array.isArray(map.solvedSigils) && map.solvedSigils.includes(sigilId);
  } catch {
    ok = false;
  }
  if (!ok) bounce();
} else if (!hintId) {
  bounce();
} else if (needsLock) {
  let ok = false;
  try {
    ok = Boolean(JSON.parse(localStorage.getItem(hintKey) || "{}")[hintId]);
  } catch {
    ok = false;
  }
  if (!ok) bounce();
}
