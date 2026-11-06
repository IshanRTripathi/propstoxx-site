(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  var nav = document.querySelector("[data-nav]");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("solid", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (window.sceneSvg) {
    document.querySelectorAll("[data-scene]").forEach(function (el) {
      var badges = Array.prototype.slice.call(el.querySelectorAll(".badge"));
      el.innerHTML = window.sceneSvg(el.getAttribute("data-scene"));
      badges.forEach(function (b) { el.appendChild(b); });
    });
  }

  var input = document.querySelector("[data-search]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-s]"));
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-chip]"));
  var stage = "all";

  function filter(q) {
    q = (q || "").trim().toLowerCase();
    var locEl = document.querySelector("[data-loc]");
    var typeEl = document.querySelector("[data-type]");
    var budgetEl = document.querySelector("[data-budget]");
    var loc = locEl ? locEl.value : "any";
    var type = typeEl ? typeEl.value : "any";
    var budget = budgetEl ? budgetEl.value : "any";
    cards.forEach(function (c) {
      var ok = !q || (c.getAttribute("data-s") || "").toLowerCase().indexOf(q) !== -1;
      if (loc && loc !== "any" && (c.getAttribute("data-area") || "") !== loc) ok = false;
      if (type && type !== "any" && (c.getAttribute("data-type") || "").toLowerCase() !== type) ok = false;
      var min = Number(c.getAttribute("data-min") || 0);
      if (budget === "under50" && min >= 50) ok = false;
      if (budget === "mid" && (min < 50 || min >= 100)) ok = false;
      if (budget === "cr" && min < 100) ok = false;
      if (stage && stage !== "all" && (c.getAttribute("data-stage") || "") !== stage) ok = false;
      c.hidden = !ok;
    });
    chips.forEach(function (c) {
      var key = c.getAttribute("data-chip");
      c.classList.toggle("on", (loc === "any" && key === "any") || key === loc);
    });
  }

  function go() {
    filter(input ? input.value : "");
    var target = document.querySelector("[data-results]");
    if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  if (input) input.addEventListener("input", function () { filter(input.value); });
  var form = document.querySelector("[data-finder]");
  if (form) form.addEventListener("submit", function (e) { e.preventDefault(); go(); });
  ["data-loc", "data-type", "data-budget"].forEach(function (attr) {
    var el = document.querySelector("[" + attr + "]");
    if (el) el.addEventListener("change", function () { filter(input ? input.value : ""); });
  });
  document.querySelectorAll("[data-stage]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      stage = btn.getAttribute("data-stage") || "all";
      btn.parentElement.querySelectorAll("[data-stage]").forEach(function (b) {
        b.classList.toggle("on", b === btn);
      });
      filter(input ? input.value : "");
    });
  });
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var q = chip.getAttribute("data-chip") || "any";
      var locEl = document.querySelector("[data-loc]");
      if (locEl) {
        var next = chip.classList.contains("on") && q !== "any" ? "any" : q;
        locEl.value = next;
      }
      if (input) input.value = "";
      filter("");
    });
  });

  document.querySelectorAll("[data-details]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest("[data-s]");
      if (card) card.classList.toggle("open");
    });
  });

  var picks = [];
  var table = document.querySelector("[data-compare]");
  document.querySelectorAll("[data-pick]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var card = btn.closest("[data-s]");
      var i = picks.indexOf(card);
      if (i >= 0) picks.splice(i, 1);
      else { picks.push(card); if (picks.length > 3) picks.shift(); }
      document.querySelectorAll("[data-pick]").forEach(function (b) {
        var on = picks.indexOf(b.closest("[data-s]")) >= 0;
        b.classList.toggle("on", on);
        b.textContent = on ? "Comparing" : "Compare prices";
      });
      e.stopPropagation();
      if (!table) return;
      var rows = ["name", "area", "price", "stage", "type"];
      table.innerHTML = picks.length < 2
        ? "<p class=\"compare-empty\">Pick two or three projects. The facts line up here. Nothing leaves this page.</p>"
        : "<table><tbody>" + rows.map(function (key) {
            return "<tr><th>" + key + "</th>" + picks.map(function (c) {
              return "<td>" + (c.getAttribute("data-" + key) || "—") + "</td>";
            }).join("") + "</tr>";
          }).join("") + "</tbody></table>";
    });
  });

  var menuBtn = document.getElementById("menu");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var links = document.querySelector(".site-nav .links");
      if (links) links.classList.toggle("open");
    });
  }
  var openKey = {
    "Vibranium Urban Realty": "vibranium",
    "Trifecta Veranza": "trifecta",
    "Sarjapur Greenline": "sarjapur",
    "Hennur Courtyard": "hennur",
    "Yelahanka Vista": "yelahanka",
    "Budigere Rise": "budigere"
  };
  document.querySelectorAll(".project, .pc").forEach(function (card) {
    card.style.cursor = "pointer";
    card.addEventListener("click", function (e) {
      if (e.target.closest("[data-pick], a")) return;
      var name = card.getAttribute("data-name");
      if (!name) {
        var heading = card.querySelector("h3");
        name = heading ? heading.textContent.trim() : "";
      }
      var key = openKey[name];
      if (key) location.href = "professional.html#" + key;
    });
  });
})();
