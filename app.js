(function () {
  var C = window.SITE_CONFIG, P = window.PROJECTS, filter = "All";
  var el = document.getElementById("projects"), bar = document.getElementById("filters");
  var home = document.getElementById("home"), study = document.getElementById("study"), curtain = document.getElementById("curtain");
  var M = window.Motion, baseTitle = document.title, savedY = null;

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function safe(u) { u = String(u || ""); return /^(https:\/\/|assets\/)/.test(u) ? u : ""; }
  function slug(p) { return String(p.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  /* Drawn mockups, used until a real image is supplied. Colours come from CSS so they follow the theme. */
  function R(x, y, w, h, c, r) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r || 4) + '" class="' + c + '"/>'; }
  function svg(w, h, inner) { return '<svg viewBox="0 0 ' + w + " " + h + '" aria-hidden="true">' + inner + "</svg>"; }
  function rows(x, y, w, n, gap) { var o = ""; for (var i = 0; i < n; i++) o += R(x, y + i * gap, 34, 34, "d1", 10) + R(x + 44, y + i * gap + 4, w * .55, 9, "d2") + R(x + 44, y + i * gap + 20, w * .34, 7, "d1"); return o; }
  var screens = [
    function () { return R(20, 44, 110, 14, "d3") + R(20, 66, 160, 9, "d2") + R(20, 92, 200, 120, "d1", 18) + R(36, 170, 80, 12, "d3") + R(36, 188, 120, 8, "d2") + rows(20, 232, 200, 5, 50); },
    function () { return R(20, 44, 90, 12, "d2") + R(20, 62, 150, 18, "d3") + R(20, 98, 96, 130, "d1", 16) + R(124, 98, 96, 130, "d2", 16) + R(20, 236, 96, 130, "d2", 16) + R(124, 236, 96, 130, "d1", 16) + R(20, 386, 200, 48, "d3", 24); },
    function () { var b = "", h = [60, 96, 72, 128, 104, 150, 118]; for (var i = 0; i < 7; i++) b += R(26 + i * 28, 250 - h[i], 18, h[i], i === 5 ? "d3" : "d2", 6); return R(20, 44, 70, 10, "d2") + R(20, 62, 120, 26, "d3") + b + rows(20, 276, 200, 4, 50); },
    function () { return '<circle cx="120" cy="104" r="46" class="d1"/><circle cx="120" cy="92" r="16" class="d2"/>' + R(70, 166, 100, 14, "d3") + R(90, 188, 60, 8, "d2") + R(20, 216, 62, 58, "d1", 14) + R(89, 216, 62, 58, "d1", 14) + R(158, 216, 62, 58, "d1", 14) + rows(20, 296, 200, 3, 50) + R(20, 448, 200, 26, "d3", 13); }
  ];
  function phone(i) { return '<div class="ph">' + svg(240, 500, screens[i % 4]()) + "</div>"; }
  function chrome(inner, w, h) { return svg(w, h, R(0, 0, w, 34, "d1", 0) + '<circle cx="20" cy="17" r="5" class="d2"/><circle cx="38" cy="17" r="5" class="d2"/><circle cx="56" cy="17" r="5" class="d2"/>' + R(84, 10, 280, 14, "d0", 7) + inner); }
  function tablePage() { var o = R(0, 34, 150, 526, "d1", 0), i; for (i = 0; i < 6; i++) o += R(20, 64 + i * 34, i === 1 ? 104 : 88, 10, i === 1 ? "d3" : "d2"); o += R(178, 62, 220, 22, "d3") + R(760, 58, 110, 32, "d3", 16); for (i = 0; i < 8; i++) o += R(178, 116 + i * 52, 692, 42, "d1", 10) + R(194, 132 + i * 52, 170, 9, "d2") + R(520, 132 + i * 52, 90, 9, "d2") + R(790, 128 + i * 52, 60, 18, i % 3 ? "d2" : "d3", 9); return chrome(o, 900, 560); }
  function landing() { var o = R(60, 90, 460, 40, "d3", 8) + R(60, 142, 340, 40, "d3", 8) + R(60, 204, 300, 11, "d2") + R(60, 224, 240, 11, "d2") + R(60, 258, 130, 40, "d3", 20) + R(560, 78, 280, 230, "d1", 20); for (var i = 0; i < 3; i++) o += R(60 + i * 266, 340, 248, 190, "d1", 18) + R(80 + i * 266, 480, 130, 11, "d2"); return chrome(o, 900, 560); }
  function dash() { var o = R(24, 54, 200, 96, "d1", 14) + R(242, 54, 200, 96, "d1", 14) + R(460, 54, 200, 96, "d1", 14) + R(678, 54, 198, 96, "d1", 14) + R(44, 78, 70, 9, "d2") + R(44, 98, 120, 24, "d3") + R(262, 78, 70, 9, "d2") + R(262, 98, 96, 24, "d3") + R(480, 78, 70, 9, "d2") + R(480, 98, 130, 24, "d3") + R(698, 78, 70, 9, "d2") + R(698, 98, 84, 24, "d3") + R(24, 168, 560, 368, "d1", 14) + R(602, 168, 274, 368, "d1", 14);
    o += '<path d="M48 470C120 400 170 440 240 360S360 300 420 330 520 250 560 214" class="dl"/><circle cx="739" cy="290" r="72" class="dr"/><circle cx="739" cy="290" r="72" class="dr2"/>' + rows(626, 396, 200, 2, 54); return chrome(o, 900, 560); }

  function mock(type, i) {
    if (type === "Mobile app") return '<div class="mock mock--phones"><div class="lay l1" data-speed="-.05">' + phone(i) + '</div><div class="lay l2" data-speed=".06">' + phone(i + 1) + '</div><div class="lay l3" data-speed="-.12">' + phone(i + 2) + "</div></div>";
    if (type === "Dashboard") return '<div class="mock mock--wide"><div class="lay b1" data-speed=".05"><div class="br">' + dash() + "</div></div></div>";
    var page = type === "Website" ? landing() : tablePage();
    return '<div class="mock mock--wide"><div class="lay b1" data-speed=".05"><div class="br">' + page + '</div></div><div class="lay b2" data-speed="-.1">' + phone(i) + "</div></div>";
  }
  function media(p, i) {
    var img = safe(p.image);
    return img ? '<img src="' + esc(img) + '" alt="' + esc(p.name) + ' screens" loading="lazy">' : mock(p.type, i);
  }

  function card(p, i) {
    return '<li class="case" data-i="' + i + '"><a class="case-card" href="#work/' + slug(p) + '" data-cursor="View"><span class="case-shade"></span>' +
      '<div class="case-text"><p class="case-tags">' + esc([p.type, p.year].filter(Boolean).join(", ")) + '</p><h3 class="case-title">' + esc(p.name) + '</h3><p class="case-line">' + esc(p.title) + '</p><p class="case-sum">' + esc(p.summary) + '</p><span class="case-more">View case study <span aria-hidden="true">&#8599;</span></span></div>' +
      '<div class="case-media tone-' + (i % 2) + '">' + media(p, i) + "</div></a></li>";
  }

  function render() {
    var types = P.map(function (p) { return p.type; }).filter(function (t, i, a) { return t && a.indexOf(t) === i; });
    bar.hidden = types.length < 2;
    bar.innerHTML = ["All"].concat(types).map(function (t) { return '<button type="button" data-f="' + esc(t) + '" aria-pressed="' + (t === filter) + '">' + esc(t) + "</button>"; }).join("");
    el.innerHTML = P.map(function (p, i) { return filter === "All" || p.type === filter ? card(p, i) : ""; }).join("");
    Array.prototype.forEach.call(el.children, function (li, n) { li.style.setProperty("--n", n); });
    M.refresh();
  }
  bar.addEventListener("click", function (e) { var b = e.target.closest("[data-f]"); if (b) { filter = b.getAttribute("data-f"); render(); } });

  function studyHtml(p, i) {
    var next = P[(i + 1) % P.length];
    var meta = [["Role", p.role], ["Client", p.client], ["Timeline", p.timeline], ["Tools", (p.tools || []).join(", ")]].filter(function (m) { return m[1]; });
    return '<header class="study-head"><a class="back" href="#work"><span aria-hidden="true">&#8592;</span> All work</a><p class="case-tags">' + esc([p.type, p.year].filter(Boolean).join(", ")) + '</p><h1 class="study-title" tabindex="-1" data-split>' + esc(p.name) + '</h1><p class="study-line" data-reveal>' + esc(p.title) + "</p>" +
      '<dl class="study-meta">' + meta.map(function (m) { return '<div data-reveal><dt>' + esc(m[0]) + "</dt><dd>" + esc(m[1]) + "</dd></div>"; }).join("") + "</dl></header>" +
      '<div class="study-hero case-media tone-' + (i % 2) + '">' + media(p, i) + "</div>" +
      '<section class="study-two"><h2 data-split>The problem</h2><div><p class="study-big" data-reveal>' + esc(p.summary) + '</p><p data-reveal>' + esc(p.challenge) + "</p></div></section>" +
      '<section class="study-two"><h2 data-split>The approach</h2><div><p data-reveal>' + esc(p.approach) + "</p></div></section>" +
      (p.steps && p.steps.length ? '<ol class="study-steps">' + p.steps.map(function (s, n) { return '<li data-reveal><span class="step-n">' + (n + 1) + "</span><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></li>"; }).join("") + "</ol>" : "") +
      '<div class="study-gallery"><div class="case-media tone-' + ((i + 1) % 2) + '">' + mock(p.type, i + 1) + '</div><div class="case-media tone-' + (i % 2) + '">' + mock(p.type, i + 2) + "</div></div>" +
      (p.results && p.results.length ? '<section class="study-results"><h2 data-split>What changed</h2><div class="stats">' + p.results.map(function (r) { return '<div class="stat" data-reveal><strong data-count="' + +r.value + '" data-suffix="' + esc(r.suffix) + '">' + esc(r.value) + esc(r.suffix) + "</strong><span>" + esc(r.label) + "</span></div>"; }).join("") + "</div></section>" : "") +
      (p.quote ? '<figure class="study-quote" data-reveal><blockquote>' + esc(p.quote.text) + "</blockquote><figcaption><strong>" + esc(p.quote.name) + "</strong><span>" + esc(p.quote.role) + "</span></figcaption></figure>" : "") +
      (safe(p.link) ? '<p class="study-link"><a class="pillbtn" href="' + esc(safe(p.link)) + '" rel="noopener noreferrer">See ' + esc(p.name) + "</a></p>" : "") +
      '<a class="study-next" href="#work/' + slug(next) + '" data-cursor="Next"><span>Next project</span><strong>' + esc(next.name) + "</strong></a>" +
      '<div class="foot-end study-end"><span>&copy; ' + new Date().getFullYear() + ' Lemuel Ayesu. Accra, Ghana.</span><a href="#work">Back to all work</a></div>';
  }

  function find(hash) { var m = /^#work\/(.+)$/.exec(hash); if (!m) return -1; for (var i = 0; i < P.length; i++) if (slug(P[i]) === m[1]) return i; return -1; }
  function scrollNow(y) { var h = document.documentElement; h.style.scrollBehavior = "auto"; window.scrollTo(0, y); M.jump(); requestAnimationFrame(function () { h.style.scrollBehavior = ""; }); }

  function show() {
    var i = find(location.hash), inStudy = !study.hidden;
    if (i >= 0) {
      if (!inStudy) savedY = window.scrollY;
      study.innerHTML = studyHtml(P[i], i);
      study.hidden = false; home.hidden = true;
      document.title = P[i].name + " | Lemuel Ayesu";
      M.refresh(); scrollNow(0);
      var t = study.querySelector(".study-title"); if (t) t.focus({ preventScroll: true });
      return;
    }
    if (inStudy) {
      study.hidden = true; study.innerHTML = ""; home.hidden = false;
      document.title = baseTitle;
      M.refresh();
      var target = location.hash && location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
      if (location.hash === "#work" && savedY !== null) scrollNow(savedY);
      else if (target) scrollNow(target.getBoundingClientRect().top + window.scrollY - 90);
      else scrollNow(0);
    }
  }

  var busy = false;
  function route() {
    var viewChange = find(location.hash) >= 0 || !study.hidden;
    if (!viewChange) return;
    if (M.still || busy) { show(); return; }
    busy = true;
    curtain.className = "curtain up";
    setTimeout(function () { show(); curtain.className = "curtain up away"; setTimeout(function () { curtain.className = "curtain"; busy = false; }, 620); }, 560);
  }
  addEventListener("hashchange", route);

  render();
  Array.prototype.forEach.call(document.querySelectorAll("[data-email]"), function (a) { a.href = "mailto:" + C.email; });
  document.getElementById("email-text").textContent = C.email;
  Array.prototype.forEach.call(document.querySelectorAll("[data-linkedin]"), function (a) { if (C.linkedin) { a.href = C.linkedin; a.hidden = false; a.rel = "noopener noreferrer"; } });
  document.getElementById("year").textContent = new Date().getFullYear();

  Array.prototype.forEach.call(document.querySelectorAll(".svc button"), function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      Array.prototype.forEach.call(document.querySelectorAll(".svc button"), function (o) { o.setAttribute("aria-expanded", "false"); document.getElementById(o.getAttribute("aria-controls")).classList.remove("open"); });
      if (!open) { b.setAttribute("aria-expanded", "true"); document.getElementById(b.getAttribute("aria-controls")).classList.add("open"); }
    });
  });

  var rail = document.getElementById("voice-rail");
  function move(d) { var w = rail.firstElementChild.getBoundingClientRect().width + 16; rail.scrollBy({ left: d * w, behavior: M.still ? "auto" : "smooth" }); }
  document.getElementById("voice-prev").addEventListener("click", function () { move(-1); });
  document.getElementById("voice-next").addEventListener("click", function () { move(1); });

  var clock = document.getElementById("clock");
  function tick() { clock.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Africa/Accra", hour: "2-digit", minute: "2-digit" }); }
  tick(); setInterval(tick, 20000);

  var dockLinks = {};
  Array.prototype.forEach.call(document.querySelectorAll(".dock a.icon"), function (a) { dockLinks[a.getAttribute("href").slice(1)] = a; });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id === "hero" ? "top" : e.target.id;
      Object.keys(dockLinks).forEach(function (k) { if (k === id) dockLinks[k].setAttribute("aria-current", "true"); else dockLinks[k].removeAttribute("aria-current"); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["hero", "work", "about", "stack"].forEach(function (id) { var t = document.getElementById(id); if (t) io.observe(t); });

  if (find(location.hash) >= 0) show();
})();
