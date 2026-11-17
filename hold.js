(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Quiet star field, same feel as the full site.
  var c = document.getElementById("stars"), ctx = c.getContext("2d"), stars = [], W = 0, H = 0;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size() {
    var r = window.devicePixelRatio || 1; W = innerWidth; H = innerHeight; c.width = W * r; c.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0);
    var n = Math.round(Math.min(140, W * H / 9000)); stars = [];
    for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .3, a: Math.random() * .7 + .15, p: Math.random() * 6.3, v: Math.random() * .06 + .01 });
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(function (s) {
      if (!still) { s.y -= s.v; if (s.y < 0) s.y = H; }
      var tw = still ? 1 : .65 + .35 * Math.sin(t / 1400 + s.p);
      ctx.fillStyle = "rgba(255,255,255," + (s.a * tw).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.3); ctx.fill();
    });
    if (!still) requestAnimationFrame(draw);
  }
  size(); addEventListener("resize", function () { size(); if (still) draw(0); }); requestAnimationFrame(draw);

  // Contact form
  var form = document.getElementById("contact"), status = document.getElementById("status"), btn = form.querySelector(".send");
  var params = new URLSearchParams(location.search);
  if (params.get("sent") === "1") say("Thanks, your message is on its way. I'll reply soon.", "ok");
  if (params.get("sent") === "0") say("Something went wrong sending that. Please email info@lemuelayesu.site.", "err");

  function say(text, kind) { status.textContent = text; status.className = "status " + (kind || ""); }
  function check() {
    var bad = null;
    ["f-name", "f-email", "f-msg"].forEach(function (id) {
      var el = document.getElementById(id), ok = el.value.trim() && (el.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !bad) bad = el;
    });
    return bad;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = check();
    if (bad) { say("Please fill in your name, a valid email and a message.", "err"); bad.focus(); return; }
    var data = {}; new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
    btn.disabled = true; btn.textContent = "Sending..."; say("");
    fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.ok) throw new Error(j.error || "failed"); }); })
      .then(function () { form.reset(); say("Thanks, your message is on its way. I'll reply soon.", "ok"); })
      .catch(function () { say("Something went wrong sending that. Please try again, or email info@lemuelayesu.site.", "err"); })
      .then(function () { btn.disabled = false; btn.textContent = "Send message"; });
  });
})();
