// DFW TV Mounting Guide — shared JS
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", links.classList.contains("open") ? "true" : "false");
    });
    // Close menu when a link is chosen (mobile)
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", function () {
      var a = item.querySelector(".faq-a");
      var isOpen = item.classList.contains("open");
      // close others
      item.parentElement.querySelectorAll(".faq-item").forEach(function (o) {
        o.classList.remove("open");
        var oa = o.querySelector(".faq-a");
        if (oa) oa.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        if (a) a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  // Mark body so mobile content isn't covered by sticky CTA
  if (document.querySelector(".mobile-cta")) {
    document.body.classList.add("has-sticky-cta");
  }

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll("[data-reveal], .reveal-group");
  function revealAll() {
    revealEls.forEach(function (el) {
      el.classList.add("revealed");
      if (el.classList.contains("reveal-group")) {
        el.classList.add("revealed");
      }
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    // Safety net: if IO never fires (headless, edge cases), reveal all after 2s
    setTimeout(revealAll, 2000);
  } else {
    revealAll();
  }

  // ---- Jitter drop-in player ----
  // Any element with [data-jitter] renders a Lottie .json or loops an .mp4/.webm
  // from the site's /assets/jitter/ folder. Drop exported files there to enable.
  function resolvePath(rel) {
    var base = document.currentScript && document.currentScript.src ? document.currentScript.src.split("/").slice(0, -2).join("/") : "";
    return base ? base + "/" + rel : rel;
  }

  document.querySelectorAll("[data-jitter]").forEach(function (slot) {
    var file = slot.getAttribute("data-jitter");
    if (!file) return;
    var ext = file.toLowerCase().split(".").pop();
    var isVideo = (ext === "mp4" || ext === "webm" || ext === "m4v");
    if (isVideo) {
      var v = document.createElement("video");
      v.src = resolvePath(file);
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
      v.addEventListener("error", function () {
        var n = document.createElement("p");
        n.className = "slot-note";
        n.textContent = "Drop a Jitter export at /assets/jitter/" + file;
        slot.appendChild(n);
      });
      slot.appendChild(v);
    } else if (ext === "json" && window.lottie) {
      try {
        window.lottie.loadAnimation({ container: slot, renderer: "svg", loop: true, autoplay: true, path: resolvePath(file) });
      } catch (err) {
        var n2 = document.createElement("p");
        n2.className = "slot-note";
        n2.textContent = "Unable to load " + file;
        slot.appendChild(n2);
      }
    }
  });
// ---- Scroll progress bar ----
  var progBar = document.querySelector(".scroll-progress .bar");
  if (progBar) {
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      progBar.style.width = pct + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  // ---- Marquee: duplicate content so it scrolls seamlessly ----
  document.querySelectorAll(".marquee .track").forEach(function (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  // ---- Count-up stats on scroll into view ----
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var prog = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3); // ease-out cubic
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString() + (el.getAttribute("data-suffix") || "");
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + (el.getAttribute("data-suffix") || "");
    }
    requestAnimationFrame(step);
  }
  var countEls = document.querySelectorAll("[data-count]");
  if (countEls.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    countEls.forEach(function (el) { cio.observe(el); });
  } else {
    countEls.forEach(function (el) {
      el.textContent = parseFloat(el.getAttribute("data-count")).toLocaleString() + (el.getAttribute("data-suffix") || "");
    });
  }
})();