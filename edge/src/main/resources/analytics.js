;window.top.__s8 = function(b, h, f, k, l) {
  var z = b.screen || { width: 0, height: 0 };
  var g = [["url", b.location.href],["referrer", b.document.referrer],["p_x", z.width],["p_y", z.height]].reduce(function(c, a) {
    return 0 < a[1].length ? c + "&" + a[0] + "=" + encodeURIComponent(a[1]) : c;
  }, "").substr(1), e = function(c, a) {
    var d = new XMLHttpRequest;
    d.onreadystatechange = function() {
      4 === d.readyState && "function" === typeof a && a();
    };
    d.open("GET", h + "/e/" + c + ("" === g ? "" : "?" + g));
    d.send(null);
  };
  if (k && b.history.pushState) {
    var m = b.history.pushState;
    b.history.pushState = function(c, a, d) {
      m.apply(this, [c, a, d]);
      e(f);
    };
    b.addEventListener("popstate", function() {
      e(f);
    });
  }
  l && b.addEventListener("hashchange", function() {
    e(f);
  });
  e(f);
  return {t:e};
}(window, "$getSvr", "page-view", $spa, $hash);