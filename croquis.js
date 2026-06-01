// ── Índice de búsqueda ────────────────────────────────────────────
var searchIndex = [];
Object.keys(carpasData).forEach(function(key) {
  carpasData[key].stands.forEach(function(s) {
    searchIndex.push({ key: key, proyecto: s.proyecto || "", rubro: s.rubro || "" });
  });
});

// ── Crear cajas del mapa ──────────────────────────────────────────
var H = 28;
var standsMap = [
  ["C43",28,278,58,"blue"],  ["C44",28,313,58,"blue"],  ["C45",28,348,58,"blue"],
  ["C28",28,400,58,"teal"],  ["C27",28,438,58,"teal"],  ["C26",28,476,58,"teal"],
  ["C42",135,212,52,"blue"], ["C41",135,247,52,"blue"], ["C40",135,282,52,"blue"],
  ["C39",135,317,52,"blue"], ["C38",135,350,52,"blue"], ["C37",135,383,52,"blue"],
  ["C36",118,446,50,"purple"],["C35",118,478,50,"purple"],
  ["C25",302,98,52,"teal"],  ["C24",302,133,52,"teal"], ["C23",302,170,52,"orange"],
  ["C22",302,205,52,"orange"],["C21",302,240,52,"orange"],["C20",302,275,52,"teal"],
  ["C19",302,310,52,"orange"],["C18",302,343,52,"orange"],["C17",302,376,52,"orange"],
  ["C16",302,428,52,"orange"],["C15",302,463,52,"orange"],["C14",302,496,52,"orange"],
  ["C13",462,102,50,"teal"], ["C12",462,137,50,"teal"], ["C11",462,172,50,"teal"],
  ["C10",462,205,50,"orange"],["C9",462,238,50,"orange"],["C8",462,270,50,"orange"],
  ["C7",462,300,50,"orange"], ["C6",462,333,50,"orange"],["C5",462,366,50,"orange"],
  ["C4",462,398,50,"orange"], ["C3",462,430,50,"orange"],["C2",462,463,50,"orange"],
  ["C1",462,496,50,"orange"],
  ["C35",199,410,42,"orange",24],["C34",243,410,42,"orange",24],
  ["C33",199,440,42,"orange",24],["C32",199,470,42,"navy",24],
  ["C31",197,498,30,"orange",22],["C30",229,498,30,"orange",22],["C29",261,498,28,"orange",22]
];

var boxEls = {};
var stage  = document.getElementById("stage");

standsMap.forEach(function(item) {
  var label = item[0], x = item[1], y = item[2], w = item[3], type = item[4], h = item[5];
  var d = document.createElement("div");
  d.className = "box " + type;
  d.style.left   = x + "px";
  d.style.top    = y + "px";
  d.style.width  = w + "px";
  d.style.height = (h || H) + "px";
  if (w < 46) d.style.fontSize = "11px";
  d.textContent = label;
  d.addEventListener("click", function() { openModal(label); });
  stage.appendChild(d);
  if (!boxEls[label]) boxEls[label] = [];
  boxEls[label].push(d);
});

// ── Utilidades ────────────────────────────────────────────────────
var RE_DIAC = new RegExp("[̀-ͯ]", "g");

function norm(s) {
  try {
    return (s || "").toLowerCase().normalize("NFD").replace(RE_DIAC, "");
  } catch(e) {
    return (s || "").toLowerCase();
  }
}

function esc(s) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlight(text, q) {
  if (!q) return esc(text);
  var result = "";
  var nText  = norm(text);
  var nQ     = norm(q);
  var last   = 0, idx;
  while ((idx = nText.indexOf(nQ, last)) !== -1) {
    result += esc(text.slice(last, idx)) +
              "<mark>" + esc(text.slice(idx, idx + nQ.length)) + "</mark>";
    last = idx + nQ.length;
  }
  result += esc(text.slice(last));
  return result;
}

// ── Estado del mapa ───────────────────────────────────────────────
function applyMapState(matchedKeys) {
  Object.keys(boxEls).forEach(function(key) {
    var hit = (matchedKeys === null) || matchedKeys[key];
    boxEls[key].forEach(function(el) {
      el.classList.toggle("highlighted", matchedKeys !== null && hit);
      el.classList.toggle("dimmed",      matchedKeys !== null && !hit);
    });
  });
}

// ── Búsqueda ─────────────────────────────────────────────────────
var input       = document.getElementById("search-input");
var clearBtn    = document.getElementById("search-clear");
var resultsList = document.getElementById("results-list");
var searchWrap  = document.getElementById("search-wrap");
var info        = document.getElementById("search-info");

