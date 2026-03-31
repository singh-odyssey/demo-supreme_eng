(function () {
  var loader = document.getElementById("introLoader");
  var body = document.body;
  if (!loader || !body) return;

  var isMobile = window.matchMedia("(max-width: 760px)").matches;
  var MIN_VISIBLE_MS = isMobile ? 1100 : 1100;
  var FAILSAFE_MS = 7000;
  var HIDE_TRANSITION_MS = 700;
  var startedAt = performance.now();
  var dismissed = false;
  var failsafeTimer = null;

  function finishIntro() {
    if (dismissed) return;
    dismissed = true;

    body.classList.remove("intro-loading");
    loader.classList.add("is-hidden");

    window.setTimeout(function () {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, HIDE_TRANSITION_MS);

    if (failsafeTimer) {
      window.clearTimeout(failsafeTimer);
    }
  }

  function finishWhenReady() {
    var elapsed = performance.now() - startedAt;
    var remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    window.setTimeout(finishIntro, remaining);
  }

  if (document.readyState === "complete") {
    finishWhenReady();
  } else {
    window.addEventListener("load", finishWhenReady, { once: true });
  }

  failsafeTimer = window.setTimeout(finishIntro, FAILSAFE_MS);
})();
