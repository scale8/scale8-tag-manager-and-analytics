(function(a, g, c) {
  var f = [["preview", function() {
    var b = a.location.href.match(c + "=([a-zA-Z0-9]+)");
    if (null === b) {
      return a.localStorage.getItem(c) || "";
    }
    a.localStorage.setItem(c, b[1]);
    return b[1];
  }()], ["url", a.location.href], ["referrer", a.document.referrer], ].reduce(function(b, d) {
    return 0 < d[1].length ? b + "&" + d[0] + "=" + encodeURIComponent(d[1]) : b;
  }, "").substr(1), e = document.createElement("script");
  e.async = !0;
  e.src = g + "/tm-core.js" + ("" === f ? "" : "?" + f);
  a.document.getElementsByTagName("head")[0].appendChild(e);
})(window, "$getSvr", "s8prev");