(function () {
  var root = document.documentElement, KEY = "lemuel-theme", c = document.getElementById("stars"), ctx = c.getContext("2d"), stars = [], W = 0, H = 0;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches, depth = c.hasAttribute("data-parallax");
  try { var saved = localStorage.getItem(KEY); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
  function color() { return root.getAttribute("data-theme") === "light" ? "20,20,20" : "255,255,255"; }
  function size() {
    var r = window.devicePixelRatio || 1; W = innerWidth; H = innerHeight; c.width = W * r; c.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0);
    var n = Math.round(Math.min(150, W * H / 9000)); stars = [];
    for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .3, a: Math.random() * .7 + .15, p: Math.random() * 6.3, v: Math.random() * .06 + .01 });
  }
  function draw(t) {
    if (root.classList.contains("inverted")) { if (!still) requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, W, H);
    var fade = Math.max(.25, 1 - scrollY / 900), rgb = color();
    stars.forEach(function (s) {
      if (!still) { s.y -= s.v; if (s.y < 0) s.y = H; }
      var tw = still ? 1 : .65 + .35 * Math.sin(t / 1400 + s.p);
      ctx.fillStyle = "rgba(" + rgb + "," + (s.a * tw * fade).toFixed(3) + ")";
      var py = depth ? ((s.y - scrollY * s.r * .12) % H + H) % H : s.y; ctx.beginPath(); ctx.arc(s.x, py, s.r, 0, 6.3); ctx.fill();
    });
    if (!still) requestAnimationFrame(draw);
  }
  size(); addEventListener("resize", function () { size(); if (still) draw(0); }); requestAnimationFrame(draw);
  Array.prototype.forEach.call(document.querySelectorAll("[data-theme-toggle]"), function (b) {
    b.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next); try { localStorage.setItem(KEY, next); } catch (e) {}
      if (still) draw(0);
    });
  });
  var role = document.getElementById("role");
  if (role && !still) {
    var list = role.getAttribute("data-roles").split("|"), i = 0;
    setInterval(function () { role.classList.add("out"); setTimeout(function () { i = (i + 1) % list.length; role.textContent = list[i]; role.classList.remove("out"); }, 320); }, 2800);
  }
})();
