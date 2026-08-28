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
})();