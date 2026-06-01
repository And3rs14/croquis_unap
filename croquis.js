// ── Índice de búsqueda ────────────────────────────────────────────
var searchIndex = [];
Object.keys(carpasData).forEach(function(key) {
  carpasData[key].stands.forEach(function(s) {
    searchIndex.push({ key: key, proyecto: s.proyecto || "", rubro: s.rubro || "" });
  });
});

// ── Colores por carpa (extraídos del croquis oficial) ─────────────
// bg = fondo, fg = texto
var carpColors = {
  "C1":  {bg:"#FFE600", fg:"#1a1a1a"},
  "C2":  {bg:"#F2F2F2", fg:"#444444"},
  "C3":  {bg:"#FFFF99", fg:"#1a1a1a"},
  "C4":  {bg:"#1133BB", fg:"#ffffff"},
  "C5":  {bg:"#EECCFF", fg:"#1a1a1a"},
  "C6":  {bg:"#FFB0D5", fg:"#1a1a1a"},
  "C7":  {bg:"#FF3399", fg:"#ffffff"},
  "C8":  {bg:"#9922CC", fg:"#ffffff"},
  "C9":  {bg:"#9922CC", fg:"#ffffff"},
  "C10": {bg:"#9922CC", fg:"#ffffff"},
  "C11": {bg:"#9933CC", fg:"#ffffff"},
  "C12": {bg:"#9933CC", fg:"#ffffff"},
  "C13": {bg:"#66CCCC", fg:"#1a1a1a"},
  "C14": {bg:"#F2F2F2", fg:"#444444"},
  "C15": {bg:"#F2F2F2", fg:"#444444"},
  "C16": {bg:"#F2F2F2", fg:"#444444"},
  "C17": {bg:"#F2F2F2", fg:"#444444"},
  "C18": {bg:"#F2F2F2", fg:"#444444"},
  "C19": {bg:"#F2F2F2", fg:"#444444"},
  "C20": {bg:"#00E5FF", fg:"#1a1a1a"},
  "C21": {bg:"#00E5FF", fg:"#1a1a1a"},
  "C22": {bg:"#00FFFF", fg:"#1a1a1a"},
  "C23": {bg:"#00D4EE", fg:"#1a1a1a"},
  "C24": {bg:"#88EEFF", fg:"#1a1a1a"},
  "C25": {bg:"#88EEFF", fg:"#1a1a1a"},
  "C26": {bg:"#00CCCC", fg:"#1a1a1a"},
  "C27": {bg:"#00CCCC", fg:"#1a1a1a"},
  "C28": {bg:"#FF00CC", fg:"#ffffff"},
  "C29": {bg:"#FF00CC", fg:"#ffffff"},
  "C30": {bg:"#88AAFF", fg:"#1a1a1a"},
  "C31": {bg:"#CC99FF", fg:"#1a1a1a"},
  "C32": {bg:"#9955EE", fg:"#ffffff"},
  "C33": {bg:"#CC99FF", fg:"#1a1a1a"},
  "C34": {bg:"#994422", fg:"#ffffff"},
  "C35": {bg:"#F2F2F2", fg:"#444444"},
  "C36": {bg:"#FF5500", fg:"#ffffff"},
  "C37": {bg:"#F2F2F2", fg:"#444444"},
  "C38": {bg:"#F2F2F2", fg:"#444444"},
  "C39": {bg:"#F2F2F2", fg:"#444444"},
  "C40": {bg:"#F2F2F2", fg:"#444444"},
  "C41": {bg:"#F2F2F2", fg:"#444444"},
  "C42": {bg:"#F2F2F2", fg:"#444444"},
  "C43": {bg:"#F2F2F2", fg:"#444444"},
  "C44": {bg:"#F2F2F2", fg:"#444444"},
  "C45": {bg:"#F2F2F2", fg:"#444444"},
};

// ── Crear cajas del mapa ──────────────────────────────────────────
var H = 28;
var standsMap = [
  ["C43",28,278,58],  ["C44",28,313,58],  ["C45",28,348,58],
  ["C28",28,400,58],  ["C27",28,438,58],  ["C26",28,476,58],
  ["C42",135,212,52], ["C41",135,247,52], ["C40",135,282,52],
  ["C39",135,317,52], ["C38",135,350,52], ["C37",135,383,52],
  ["C36",118,446,50], ["C35",118,478,50],
  ["C25",302,98,52],  ["C24",302,133,52], ["C23",302,170,52],
  ["C22",302,205,52], ["C21",302,240,52], ["C20",302,275,52],
  ["C19",302,310,52], ["C18",302,343,52], ["C17",302,376,52],
  ["C16",302,428,52], ["C15",302,463,52], ["C14",302,496,52],
  ["C13",462,102,50], ["C12",462,137,50], ["C11",462,172,50],
  ["C10",462,205,50], ["C9",462,238,50],  ["C8",462,270,50],
  ["C7",462,300,50],  ["C6",462,333,50],  ["C5",462,366,50],
  ["C4",462,398,50],  ["C3",462,430,50],  ["C2",462,463,50],
  ["C1",462,496,50],
  ["C35",199,410,42,24], ["C34",243,410,42,24],
  ["C33",199,440,42,24], ["C32",199,470,42,24],
  ["C31",197,498,30,22], ["C30",229,498,30,22], ["C29",261,498,28,22]
];

var boxEls = {};
var stage  = document.getElementById("stage");

standsMap.forEach(function(item) {
  var label = item[0], x = item[1], y = item[2], w = item[3], h = item[4];
  var col   = carpColors[label] || {bg:"#F2F2F2", fg:"#444444"};
  var d = document.createElement("div");
  d.className = "box";
  d.style.left        = x + "px";
  d.style.top         = y + "px";
  d.style.width       = w + "px";
  d.style.height      = (h || H) + "px";
  d.style.background  = col.bg;
  d.style.color       = col.fg;
  d.style.borderColor = "rgba(0,0,0,0.2)";
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
  data.stands.forEach(function(s) {
    html += "<div class='proyecto-item'>" +
              "<div class='proyecto-num'>" + s.stand + "</div>" +
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

// ── Lupa: cierra sugerencias y deja el mapa con resaltado activo ──
document.getElementById("lupa-btn").addEventListener("click", function() {
  closeResults();
});

// ── Escalar mapa (ajusta por ancho Y alto disponible) ─────────────
var STAGE_W = 620, STAGE_H = 600;
function fit() {
  var sc     = document.getElementById("scaler");
  var availW = sc.clientWidth;
  // Alto disponible = desde la parte superior del scaler hasta el borde de la pantalla
  var top    = sc.getBoundingClientRect().top;
  var availH = (window.innerHeight || document.documentElement.clientHeight) - top - 2;
  var s = Math.min(availW / STAGE_W, availH / STAGE_H);
  stage.style.transform = "scale(" + s + ")";
  sc.style.height = (STAGE_H * s) + "px";
}
window.addEventListener("resize", fit);
fit();
