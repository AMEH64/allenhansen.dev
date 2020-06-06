// (function($) {
//   "use strict"; // Start of use strict

//   // Smooth scrolling using jQuery easing
//   $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
//     if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
//       var target = $(this.hash);
//       target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
//       if (target.length) {
//         $('html, body').animate({
//           scrollTop: (target.offset().top - 48)
//         }, 1000, "easeInOutExpo");
//         return false;
//       }
//     }
//   });

//   // Closes responsive menu when a scroll trigger link is clicked
//   $('.js-scroll-trigger').click(function() {
//     $('.navbar-collapse').collapse('hide');
//   });

//   // Activate scrollspy to add active class to navbar items on scroll
//   $('body').scrollspy({
//     target: '#mainNav',
//     offset: 54
//   });

//   // Collapse Navbar
//   var navbarCollapse = function() {
//     if ($("#mainNav").offset().top > 100) {
//       $("#mainNav").addClass("navbar-shrink");
//     } else {
//       $("#mainNav").removeClass("navbar-shrink");
//     }
//   };
//   // Collapse now if page is not at top
//   navbarCollapse();
//   // Collapse the navbar when page is scrolled
//   $(window).scroll(navbarCollapse);

//   var hasShown = false;
//   $(window).scroll(function() {
//     function elementScrolled(elem) {
//       var docViewTop = $(window).scrollTop();
//       var docViewBottom = docViewTop + $(window).height();
//       var elemTop = $(elem).offset().top + 300;
//       return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
//     }

//    if (elementScrolled("#skills") && !hasShown) { 
//       var delay = 500;
//       $(".progress-bar").each(function(i) {
//         $(this)//.delay(delay)
//         .animate({
//           width: $(this).attr('aria-valuenow') + '%'
//         }//, {duration: delay * 3}
//         , delay);
      
//         $(this).prop('Counter', 0).animate({
//           Counter: $(this).text()
//         }, {
//           duration: delay * 3,
//           // easing: 'swing',
//           step: function(now) {
//             $(this).text(Math.ceil(now) + '%');
//           }
//         });
//       });
//       hasShown = true;
//     }
//   });
// })(jQuery); // End of use strict

// // Theme-Selector
// $("#theme-toggle").click(function() {
//   if ($("body").hasClass("bg-light")) {
//       $("body").addClass("bg-dark").removeClass("bg-light"); 
//       $("#mainNav").addClass("bg-dark").removeClass("bg-light");
//       $("#mainNav").addClass("navbar-dark").removeClass("navbar-light");      
//       $("button:not(.navbar-toggler)").addClass("btn-outline-light").removeClass("btn-outline-dark"); 
//       $("#linkedIn-light").hide();
//       $("#linkedIn-dark").show();
//   }
//   else {
//       $("body").addClass("bg-light").removeClass("bg-dark"); 
//       $("#mainNav").addClass("bg-light").removeClass("bg-dark");
//       $("#mainNav").addClass("navbar-light").removeClass("navbar-dark");   
//       $("button:not(.navbar-toggler)").addClass("btn-outline-dark").removeClass("btn-outline-light");
//       $("#linkedIn-dark").hide();
//       $("#linkedIn-light").show();
//   }   
// });   

// BEGIN: Typer
var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { 
    delta /= 2; 
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('typewrite');
  for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = " ";
  document.body.appendChild(css);
};
// END: Typer