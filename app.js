(function () {
  var C = window.SITE_CONFIG, P = window.PROJECTS, filter = "All";
  var el = document.getElementById("projects"), bar = document.getElementById("filters");
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function safe(u) { u = String(u || ""); return /^(https:\/\/|assets\/)/.test(u) ? u : ""; }
  function n(i) { return ("0" + (i + 1)).slice(-2); }
  function empty(i) { return '<li class="soon"><span class="soon-num">' + n(i) + '</span><p class="soon-text">Coming soon</p></li>'; }
  function full(p, i) {
    var pts = (p.points || []).slice(0, 4).map(function (x) { return '<div class="point"><h4>' + esc(x.title) + "</h4><p>" + esc(x.text) + "</p></div>"; }).join("");
    return '<li class="case"><h3 class="case-title">' + esc(p.title || p.name) + '</h3><p class="case-tags">' + esc([p.type, p.year].filter(Boolean).join(", ")) + "</p>" +
      '<div class="case-grid"><div class="case-media">' + (safe(p.image) ? '<img src="' + esc(safe(p.image)) + '" alt="' + esc(p.name) + ' screens" loading="lazy">' : "") + "</div>" +
      '<div class="case-side"><p>' + esc(p.summary) + "</p>" + (p.role ? '<p class="case-role">Role: ' + esc(p.role) + "</p>" : "") +
      (safe(p.link) ? '<a href="' + esc(safe(p.link)) + '" rel="noopener noreferrer">See ' + esc(p.name) + "</a>" : "") + "</div></div>" + (pts ? '<div class="points">' + pts + "</div>" : "") + "</li>";
  }
  function render() {
    var types = P.filter(function (p) { return p.name && p.type; }).map(function (p) { return p.type; }).filter(function (t, i, a) { return a.indexOf(t) === i; });
    bar.hidden = types.length < 2;
    bar.innerHTML = ["All"].concat(types).map(function (t) { return '<button type="button" data-f="' + esc(t) + '" aria-pressed="' + (t === filter) + '">' + esc(t) + "</button>"; }).join("");
    el.innerHTML = P.map(function (p, i) {
      if (!p.name) return filter === "All" ? empty(i) : "";
      return filter === "All" || p.type === filter ? full(p, i) : "";
    }).join("");
  }
  bar.addEventListener("click", function (e) { var b = e.target.closest("[data-f]"); if (b) { filter = b.getAttribute("data-f"); render(); } });
  render();
  Array.prototype.forEach.call(document.querySelectorAll("[data-email]"), function (a) { a.href = "mailto:" + C.email; });
  document.getElementById("email-text").textContent = C.email;
  Array.prototype.forEach.call(document.querySelectorAll("[data-linkedin]"), function (a) { if (C.linkedin) { a.href = C.linkedin; a.hidden = false; } });
  document.getElementById("year").textContent = new Date().getFullYear();
})();