function doSearch() {
  var raw = input.value.trim();
  var q   = norm(raw);

  clearBtn.classList.toggle("visible", raw.length > 0);

  if (!q) {
    applyMapState(null);
    resultsList.innerHTML = "";
    resultsList.classList.remove("open");
    searchWrap.classList.remove("active");
    info.textContent = "";
    info.className   = "";
    return;
  }

  // Filtrar
  var hits = searchIndex.filter(function(r) {
    return norm(r.proyecto).indexOf(q) !== -1 || norm(r.rubro).indexOf(q) !== -1;
  });

  // Construir Set de claves coincidentes (objeto plano, más compatible)
  var matchedKeys = {};
  hits.forEach(function(r) { matchedKeys[r.key] = true; });
  applyMapState(matchedKeys);

  // Contador
  var numCarpas = Object.keys(matchedKeys).length;
  if (numCarpas === 0) {
    info.textContent = "Sin resultados para \"" + raw + "\"";
    info.className   = "none";
  } else {
    info.textContent = hits.length + " proyecto" + (hits.length > 1 ? "s" : "") +
                       " en " + numCarpas + " carpa" + (numCarpas > 1 ? "s" : "");
    info.className   = "found";
  }

  // Lista desplegable
  if (hits.length === 0) {
    resultsList.innerHTML = "<div class='no-results'>Sin coincidencias</div>";
  } else {
    var html = "";
    hits.forEach(function(r) {
      html += "<div class='result-item' data-key='" + r.key + "' data-proyecto='" + r.proyecto.replace(/'/g,"&#39;") + "'>" +
                "<span class='result-carpa'>" + r.key + "</span>" +
                "<div class='result-info'>" +
                  "<div class='result-nombre'>" + highlight(r.proyecto, raw) + "</div>" +
                  "<span class='result-rubro'>"  + highlight(r.rubro,   raw) + "</span>" +
                "</div>" +
                "<span class='result-arrow'>&#8250;</span>" +
              "</div>";
    });
    resultsList.innerHTML = html;

    resultsList.querySelectorAll(".result-item").forEach(function(el) {
      el.addEventListener("click", function() {
        var key      = el.getAttribute("data-key");
        var proyecto = el.getAttribute("data-proyecto");
        // Poner el nombre en el buscador y actualizar el mapa
        input.value = proyecto;
        doSearch();
        closeResults();
        input.blur();
        // Abrir modal de esa carpa
        setTimeout(function() { openModal(key); }, 80);
      });
    });
  }

  resultsList.classList.add("open");
  searchWrap.classList.add("active");
}

function closeResults() {
  resultsList.classList.remove("open");
  searchWrap.classList.remove("active");
}

input.addEventListener("input", doSearch);

clearBtn.addEventListener("click", function() {
  input.value = "";
  doSearch();
  input.focus();
});

document.addEventListener("click", function(e) {
  if (!document.getElementById("search-bar").contains(e.target)) closeResults();
});

// ── Modal ─────────────────────────────────────────────────────────
var overlay = document.getElementById("modal-overlay");
var mTitle  = document.getElementById("modal-title");
var mSub    = document.getElementById("modal-subtitle");
var mBody   = document.getElementById("modal-body");

function openModal(key) {
  var data   = carpasData[key];
  if (!data) return;
  var raw    = input.value.trim();
  mTitle.textContent = "Carpa " + key.replace("C", "");
  mSub.textContent   = data.stands.length + " stand" +
                       (data.stands.length > 1 ? "s" : "") + " registrado" +
                       (data.stands.length > 1 ? "s" : "");
  var html = "";
  data.stands.forEach(function(s, i) {
    html += "<div class='proyecto-item'>" +
              "<div class='proyecto-num'>" + (i + 1) + "</div>" +
              "<div>" +
                "<div class='proyecto-nombre'>" + highlight(s.proyecto || "Sin nombre", raw) + "</div>" +
                "<span class='proyecto-rubro'>" + esc(s.rubro) + "</span>" +
              "</div>" +
            "</div>";
  });
  mBody.innerHTML = html;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modal-close").addEventListener("click", closeModal);
overlay.addEventListener("click", function(e) { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeModal(); });

var modalEl = document.getElementById("modal");
var startY  = 0;
modalEl.addEventListener("touchstart", function(e) { startY = e.touches[0].clientY; }, { passive: true });
modalEl.addEventListener("touchend",   function(e) {
  if (e.changedTouches[0].clientY - startY > 55) closeModal();
}, { passive: true });

// ── Modo mapa (lupa) ──────────────────────────────────────────────
document.getElementById("lupa-btn").addEventListener("click", function() {
  document.body.classList.add("map-mode");
  closeResults();
  input.blur();
});
document.getElementById("lupa-restore").addEventListener("click", function() {
  document.body.classList.remove("map-mode");
  fit();
});

// ── Escalar mapa ──────────────────────────────────────────────────
var STAGE_W = 620, STAGE_H = 600;
function fit() {
  var sc = document.getElementById("scaler");
  var s  = sc.clientWidth / STAGE_W;
  stage.style.transform = "scale(" + s + ")";
  sc.style.height = (STAGE_H * s) + "px";
}
window.addEventListener("resize", fit);
fit();
