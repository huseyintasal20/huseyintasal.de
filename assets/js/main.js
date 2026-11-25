/* ==========================================================================
   huseyintasal.de – Skript
   Intro · Header · Menü · Sprachen · Einblenden · Laufbänder · Formular
   ========================================================================== */
(function () {
  "use strict";

  var html = document.documentElement;
  html.classList.add("js");
  var I18N = window.HT_I18N || { js: { de: {} } };
  var STORAGE_LANG = "ht-lang";
  var LANGS = ["de", "en", "tr"];
  var currentLang = "de";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }
  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function t(key) {
    var js = I18N.js || {};
    return (js[currentLang] && js[currentLang][key]) || (js.de && js.de[key]) || "";
  }

  /* ---------- Intro: Logo erscheint mittig und fliegt nach links oben ---------- */
  function initIntro() {
    if (!html.classList.contains("intro-on")) return;
    var intro = $("#intro");
    var mark = intro && $(".intro-mark", intro);
    var target = $(".site-header .brand-mark");
    if (!intro || !mark || !target) { html.classList.remove("intro-on"); return; }

    try { sessionStorage.setItem("ht-intro-seen", "1"); } catch (e) {}

    var finished = false;
    var heroShown = false;
    function showHero() {
      if (heroShown) return;
      heroShown = true;
      $$(".hero [data-reveal]").forEach(function (el, i) {
        el.style.transitionDelay = (i * 90) + "ms";
        el.classList.add("is-visible");
      });
    }
    function finish() {
      if (finished) return;
      finished = true;
      showHero();
      html.classList.remove("intro-on");
      if (intro.parentNode) intro.parentNode.removeChild(intro);
    }

    // Klick oder Taste überspringt das Intro
    intro.addEventListener("click", finish);
    document.addEventListener("keydown", finish, { once: true });

    setTimeout(function () {
      if (finished) return;
      var a = mark.getBoundingClientRect();
      var b = target.getBoundingClientRect();
      intro.classList.add("is-leaving");
      // Ändert sich die Fenstergröße während des Flugs (Drehen, Skalieren), Intro sofort beenden
      window.addEventListener("resize", finish, { once: true });
      showHero();
      if (a.width > 0 && b.width > 0) {
        var scale = b.width / a.width;
        mark.style.transform = "translate(" + (b.left - a.left) + "px," + (b.top - a.top) + "px) scale(" + scale + ")";
      }
      setTimeout(finish, 820);
    }, 1700);
  }

  /* ---------- Header-Schatten beim Scrollen ---------- */
  function initHeader() {
    var header = $("#site-header");
    if (!header) return;
    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobiles Menü ---------- */
  function initMenu() {
    var toggle = $("#menu-toggle");
    var menu = $("#mobile-menu");
    if (!toggle || !menu) return;
    var label = $(".visually-hidden", toggle);

    function setOpen(open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
      if (label) label.textContent = open ? t("menu_close") : t("menu_open");
      if (open) {
        var first = $("a", menu);
        if (first) first.focus();
      }
    }

    toggle.addEventListener("click", function () { setOpen(menu.hidden); });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener("resize", debounce(function () {
      if (window.innerWidth > 1140 && !menu.hidden) setOpen(false);
    }, 120));
  }

  /* ---------- Hell/Dunkel-Knopf ----------
     Standard: Einstellung des Geräts. Ein Klick wählt fest Hell oder Dunkel (wird gespeichert). */
  var syncTheme = function () {};
  function initTheme() {
    var btns = $$(".theme-btn");
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    function current() {
      var chosen = html.getAttribute("data-theme");
      if (chosen === "light" || chosen === "dark") return chosen;
      return mq && mq.matches ? "dark" : "light";
    }
    syncTheme = function () {
      var now = current();
      btns.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-set-theme") === now));
        var label = $(".visually-hidden", b);
        if (label) b.setAttribute("title", label.textContent); // Tooltip mit Text beim Darüberfahren
      });
      // Farbe der Browserleiste (Handy) mitziehen, sobald fest gewählt wurde
      if (html.hasAttribute("data-theme")) {
        $$('meta[name="theme-color"]').forEach(function (m) { m.setAttribute("content", now === "dark" ? "#15120e" : "#f7f1e8"); });
      }
    };
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var next = b.getAttribute("data-set-theme");
        html.setAttribute("data-theme", next);
        store("ht-theme", next);
        syncTheme();
      });
    });
    if (mq) {
      var onChange = function () { syncTheme(); };
      if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
    }
    syncTheme();
  }

  /* ---------- Sprachen ---------- */
  var DE = {};
  var DE_ATTR = {};
  // Übersetzbare Attribute: data-i18n-ph → placeholder, data-i18n-alt → alt
  var ATTRS = [["data-i18n-ph", "placeholder"], ["data-i18n-alt", "alt"]];

  function captureGerman() {
    $$("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (!(k in DE)) DE[k] = el.innerHTML;
    });
    ATTRS.forEach(function (pair) {
      $$("[" + pair[0] + "]").forEach(function (el) {
        var k = el.getAttribute(pair[0]);
        if (!(k in DE_ATTR)) DE_ATTR[k] = el.getAttribute(pair[1]) || "";
      });
    });
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = "de";
    currentLang = lang;
    var dict = lang === "de" ? null : I18N[lang] || {};

    $$("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      var val = dict && dict[k] != null ? dict[k] : DE[k];
      if (val != null && el.innerHTML !== val) el.innerHTML = val;
    });
    ATTRS.forEach(function (pair) {
      $$("[" + pair[0] + "]").forEach(function (el) {
        var k = el.getAttribute(pair[0]);
        var val = dict && dict[k] != null ? dict[k] : DE_ATTR[k];
        if (val != null) el.setAttribute(pair[1], val);
      });
    });

    html.setAttribute("lang", lang);
    var title = t("title");
    if (title && $(".hero")) document.title = title;

    $$(".lang-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    var toggle = $("#menu-toggle");
    var label = toggle && $(".visually-hidden", toggle);
    if (label) label.textContent = toggle.getAttribute("aria-expanded") === "true" ? t("menu_close") : t("menu_open");
    syncTheme();

    store(STORAGE_LANG, lang);
  }

  function initLang() {
    captureGerman();
    $$(".lang-btn").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
    // ?lang=en / ?lang=tr in der URL hat Vorrang (praktisch für Links in Bewerbungen)
    var fromUrl = null;
    try { fromUrl = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    var initial = LANGS.indexOf(fromUrl) > -1 ? fromUrl : read(STORAGE_LANG);
    if (initial && initial !== "de") setLang(initial);
  }

  /* ---------- Einblenden beim Scrollen ---------- */
  function initReveal() {
    var introRunning = html.classList.contains("intro-on");
    var items = $$("[data-reveal]").filter(function (el) {
      // Hero-Elemente werden während des Intros vom Intro selbst eingeblendet
      return !(introRunning && el.closest(".hero"));
    });
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Aktiver Menüpunkt ---------- */
  function initActiveNav() {
    var links = $$(".nav-desktop a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-active"); });
        var link = map[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { io.observe(s); });
  }

  /* ---------- Endlos-Laufband (rechts nach links, stoppt bei Mausberührung) ---------- */
  function initMarquee(box) {
    var track = $(".marquee-track", box);
    if (!track) return;
    var originals = Array.prototype.slice.call(track.children);

    // Inhalte einmal duplizieren, damit die Schleife nahtlos läuft.
    // Kopien sind für Screenreader und Tastatur unsichtbar, per Maus aber klickbar (Großansicht).
    originals.forEach(function (li) {
      var clone = li.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("data-clone", "");
      $$("a, button, input, [tabindex]", clone).forEach(function (el) { el.setAttribute("tabindex", "-1"); });
      track.appendChild(clone);
    });

    var speed = parseFloat(box.getAttribute("data-speed")) || 35; // Pixel pro Sekunde

    function measure() {
      box.style.setProperty("--mw", box.clientWidth + "px");
      requestAnimationFrame(function () {
        var half = track.scrollWidth / 2;
        track.style.setProperty("--marquee-duration", Math.max(20, half / speed).toFixed(1) + "s");
      });
    }
    measure();
    window.addEventListener("resize", debounce(measure, 150));

    // Pause-Knopf (Barrierefreiheit + Touch-Geräte)
    var btn = box.id ? $('.marquee-toggle[aria-controls="' + box.id + '"]') : null;
    function setPaused(p) {
      box.classList.toggle("is-paused", p);
      if (btn) btn.setAttribute("aria-pressed", String(p));
    }
    if (btn) btn.addEventListener("click", function () { setPaused(!box.classList.contains("is-paused")); });

    // Auf Touch-Geräten (kein Hover) hält ein Tippen das Band an bzw. startet es wieder
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) {
      box.addEventListener("click", function (e) {
        if (e.target.closest && e.target.closest(".media-zoom")) return; // Bild antippen öffnet Großansicht
        setPaused(!box.classList.contains("is-paused"));
      });
    }
  }

  /* ---------- Großansicht (Netzplan, Screenshot) ---------- */
  function initLightbox() {
    var dlg = $("#lightbox");
    var canModal = dlg && typeof dlg.showModal === "function";
    var img = dlg && $(".lb-img", dlg);
    var cap = dlg && $(".lb-cap", dlg);
    var open = dlg && $(".lb-open", dlg);
    var openedByMouse = false;

    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".media-zoom");
      if (!btn) return;
      openedByMouse = e.detail > 0; // 0 = per Tastatur ausgelöst
      var src = btn.getAttribute("data-full");
      var thumb = $("img", btn);
      var text = thumb ? thumb.getAttribute("alt") : "";
      if (!canModal) { window.open(src, "_blank", "noopener"); return; }
      img.src = src;
      img.alt = text;
      cap.textContent = text;
      open.href = src;
      dlg.showModal();
    });

    if (!canModal) return;
    dlg.addEventListener("click", function (e) {
      // Klick neben das Bild oder auf "Schließen" schließt die Ansicht
      if (e.target === dlg || (e.target.closest && e.target.closest(".lb-close"))) dlg.close();
    });
    // Nach dem Schließen läuft das Laufband sofort weiter: Der Browser setzt den Fokus
    // zurück auf das Bild im Band, und Fokus hält das Band an. Bei Mausbedienung daher Fokus lösen.
    dlg.addEventListener("close", function () {
      if (!openedByMouse) return;
      setTimeout(function () {
        var a = document.activeElement;
        if (a && a.closest && a.closest(".marquee")) a.blur();
      }, 0);
    });
  }

  /* ---------- Kontaktformular (Formspree) ---------- */
  function initForm() {
    var form = $("#contact-form");
    if (!form) return;
    var status = $(".form-status", form);
    var btn = $("button[type=submit]", form);
    var lblSend = $(".btn-label", btn);
    var lblBusy = $(".btn-sending", btn);
    var email = $("#f-email", form);
    var msg = $("#f-message", form);
    var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(input, show) {
      input.setAttribute("aria-invalid", show ? "true" : "false");
      var err = document.getElementById(input.getAttribute("aria-describedby"));
      if (err) err.hidden = !show;
    }
    function setStatus(text, kind) {
      status.textContent = text;
      status.classList.toggle("is-ok", kind === "ok");
      status.classList.toggle("is-err", kind === "err");
    }
    function busy(on) {
      btn.disabled = on;
      lblSend.hidden = on;
      lblBusy.hidden = !on;
    }

    [email, msg].forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") setError(input, false);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var badEmail = !reEmail.test(email.value.trim());
      var badMsg = msg.value.trim().length < 2;
      setError(email, badEmail);
      setError(msg, badMsg);
      if (badEmail || badMsg) {
        setStatus(t("form_invalid"), "err");
        (badEmail ? email : msg).focus();
        return;
      }

      // Spam-Falle: echte Besucher füllen dieses Feld nie aus
      var hp = form.querySelector('[name="_gotcha"]');
      if (hp && hp.value) { form.reset(); setStatus(t("form_ok"), "ok"); return; }

      busy(true);
      setStatus("", null);
      var data = new FormData(form);
      data.append("_language", currentLang);

      fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          setStatus(t("form_ok"), "ok");
        })
        .catch(function () { setStatus(t("form_err"), "err"); })
        .then(function () { busy(false); });
    });
  }

  /* ---------- Start ---------- */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  initIntro();
  initHeader();
  initTheme();
  initMenu();
  initLang();
  $$(".marquee").forEach(initMarquee);
  initLightbox();
  initReveal();
  initActiveNav();
  initForm();
})();
