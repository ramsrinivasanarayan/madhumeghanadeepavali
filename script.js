(function () {
    var SVGNS = "http://www.w3.org/2000/svg";
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function el(name, attrs, parent) {
        var n = document.createElementNS(SVGNS, name);
        for (var k in attrs) n.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(n);
        return n;
    }

    /* ---------- stars ---------- */
    var stars = document.getElementById("stars");
    for (var i = 0; i < 70; i++) {
        var s = document.createElement("i");
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 70 + "%";
        s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
        if (Math.random() < .2) { s.style.width = s.style.height = "3px"; }
        stars.appendChild(s);
    }

    /* ---------- toran: marigold strings and mango leaves across the top ---------- */
    var toran = document.getElementById("toran");
    function drawToran() {
        var w = window.innerWidth;
        toran.innerHTML = "";
        toran.setAttribute("viewBox", "0 0 " + w + " 90");
        var span = w < 600 ? 110 : 150, sag = 34;
        for (var x0 = -span / 2; x0 < w + span; x0 += span) {
            var x1 = x0 + span;
            for (var t = 0; t <= 1.0001; t += 1 / 7) {
                var x = x0 + (x1 - x0) * t;
                var y = 6 + sag * 4 * t * (1 - t);
                el("circle", { cx: x, cy: y, r: 7, fill: t * 7 % 2 < 1 ? "#f6a21e" : "#ffd34d" }, toran);
                el("circle", { cx: x, cy: y, r: 2.4, fill: "#c8102e" }, toran);
            }
            /* a mango leaf hanging from the middle of each string */
            var mx = x0 + span / 2, my = 6 + sag;
            el("path", { d: "M" + mx + " " + my + " q 10 18 0 40 q -10 -22 0 -40 z", fill: "#2f7d3a" }, toran);
            el("path", { d: "M" + mx + " " + my + " l 0 38", stroke: "#8fd18f", "stroke-width": 1, fill: "none" }, toran);
        }
    }
    drawToran();
    window.addEventListener("resize", drawToran);

    /* ---------- rangoli, drawn in once when the page opens ---------- */
    var rangoli = document.getElementById("rangoli");
    var colours = ["#e0457b", "#ffd34d", "#f6a21e", "#fff8e7"];
    var parts = [];
    parts.push(el("circle", { cx: 0, cy: 0, r: 36, stroke: colours[1] }, rangoli));
    for (var k = 0; k < 8; k++) {
        var g = el("g", { transform: "rotate(" + k * 45 + ")" }, rangoli);
        parts.push(el("path", { d: "M0 -40 Q 34 -95 0 -150 Q -34 -95 0 -40 Z", stroke: colours[0] }, g));
        parts.push(el("path", { d: "M0 -60 Q 14 -95 0 -128 Q -14 -95 0 -60 Z", stroke: colours[1] }, g));
        var g2 = el("g", { transform: "rotate(" + (k * 45 + 22.5) + ")" }, rangoli);
        parts.push(el("path", { d: "M0 -44 Q 20 -78 0 -105 Q -20 -78 0 -44 Z", stroke: colours[2] }, g2));
    }
    var ring = "";
    for (var a = 0; a < 24; a++) {
        var a0 = a / 24 * Math.PI * 2, a1 = (a + 1) / 24 * Math.PI * 2, r = 168;
        var p0 = [Math.cos(a0) * r, Math.sin(a0) * r], p1 = [Math.cos(a1) * r, Math.sin(a1) * r];
        ring += (a ? " " : "M" + p0[0].toFixed(1) + " " + p0[1].toFixed(1)) + " A 22 22 0 0 1 " + p1[0].toFixed(1) + " " + p1[1].toFixed(1);
    }
    parts.push(el("path", { d: ring, stroke: colours[3] }, rangoli));
    for (var dt = 0; dt < 24; dt++) {
        var ad = (dt + .5) / 24 * Math.PI * 2;
        parts.push(el("circle", { cx: (Math.cos(ad) * 190).toFixed(1), cy: (Math.sin(ad) * 190).toFixed(1), r: 3, stroke: colours[dt % 2 ? 0 : 1] }, rangoli));
    }
    parts.forEach(function (p, idx) {
        var len = Math.ceil(p.getTotalLength ? p.getTotalLength() : 600) + 2;
        p.style.setProperty("--len", len);
        p.style.setProperty("--d", (idx * 0.05).toFixed(2) + "s");
    });

    /* ---------- fireworks ---------- */
    var canvas = document.getElementById("fireworks"), ctx = canvas.getContext("2d");
    var sparks = [], running = false;
    function size() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);
    var burstColours = ["#ffd34d", "#f6a21e", "#e0457b", "#fff8e7", "#ff6b4a", "#9be7ff"];
    function burst(x, y) {
        var c = burstColours[Math.floor(Math.random() * burstColours.length)];
        var n = 60 + Math.floor(Math.random() * 30);
        for (var i = 0; i < n; i++) {
            var ang = Math.PI * 2 * i / n, sp = 2 + Math.random() * 3.2;
            sparks.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1, c: c });
        }
        if (!running) { running = true; requestAnimationFrame(tick); }
    }
    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = sparks.length - 1; i >= 0; i--) {
            var p = sparks[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.045; p.vx *= .985; p.vy *= .985; p.life -= 0.012;
            if (p.life <= 0) { sparks.splice(i, 1); continue; }
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.c;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (sparks.length) requestAnimationFrame(tick); else running = false;
    }
    function randomBurst() {
        burst(window.innerWidth * (.15 + Math.random() * .7), window.innerHeight * (.12 + Math.random() * .35));
    }

    /* ---------- lighting the lamps ---------- */
    var stations = Array.prototype.slice.call(document.querySelectorAll(".station"));
    var finale = document.getElementById("finale"), hint = document.getElementById("hint");
    var autoTimer = null, finished = false;

    function light(station) {
        if (station.classList.contains("lit")) return;
        station.classList.add("lit");
        if (!reduceMotion) {
            var r = station.querySelector(".diya").getBoundingClientRect();
            burst(r.left + r.width / 2, r.top);
        }
        var allLit = stations.every(function (s) { return s.classList.contains("lit"); });
        if (allLit) celebrate(); else scheduleAuto(2600);
    }

    function celebrate() {
        if (finished) return;
        finished = true;
        clearTimeout(autoTimer);
        if (hint) hint.classList.add("done");
        setTimeout(function () {
            finale.classList.add("show");
            setTimeout(function () {
                var r = finale.getBoundingClientRect();
                if (r.top > window.innerHeight * .6) finale.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
            }, 900);
        }, 700);
        if (reduceMotion) return;
        var n = 0, show = setInterval(function () {
            randomBurst();
            if (++n > 12) {
                clearInterval(show);
                setInterval(randomBurst, 2600);   /* a gentle firework now and then */
            }
        }, 450);
    }

    /* the lamps light by themselves one after the other as soon as the page opens */
    function scheduleAuto(delay) {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(function () {
            var next = stations.filter(function (s) { return !s.classList.contains("lit"); })[0];
            if (next) light(next);
        }, delay);
    }

    stations.forEach(function (st) {
        st.querySelector(".diya").addEventListener("click", function () { light(st); });
        st.querySelector(".arch").addEventListener("click", function () { light(st); });
    });
    scheduleAuto(1500);

    /* ---------- background song ---------- */
    var song = document.getElementById("song"), muteBtn = document.getElementById("muteBtn");
    var events = ["click", "touchstart", "keydown"];
    function playSong() {
        song.play().then(function () {
            events.forEach(function (e) { document.removeEventListener(e, playSong); });
        }).catch(function () {});
    }
    events.forEach(function (e) { document.addEventListener(e, playSong); });
    playSong();
    muteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        song.muted = !song.muted;
        muteBtn.textContent = song.muted ? "🔇" : "🔊";
        if (song.paused) playSong();
    });
})();
