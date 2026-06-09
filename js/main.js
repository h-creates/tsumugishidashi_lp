/* =========================================================
   つむぎ仕出し LP  main.js
   ========================================================= */
(function () {
  "use strict";

  /* ----- ハンバーガー / ドロワー ----- */
  var hamburger = document.getElementById("hamburger");
  var drawer = document.getElementById("drawer");
  var overlay = document.getElementById("drawerOverlay");

  function openDrawer() {
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      if (drawer.classList.contains("is-open")) closeDrawer();
      else openDrawer();
    });
  }
  if (overlay) overlay.addEventListener("click", closeDrawer);

  var drawerClose = document.getElementById("drawerClose");
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);

  // ドロワー内リンクをタップしたら閉じる
  document.querySelectorAll(".js-drawer-link").forEach(function (link) {
    link.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  /* ----- ロゴクリックで確実にトップへ ----- */
  var logo = document.querySelector(".header__logo");
  if (logo) {
    logo.addEventListener("click", function (e) {
      e.preventDefault();
      closeDrawer();
      window.scrollTo({ top: 0, behavior: "smooth" });
      // アドレス末尾に残ったセクションのハッシュ（#menu など）を消す
      if (window.location.hash && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    });
  }

  /* ----- FAQ アコーディオン ----- */
  document.querySelectorAll(".faq-item__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var answer = item.querySelector(".faq-item__a");
      var isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      answer.style.maxHeight = isOpen ? answer.scrollHeight + "px" : null;
    });
  });

  // リサイズ時に開いているFAQの高さを再計算
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      document.querySelectorAll(".faq-item.is-open .faq-item__a").forEach(function (a) {
        a.style.maxHeight = a.scrollHeight + "px";
      });
    }, 150);
  });

  /* ----- スクロールイン演出 ----- */
  // .menu-card は横スクロールカルーセル内なので、縦方向のスクロール演出を付けると
  // スワイプ時にカードが上下に飛び出して見える。除外して常時表示にする。
  var targets = document.querySelectorAll(
    ".scene-card, .reason-card, .flow-step, .empathy__list li, .urgent__box, .area__table, .faq-item"
  );
  targets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- 固定CTA：FVを過ぎたら表示、トップに戻ったら隠す ----- */
  var fixedCta = document.querySelector(".fixed-cta");
  var fv = document.querySelector(".fv");
  if (fixedCta && fv && "IntersectionObserver" in window) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // FVが画面から完全に外れたら固定CTAを出す
          if (entry.isIntersecting) fixedCta.classList.remove("is-visible");
          else fixedCta.classList.add("is-visible");
        });
      },
      { threshold: 0 }
    );
    ctaObserver.observe(fv);
  } else if (fixedCta) {
    fixedCta.classList.add("is-visible");
  }
})();
