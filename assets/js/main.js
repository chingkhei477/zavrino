/* Zavrino — site behaviour (no third-party scripts, no tracking) */
(function () {
  "use strict";

  var CONTACT_EMAIL = "support@zavrino.in";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  /* ---------- Header: sticky shadow + mobile menu ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      menu.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) closeMenu(); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelectorAll("[data-year]");
  for (var y = 0; y < yearEl.length; y++) yearEl[y].textContent = String(new Date().getFullYear());

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "className") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }
  function safeHttpsUrl(u) {
    try { var p = new URL(u); return p.protocol === "https:" ? p.href : null; } catch (e) { return null; }
  }
  function safeLocalPath(p) {
    return typeof p === "string" && /^assets\/img\/[a-z0-9\-_/]+\.(svg|png|webp|jpg|jpeg)$/i.test(p) ? p : null;
  }

  /* ---------- Offers page ---------- */
  var offerGrid = document.getElementById("offer-grid");
  if (offerGrid) {
    var all = Array.isArray(window.ZAVRINO_OFFERS) ? window.ZAVRINO_OFFERS : [];
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var live = all.filter(function (o) {
      if (!o || !o.store || !o.rate || !safeHttpsUrl(o.url)) return false;
      if (o.validTill) { var d = new Date(o.validTill + "T23:59:59"); if (!isNaN(d) && d < today) return false; }
      return true;
    });

    var searchInput = document.getElementById("offer-search");
    var catSelect = document.getElementById("offer-category");
    var countEl = document.getElementById("offer-count");
    var toolbar = document.getElementById("offer-toolbar");
    var emptyAll = document.getElementById("offers-empty");
    var emptyFilter = document.getElementById("offers-nomatch");

    if (live.length === 0) {
      if (toolbar) toolbar.hidden = true;
      if (emptyAll) emptyAll.hidden = false;
    } else {
      var cats = [];
      live.forEach(function (o) { if (o.category && cats.indexOf(o.category) === -1) cats.push(o.category); });
      cats.sort().forEach(function (c) { catSelect.appendChild(el("option", { value: c, text: c })); });

      var render = function () {
        var q = (searchInput.value || "").trim().toLowerCase();
        var c = catSelect.value;
        var shown = live.filter(function (o) {
          var hay = [o.store, o.category, o.description, o.rate].join(" ").toLowerCase();
          return (!c || o.category === c) && (!q || hay.indexOf(q) !== -1);
        });
        offerGrid.textContent = "";
        shown.forEach(function (o) { offerGrid.appendChild(buildOffer(o)); });
        emptyFilter.hidden = shown.length !== 0;
        countEl.textContent = shown.length + (shown.length === 1 ? " offer" : " offers");
      };
      searchInput.addEventListener("input", render);
      catSelect.addEventListener("change", render);
      render();
    }
  }

  function buildOffer(o) {
    var logoPath = safeLocalPath(o.logo);
    var logo = el("div", { className: "offer-logo", "aria-hidden": "true" });
    if (logoPath) logo.appendChild(el("img", { src: logoPath, alt: "", loading: "lazy", width: "48", height: "48" }));
    else logo.textContent = String(o.store).trim().charAt(0).toUpperCase();

    var meta = el("dl", { className: "offer-meta" }, [
      el("div", null, [el("dt", { text: "Tracks" }), el("dd", { text: o.trackingTime || "See conditions" })]),
      el("div", null, [el("dt", { text: "Confirms in" }), el("dd", { text: o.confirmTime || "See conditions" })])
    ]);

    var conds = Array.isArray(o.conditions) ? o.conditions.filter(Boolean) : [];
    var details = null;
    if (conds.length) {
      var ul = el("ul");
      conds.forEach(function (c) { ul.appendChild(el("li", { text: c })); });
      details = el("details", null, [el("summary", { text: "Reward conditions" }), ul]);
    }
    var validity = o.validTill ? el("p", { className: "offer-cat", text: "Valid till " + formatDate(o.validTill) }) : null;

    var link = el("a", {
      className: "btn btn--primary",
      href: safeHttpsUrl(o.url),
      target: "_blank",
      rel: "sponsored noopener noreferrer",
      text: "Shop via Zavrino"
    });
    link.setAttribute("aria-label", "Shop at " + o.store + " via Zavrino (opens in a new tab)");

    return el("article", { className: "offer" }, [
      el("div", { className: "offer-top" }, [logo, el("div", null, [
        el("div", { className: "offer-store", text: o.store }),
        el("div", { className: "offer-cat", text: o.category || "" })
      ])]),
      el("div", { className: "offer-rate", text: o.rate }),
      o.description ? el("p", { className: "offer-desc", text: o.description }) : null,
      meta, details, validity, link
    ]);
  }
  function formatDate(s) {
    var d = new Date(s + "T00:00:00");
    if (isNaN(d)) return s;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  /* ---------- Contact form (composes an email; no data stored on this site) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var topic = form.elements["topic"];
    var claimBox = document.getElementById("claim-fields");
    var payoutBox = document.getElementById("payout-fields");
    var upiWrap = document.getElementById("upi-wrap");
    var statusBox = document.getElementById("form-status");
    var copyBtn = document.getElementById("copy-message");
    var lastText = "";

    var params = new URLSearchParams(window.location.search);
    var preset = params.get("topic");
    if (preset && topic.querySelector('option[value="' + preset.replace(/[^a-z-]/g, "") + '"]')) topic.value = preset;

    function syncTopic() {
      var t = topic.value;
      claimBox.hidden = t !== "claim";
      payoutBox.hidden = t !== "withdrawal";
      setRequired(claimBox, t === "claim");
      setRequired(payoutBox, t === "withdrawal");
      syncPayout();
    }
    function syncPayout() {
      var isUpi = form.elements["payout_method"].value === "UPI";
      upiWrap.hidden = !(topic.value === "withdrawal" && isUpi);
      form.elements["upi_id"].required = topic.value === "withdrawal" && isUpi;
    }
    function setRequired(box, on) {
      box.querySelectorAll("[data-req]").forEach(function (f) { f.required = on; });
    }
    topic.addEventListener("change", syncTopic);
    form.elements["payout_method"].addEventListener("change", syncPayout);
    syncTopic();

    var maxDate = new Date().toISOString().slice(0, 10);
    if (form.elements["order_date"]) form.elements["order_date"].max = maxDate;

    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) {
        e.target.removeAttribute("aria-invalid");
        var err = document.getElementById(e.target.id + "-error");
        if (err) err.textContent = "";
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusBox.className = "form-status";
      statusBox.textContent = "";
      copyBtn.hidden = true;

      var firstBad = null;
      Array.prototype.forEach.call(form.elements, function (f) {
        if (!f.name || f.closest("[hidden]")) return;
        var err = document.getElementById(f.id + "-error");
        if (!f.checkValidity()) {
          f.setAttribute("aria-invalid", "true");
          if (err) err.textContent = messageFor(f);
          if (!firstBad) firstBad = f;
        } else {
          f.removeAttribute("aria-invalid");
          if (err) err.textContent = "";
        }
      });
      if (form.elements["upi_id"].required && !/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(form.elements["upi_id"].value.trim())) {
        form.elements["upi_id"].setAttribute("aria-invalid", "true");
        document.getElementById("upi_id-error").textContent = "Enter a valid UPI ID, for example name@bank.";
        if (!firstBad) firstBad = form.elements["upi_id"];
      }
      if (firstBad) {
        statusBox.className = "form-status is-visible is-error";
        statusBox.textContent = "Please check the highlighted fields.";
        firstBad.focus();
        return;
      }

      var v = function (n) { return (form.elements[n] && form.elements[n].value || "").trim(); };
      var topicLabel = topic.options[topic.selectedIndex].text;
      var lines = [
        "Topic: " + topicLabel,
        "Name: " + v("name"),
        "Email: " + v("email")
      ];
      if (v("phone")) lines.push("Phone: " + v("phone"));
      if (topic.value === "claim") {
        lines.push("", "— Cashback claim —",
          "Store: " + v("store"),
          "Order ID: " + v("order_id"),
          "Order date: " + v("order_date"),
          "Order value (₹): " + v("order_value"));
      }
      if (topic.value === "withdrawal") {
        lines.push("", "— Withdrawal request —", "Payout method: " + v("payout_method"));
        if (v("payout_method") === "UPI") lines.push("UPI ID: " + v("upi_id"));
        else lines.push("Bank transfer: please reply to this email so I can share bank details.");
      }
      lines.push("", "Message:", v("message"));
      lastText = lines.join("\n");

      var subject = "[Zavrino] " + topicLabel + " — " + v("name");
      var href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lastText);
      window.location.href = href;

      statusBox.className = "form-status is-visible";
      statusBox.textContent = "Your email app should now open with this message ready to send from " + v("email") + ". If nothing opened, copy the message and email it to " + CONTACT_EMAIL + ".";
      copyBtn.hidden = false;
    });

    copyBtn.addEventListener("click", function () {
      var text = "To: " + CONTACT_EMAIL + "\n\n" + lastText;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { copyBtn.textContent = "Copied"; }, fallbackCopy);
      } else { fallbackCopy(); }
      function fallbackCopy() {
        var ta = el("textarea", { readonly: "", "aria-hidden": "true" });
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); copyBtn.textContent = "Copied"; } catch (err) { copyBtn.textContent = "Copy failed"; }
        document.body.removeChild(ta);
      }
      setTimeout(function () { copyBtn.textContent = "Copy message"; }, 2500);
    });
  }

  function messageFor(f) {
    if (f.validity.valueMissing) return f.type === "checkbox" ? "Please tick this box to continue." : "This field is required.";
    if (f.validity.typeMismatch && f.type === "email") return "Enter a valid email address.";
    if (f.validity.patternMismatch) return f.getAttribute("data-pattern-msg") || "Please check the format.";
    if (f.validity.rangeOverflow || f.validity.rangeUnderflow) return f.getAttribute("data-range-msg") || "Please check this value.";
    if (f.validity.tooShort) return "Please add a little more detail.";
    if (f.validity.tooLong) return "This is too long.";
    return "Please check this field.";
  }
})();
