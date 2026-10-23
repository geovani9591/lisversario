import { NODES, EDGES, INITIAL, HINT_PASSWORDS, HINT_STORAGE_KEY } from "./puzzles.js?v=21";

const STORAGE_KEY = "lisversario-mock-v3";

const stage = document.querySelector("#stage");
const edgesSvg = document.querySelector("#edges");
const overlay = document.querySelector("#overlay");
const form = document.querySelector("#password-form");
const input = document.querySelector("#password-input");
const errorEl = document.querySelector("#password-error");
const dialog = document.querySelector("#dialog");
const completeEl = document.querySelector("#complete");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCopy = document.querySelector("#dialog-copy");

let state = loadState();
let pending = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return structuredClone(INITIAL);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function nodeById(id) {
  return NODES.find((node) => node.id === id);
}

function isGateVisible(id) {
  return state.visibleGates.includes(id);
}

function isUnlocked(id) {
  return state.unlocked.includes(id);
}

function isSigilSolved(id) {
  return (state.solvedSigils || []).includes(id);
}

function isComplete() {
  return Boolean(state.complete);
}

function waitingSigil() {
  return state.unlocked.find((id) => !isSigilSolved(id)) || null;
}

function renderNodes() {
  stage.querySelectorAll(".node").forEach((el) => el.remove());

  NODES.forEach((node) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `node is-${node.type}`;
    button.dataset.id = node.id;
    button.style.left = `${node.x}%`;
    button.style.top = `${node.y}%`;

    const img = document.createElement("img");
    img.className = "glyph";
    img.src = `./assets/sigilos/${node.id}.svg`;
    img.alt = "";
    img.draggable = false;
    button.appendChild(img);
    button.setAttribute(
      "aria-label",
      node.type === "sigil" ? `Sigilo ${node.id}` : "Dica"
    );

    button.addEventListener("click", () => onNodeClick(node));
    stage.appendChild(button);
  });

  paint();
  drawEdges();
}

function paint() {
  const waiting = waitingSigil();

  NODES.forEach((node) => {
    const el = stage.querySelector(`[data-id="${node.id}"]`);
    if (!el) return;

    el.classList.remove(
      "is-hidden",
      "is-locked",
      "is-clear",
      "is-waiting",
      "is-prompt",
      "is-open",
      "is-solved"
    );

    if (node.type === "sigil") {
      const solved = isSigilSolved(node.id);
      const visible = isUnlocked(node.id);
      if (!visible) {
        el.classList.add("is-locked");
        return;
      }
      el.classList.add(solved ? "is-clear" : "is-waiting");
      return;
    }

    if (!isGateVisible(node.id)) {
      el.classList.add("is-hidden");
      el.disabled = true;
      return;
    }

    el.disabled = false;
    if (isSigilSolved(node.waits)) {
      el.classList.add("is-solved");
      return;
    }

    el.classList.add("is-open");
    if (node.waits === waiting) el.classList.add("is-prompt");
  });

  completeEl.classList.toggle("is-on", isComplete());
}

function drawEdges() {
  edgesSvg.innerHTML = "";
  EDGES.forEach(([a, b]) => {
    const na = nodeById(a);
    const nb = nodeById(b);
    if (!na || !nb) return;

    const aHidden = na.type === "gate" && !isGateVisible(na.id);
    const bHidden = nb.type === "gate" && !isGateVisible(nb.id);
    if (aHidden || bHidden) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", `${na.x}%`);
    line.setAttribute("y1", `${na.y}%`);
    line.setAttribute("x2", `${nb.x}%`);
    line.setAttribute("y2", `${nb.y}%`);

    const dim =
      (na.type === "sigil" && !isUnlocked(na.id)) ||
      (nb.type === "sigil" && !isUnlocked(nb.id));
    if (dim) line.classList.add("is-dim");
    edgesSvg.appendChild(line);
  });
}

function loadHintUnlocks() {
  try {
    return JSON.parse(localStorage.getItem(HINT_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function isHintUnlocked(id) {
  return Boolean(loadHintUnlocks()[id]);
}

function saveHintUnlock(id) {
  const map = loadHintUnlocks();
  map[id] = true;
  localStorage.setItem(HINT_STORAGE_KEY, JSON.stringify(map));
}

function onNodeClick(node) {
  if (node.type === "gate") {
    if (!isGateVisible(node.id) || !node.hint) return;
    if (isHintUnlocked(node.id)) {
      window.location.href = node.hint;
      return;
    }
    openPassword("hint", node);
    return;
  }

  if (waitingSigil() !== node.id) return;
  openPassword("sigil", node);
}

function openPassword(kind, node) {
  pending = { kind, node };
  errorEl.textContent = "";
  input.value = "";
  if (kind === "hint") {
    dialogTitle.textContent = "Dica restrita";
    dialogCopy.textContent = "Digite a senha para abrir esta dica.";
    input.removeAttribute("inputmode");
  } else {
    dialogTitle.textContent = "Acesso restrito";
    dialogCopy.textContent = "Digite a senha deste sigilo.";
    input.setAttribute("inputmode", "numeric");
  }
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  window.setTimeout(() => input.focus(), 40);
}

function closePassword() {
  pending = null;
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function expectedPassword() {
  if (!pending) return "";
  if (pending.kind === "hint") return HINT_PASSWORDS[pending.node.id];
  return pending.node.password;
}

function submitPassword(event) {
  event.preventDefault();
  if (!pending) return;

  if (normalize(input.value) !== normalize(expectedPassword())) {
    errorEl.textContent = "senha incorreta";
    dialog.classList.remove("is-shake");
    void dialog.offsetWidth;
    dialog.classList.add("is-shake");
    return;
  }

  if (pending.kind === "hint") {
    saveHintUnlock(pending.node.id);
    window.location.href = pending.node.hint;
    return;
  }

  unlockSigil(pending.node);
  closePassword();
}

function unlockSigil(sigil) {
  if (!isSigilSolved(sigil.id)) {
    state.solvedSigils = [...(state.solvedSigils || []), sigil.id];
  }

  window.requestAnimationFrame(() => {
    stage.querySelector(`[data-id="${sigil.id}"]`)?.classList.add("just-cleared");
  });

  if (sigil.unlocks && !state.unlocked.includes(sigil.unlocks)) {
    state.unlocked.push(sigil.unlocks);
  }

  if (sigil.reveals && !state.visibleGates.includes(sigil.reveals)) {
    state.visibleGates.push(sigil.reveals);
    window.requestAnimationFrame(() => {
      stage.querySelector(`[data-id="${sigil.reveals}"]`)?.classList.add("just-appeared");
    });
  }

  if (!sigil.unlocks && !sigil.reveals) {
    state.complete = true;
  }

  saveState();
  paint();
  drawEdges();
}

function reset() {
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(INITIAL);
  state.solvedSigils = [];
  renderNodes();
}

document.querySelector("#cancel").addEventListener("click", closePassword);
document.querySelector("#reset").addEventListener("click", reset);
form.addEventListener("submit", submitPassword);
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closePassword();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePassword();
});

state.solvedSigils = state.solvedSigils || [];
renderNodes();
window.addEventListener("resize", drawEdges);
