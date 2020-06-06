(function($) {
  "use strict"; // Start of use strict

  // Debugging mysterious elements with x-axis overflow
  // $(document).ready(function() {   
  //     var docWidth = document.documentElement.offsetWidth;

  //     [].forEach.call(
  //         document.querySelectorAll('*'),
  //         function(el) {
  //             if (el.offsetWidth > docWidth) {
  //                 console.log(el);
  //             }
  //         }
  //     );
  // });

  // Add scrollspy to <body>
  $('body').scrollspy({target: "#navbar", offset: 50}); 

  // Add smooth scrolling on all links inside the navbar
  $("#navbar a").click(function(event) {
      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
          // Prevent default anchor click behavior
          event.preventDefault();
          // Store hash
          var hash = this.hash;
          // Using jQuery's animate() method to add smooth page scroll
          // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
          $('html, body').animate({
              scrollTop: $(hash).offset().top
          }, 800, function() {  
              // Add hash (#) to URL when done scrolling (default click behavior)
              window.location.hash = hash;
          });
          $("#navbar").find(".active").removeClass("active");
          $(this).addClass("active");
      }  // End if
  });

  $(window).scroll(function() {
      if ($(document).scrollTop() > 50) {
          $('#navbar').addClass('shadow-lg');
      } else {
          $('#navbar').removeClass('shadow-lg');
      }
  });

  // Animations
  AOS.init({
    duration: 2000
  });

  // Contact Form
  $('#openInMailApp').click(function(event) {    
      var form = $('form');

      if (form[0].checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
      }
      else {
          var name = $('#name').val();
          var pronouns = $('#pronouns').val();
          var subject = $('#subject').val();
          var url = "mailto:allen.hansen64@gmail.com" 
              + "?subject=[AMEH - " + (subject === "" ? "Inquiry" : subject) + "]"
              + "&body=Hello,%0A%0A%0A%0ASincerely, %0A%0A"
              + name
              + "%0A"
              + pronouns;

          window.open(url, '_blank');
      }

      form.addClass('was-validated');
  });

  // Carousel settings
  // $('.carousel').carousel({
  //     interval: 2000
  // });

  // Toasts
  // $('.toast').toast('show');

  // Tooltips
  // $("body").tooltip({ 
  //     selector: '[data-toggle=tooltip]' 
  // });
})(jQuery); // End of use strict