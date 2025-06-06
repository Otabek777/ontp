"use strict";

function pageNavigation() {
  var _this = this;

  var opened = [];
  var pages = ["strategy", "design", "development", "consulting"];

  if (document.location.hash) {
    var hash = document.location.hash;
    pages.forEach(function (item) {
      if (hash.indexOf(item) > -1) {
        change(item);
        return;
      }
    });
  }

  document.addEventListener('click', function (event) {
    var target = event.target;

    while (target != _this) {
      if (target.dataset && target.dataset.link) {
        change(target.dataset.link);
        return;
      } else {
        target = target.parentNode;
      }
    }
  });
  window.addEventListener('popstate', function (event) {
    if (event.state) {
      change(event.state.link, true);
    } else {
      change("main", true);
    }
  });

  function change(target) {
    var fromHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var targetID = "#" + target;

    if (target == 'main') {
      clear();

      if (!fromHistory) {
        history.pushState({
          link: target
        }, targetID, '/');
      }

      return;
    }

    opened.push({
      link: target
    });

    if (!fromHistory) {
      history.pushState({
        link: target
      }, targetID, targetID);
    }

    var page = document.querySelector(targetID);
    page.classList.remove('hidden');
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = getScrollWidth() + 'px';
  }

  function clear() {
    opened.forEach(function (item) {
      document.querySelector("#".concat(item.link)).classList.add('hidden');
    });
    opened = [];
    document.body.style.overflow = "";
    document.body.style.paddingRight = '';
  }

  return {
    getOpened: function getOpened() {
      return JSON.parse(JSON.stringify(opened));
    },
    clearOpened: function clearOpened() {
      history.pushState({
        link: "main"
      }, "#main", "/");
      clear();
    }
  };
}

var navigate = pageNavigation();

function mainNavigation() {
  document.addEventListener("click", function (event) {
    var target = event.target;

    while (target != this) {
      if (target.dataset && target.dataset.block) {
        var y = getCoords(document.getElementById(target.dataset.block)).top;
        var behavior = "smooth";

        if (navigate.getOpened().length > 0) {
          console.log(navigate.getOpened());
          navigate.clearOpened();
          behavior = "auto";
        }

        window.scroll({
          top: y,
          behavior: behavior
        });
        return;
      } else {
        target = target.parentNode;
      }
    }
  });
}

mainNavigation();

function getCoords(elem) {
  // (1)
  var box = elem.getBoundingClientRect();
  var body = document.body;
  var docEl = document.documentElement; // (2)

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft; // (3)

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0; // (4)

  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;
  return {
    top: top,
    left: left
  };
}

function otherProjects() {
  var slider = new Flickity(document.querySelector(".other-projects__track"), {
    cellAlign: "left",
    prevNextButtons: false
  });
  document.querySelector(".other-projects__button--prev").addEventListener("click", function () {
    slider.previous();
  });
  document.querySelector(".other-projects__button--next").addEventListener("click", function () {
    slider.next();
  });
}

otherProjects();

function getScrollWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

function headerMobile() {
  var header = document.querySelector(".header-mobile");
  var overlay = document.querySelector(".header-overlay");
  document.querySelector(".header-burger").addEventListener('click', function () {
    header.classList.toggle('header-mobile--opened');
    overlay.classList.toggle('header-overlay--hidden');
  });
}

headerMobile();

function fakeParallax(targets) {
  var height = document.body.clientHeight;
  var items = document.querySelectorAll(targets);
  items.forEach(function (item) {
    item.minSize = 540;
    var pos = item.getBoundingClientRect();

    if (pos.top > height) {
      item.size = item.minSize;
    } else {
      item.size = 645;
    }

    item.style.backgroundAttachment = "fixed";
    item.style.backgroundSize = "auto ".concat(item.size, "px");
  });
  var oldScroll = window.pageYOffset;
  document.addEventListener('scroll', function () {
    var newScroll = window.pageYOffset;
    items.forEach(function (item) {
      var pos = item.getBoundingClientRect();
      var isOut = pos.bottom < document.body.clientHeight;

      if (isOut) {
        item.style.backgroundAttachment = "";
      } else {
        item.style.backgroundAttachment = "fixed";
      }

      if (oldScroll < newScroll) {
        // Increment background size
        if (pos.top < document.body.clientHeight && !isOut) {
          item.size += 5;
        }
      } else {
        if (pos.bottom > document.body.clientHeight) {
          item.size -= 5;
        }
      }

      if (item.size > 740) {
        item.size = 740;
      }

      if (item.size < item.minSize) {
        item.size = item.minSize;
      }

      item.style.backgroundSize = "auto ".concat(item.size, "px");
    });
    oldScroll = newScroll;
  });
}

fakeParallax(".portfolio-item");