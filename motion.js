/* All motion for the site. No libraries, and nothing inline, so the strict security policy stays on.
   Everything is transforms and opacity. With reduced motion on, none of this runs and the page reads normally. */
(function () {
  var root = document.documentElement;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var byId = function (id) { return document.getElementById(id); };
  var all = function (sel, base) { return Array.prototype.slice.call((base || document).querySelectorAll(sel)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var range = function (v, a, b) { return clamp((v - a) / (b - a), 0, 1); };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  var cy = window.scrollY, sy = cy, vw = innerWidth, vh = innerHeight, S = {};
  var seen;

  function words(el, wrap) {
    if (el.getAttribute("data-done")) return all(".w", el);
    var text = el.textContent, out = [];
    el.textContent = "";
    text.split(/\s+/).filter(Boolean).forEach(function (t, i, list) {
      var w = document.createElement("span"); w.className = "w";
      if (wrap) { var inner = document.createElement("span"); inner.className = "wi"; inner.textContent = t; inner.style.setProperty("--i", i); w.appendChild(inner); }
      else w.textContent = t;
      el.appendChild(w); out.push(w);
      if (i < list.length - 1) el.appendChild(document.createTextNode(" "));
    });
    el.setAttribute("data-done", "1");
    return out;
  }

  function count(el) {
    var end = +el.getAttribute("data-count"), suf = el.getAttribute("data-suffix") || "", t0 = performance.now();
    (function tick(t) { var p = ease(range(t - t0, 0, 1400)); el.textContent = Math.round(end * p) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
  }

  function observe() {
    if (seen) seen.disconnect();
    seen = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        all("[data-count]", e.target).concat(e.target.hasAttribute("data-count") ? [e.target] : []).forEach(count);
        seen.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .05 });
    all("[data-split]").forEach(function (el) { words(el, true); });
    all("[data-reveal],[data-split]").forEach(function (el) { if (!el.classList.contains("in")) seen.observe(el); });
  }

  function collect() {
    vw = innerWidth; vh = innerHeight;
    S.progress = byId("progress");
    S.hero = byId("hero"); S.disc = byId("disc"); S.fill = byId("disc-fill"); S.mark = byId("disc-mark");
    S.left = byId("hero-left"); S.right = byId("hero-right"); S.cue = byId("hero-cue");
    S.say = byId("statement-text"); S.sayWords = S.say ? words(S.say, false) : [];
    S.speed = all("[data-speed]").filter(function (e) { return e.offsetParent !== null; }).map(function (e) { return { el: e, v: +e.getAttribute("data-speed") * (vw < 641 ? .55 : 1), p: e.parentElement }; });
    S.cards = all("#projects .case").filter(function (e) { return e.offsetParent !== null; }).map(function (e) { return { li: e, card: e.firstElementChild, shade: e.querySelector(".case-shade") }; });
    S.tickers = all("[data-ticker]").map(function (e) { return { el: e, dir: +e.getAttribute("data-ticker"), w: e.scrollWidth / 4 }; });
    S.process = byId("process"); S.rail = byId("rail"); S.railBar = byId("rail-progress");
    S.journey = byId("journey"); S.line = byId("journey-line");
    S.foot = byId("foot-word");
    if (S.process) {
      var pin = vw > 980;
      S.process.classList.toggle("pinned", pin);
      S.pinned = pin;
      S.railW = pin ? Math.max(0, S.rail.scrollWidth - vw + 80) : 0;
      S.process.style.height = pin ? (vh + S.railW) + "px" : "";
    }
    if (S.disc) {
      var r = S.disc.parentElement.getBoundingClientRect(), cx = r.left + r.width / 2, cyy = r.top + scrollY + r.height / 2;
      var far = Math.hypot(Math.max(cx, vw - cx), Math.max(cyy, vh - cyy));
      S.cover = (far * 2 / Math.max(1, r.width)) * 1.06;
    }
    observe();
  }

  function frame(t) {
    requestAnimationFrame(frame);
    sy = window.scrollY;
    cy += (sy - cy) * .14;
    if (Math.abs(sy - cy) < .08) cy = sy;
    var lag = sy - cy, doc = root.scrollHeight - vh, i, r;
    if (S.progress) S.progress.style.transform = "scaleX(" + (doc > 0 ? clamp(cy / doc, 0, 1) : 0) + ")";

    if (S.hero && S.hero.offsetParent !== null) {
      r = S.hero.getBoundingClientRect();
      if (r.bottom + lag <= -50 && S.inv) { S.inv = false; root.classList.remove("inverted"); }
      if (r.bottom + lag > -50) {
        var p = range(-(r.top + lag), 0, r.height - vh);
        var grow = ease(range(p, .02, .46)), g2 = range(p, .02, .46), inv = p > .3 && r.bottom + lag > 90;
        if (inv !== S.inv) { S.inv = inv; root.classList.toggle("inverted", inv); }
        S.disc.style.transform = "scale(" + (1 + (S.cover - 1) * g2 * g2) + ")";
        S.fill.style.opacity = range(p, .08, .3);
        S.mark.style.opacity = 1 - range(p, .02, .14);
        S.left.style.transform = "translate3d(" + (-grow * vw * .22) + "px,0,0)";
        S.right.style.transform = "translate3d(" + (grow * vw * .22) + "px,0,0)";
        S.left.style.opacity = S.right.style.opacity = 1 - range(p, .02, .2);
        S.left.style.visibility = S.right.style.visibility = p > .24 ? "hidden" : "";
        S.cue.style.opacity = 1 - range(p, 0, .04);
        var n = S.sayWords.length, q = range(p, .48, .94) * (n + 2);
        for (i = 0; i < n; i++) S.sayWords[i].style.opacity = p < .4 ? 0 : .16 + .84 * clamp(q - i, 0, 1);
      }
    }

    if (S.speed) for (i = 0; i < S.speed.length; i++) {
      var s = S.speed[i]; r = s.p.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      s.el.style.transform = "translate3d(0," + ((r.top + r.height / 2 + lag - vh / 2) * s.v).toFixed(1) + "px,0)";
    }

    if (S.cards && vw > 980) for (i = 0; i < S.cards.length - 1; i++) {
      var c = S.cards[i], nx = S.cards[i + 1].li.getBoundingClientRect(), me = c.li.getBoundingClientRect();
      var k = clamp(1 - (nx.top + lag - me.top) / Math.max(1, me.height), 0, 1);
      c.card.style.transform = "scale(" + (1 - .05 * k).toFixed(4) + ")";
      if (c.shade) c.shade.style.opacity = (k * .55).toFixed(3);
    }

    if (S.tickers && S.tickers.length && S.tickers[0].el.parentElement.getBoundingClientRect().bottom > -50 && S.tickers[0].el.parentElement.getBoundingClientRect().top < vh + 50) for (i = 0; i < S.tickers.length; i++) {
      var tk = S.tickers[i], x = (cy * .35 + t * .012) % tk.w;
      tk.el.style.transform = "translate3d(" + (tk.dir < 0 ? -x : x - tk.w) + "px,0,0)";
    }

    if (S.pinned && S.process.offsetParent !== null) {
      r = S.process.getBoundingClientRect();
      var pr = range(-(r.top + lag), 0, r.height - vh);
      S.rail.style.transform = "translate3d(" + (-pr * S.railW) + "px,0,0)";
      S.railBar.style.transform = "scaleX(" + pr + ")";
    }

    if (S.journey && S.journey.offsetParent !== null) {
      r = S.journey.getBoundingClientRect();
      S.line.style.transform = "scaleY(" + range(vh * .8 - r.top - lag, 0, r.height) + ")";
    }
    if (S.foot && S.foot.offsetParent !== null) {
      r = S.foot.parentElement.getBoundingClientRect();
      S.foot.style.transform = "translate3d(0," + (range(r.top + lag, vh - r.height * 1.4, vh) * 62) + "%,0)";
    }
  }

  function cursor() {
    var el = byId("cursor"), label = el.firstElementChild, x = 0, y = 0, cx = 0, cyy = 0, on = false;
    root.classList.add("has-cursor");
    addEventListener("pointermove", function (e) {
      x = e.clientX; y = e.clientY;
      var hit = e.target.closest && e.target.closest("[data-cursor]");
      if (!!hit !== on) { on = !!hit; el.classList.toggle("on", on); }
      if (hit) label.textContent = hit.getAttribute("data-cursor");
    }, { passive: true });
    (function loop() { cx += (x - cx) * .18; cyy += (y - cyy) * .18; el.style.transform = "translate3d(" + cx + "px," + cyy + "px,0)"; requestAnimationFrame(loop); })();
  }

  function magnets() {
    document.addEventListener("pointermove", function (e) {
      all("[data-magnet]").forEach(function (m) {
        var r = m.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
        var near = Math.hypot(dx, dy) < Math.max(r.width, 90);
        m.style.transform = near ? "translate(" + dx * .18 + "px," + dy * .28 + "px)" : "";
      });
    }, { passive: true });
  }

  window.Motion = {
    still: still,
    refresh: function () { if (!still) collect(); else observeStill(); },
    jump: function () { cy = sy = window.scrollY; }
  };
  function observeStill() { all("[data-reveal],[data-split]").forEach(function (e) { e.classList.add("in"); }); }

  if (still) { observeStill(); return; }
  root.classList.add("motion");
  var rs; addEventListener("resize", function () { clearTimeout(rs); rs = setTimeout(collect, 150); });
  addEventListener("load", collect);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(collect);
  document.addEventListener("DOMContentLoaded", collect);
  collect();
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add("ready"); }); });
  requestAnimationFrame(frame);
  if (fine) { cursor(); magnets(); }
})();
