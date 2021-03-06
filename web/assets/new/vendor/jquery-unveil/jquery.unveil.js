/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        srcAttrib = retina ? "data-src-retina" : "data-src",
        bgiAttrib = retina ? "data-bgi-retina" : "data-bgi",
        images = this,
        loaded;

    this.one("unveil", function() {
      if (!handleImg(this)) handleBgi(this);
    });

    function handleImg(el) {
      var source = el.getAttribute(srcAttrib);
      source = source || el.getAttribute("data-src");
      if (source) {
        el.setAttribute("src", source);
        if (typeof callback === "function") callback.call(el);
        return true;
      } else {
        return false;
      }
    }

    function handleBgi(el) {
      var source = el.getAttribute(bgiAttrib);
      source = source || el.getAttribute("data-bgi");
      if (source) {
        el.style.backgroundImage = "url(" + source + ")";
        if (typeof callback === "function") callback.call(el);
        return true;
      } else {
        return false;
      }
    }

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.scroll(unveil);
    $w.resize(unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
