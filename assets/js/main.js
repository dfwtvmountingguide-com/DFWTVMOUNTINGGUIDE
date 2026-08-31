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
  } else {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
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
})();