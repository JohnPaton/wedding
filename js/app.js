// Smooth scrolling
// https://www.w3schools.com/bootstrap/bootstrap_ref_js_scrollspy.asp
// Add smooth scrolling on all links inside the navbar on desktop
$("#navbar a").on('click', function(event) {
    // Prevent default anchor click behavior
    event.preventDefault();

    // store offset from mobile navbar and collapse if expanded
    var offs
    if ( $('.collapse').is('.show') ) {
        offs = $('#navbarSupportedContent').height();

        // collapse the menu on click
        $('.collapse').collapse('hide');

    } else {
        offs = 0
    };

    // Store hash
    var hash = this.hash;

    // animate scroll
    if ( hash != "" ) {
        console.log('Scrolling to '+hash)
        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
          scrollTop: $(hash).offset().top - offs
        }, 500, function(){
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });
    };
});

// Maintain position when loading other language page
// Save the scroll position if clicking the language link
$(".lang-link").on('click', function(e){
    e.preventDefault();
    // store offset from mobile navbar (collapse may already be triggered so don't use collapse.is(show))
    var offs
    if ( $('.navbar-toggler').is(':visible') && $('#navbarSupportedContent').is(':visible') ) {
        offs = $('#navbarSupportedContent').height();
    } else {
        offs = 0
    };

    // store location if we are changing pages in sessionStorage
    if ( this.pathname != window.location.pathname ){
        console.log('Storing scroll position')
        sessionStorage.setItem('scrollPos', $(window).scrollTop() - offs);
        window.location.href = this.href;
    };
});
// If scrollPos in session storage (from other page), scroll there and clear it
$(document).ready(function(){
    scrollPos = sessionStorage.getItem('scrollPos')
    if ( scrollPos != null ){
        console.log('Scrolling to stored position '+scrollPos+' and clearing')
        $(window).scrollTop(scrollPos)
        sessionStorage.removeItem('scrollPos')
    };
});


// highlight language link for current page
$(".lang-link").each(function(){
    if ( this.pathname == window.location.pathname ){
        console.log('Highlighting lang-link '+this.innerHTML)
        $(this).addClass('text-light')
    };
});


// collapse mobile navbar if clicking off it
$('body').on('click', function(e){
    // check that:
    //    * navbar is expanded
    //    * we're on a small screen
    //    * the click was not on the navbar
    if ( $('.navbar-toggler').is(':visible')  && $('.collapse').is('.show')
         && ($(e.target).parents('#navbar').length == 0) ) {
        console.log('Click off navbar, collapsing')
        $('.collapse').collapse('hide')
    };
});

// Form Validation

// Require group size only if accepting invite
// https://stackoverflow.com/a/11967638
$('#rsvpStatus').change(function() {
    var opt = $('#rsvpStatus option:selected')[0].innerHTML;
    if (opt == "Regret") {
        console.log('Regret, disabling fields')
        $('#rsvpNumber').attr('required', false);
        $('#rsvpNumber').attr('disabled', true);
        $('#rsvpDiet').attr('disabled', true);

    } else {
        console.log('Accept, enabling fields')
        $('#rsvpNumber').attr('required', true);
        $('#rsvpNumber').attr('disabled', false);
        $('#rsvpDiet').attr('disabled', false);
    }
});


// Form validation and submission to Formspree
var form = $('#rsvpForm');
form.submit(function(event) {
    // prevent default submission behaviour
    event.preventDefault();
    event.stopPropagation();

    if (form[0].checkValidity() === false) {
      console.log('form invalid')
    } else {
        // submit to Formspree & h=show error/success message
        console.log('form valid, submitting')
        $.ajax({
            url: '//formspree.io/john@johnpaton.net',
            method: 'POST',
            data: form.serialize(),
            // dataType: 'json',
            // beforeSend: function() {
            //     $contactForm.append('<div class="alert alert--loading">Sending message…</div>');
            // },
            success: function(data) {
                // Show the message
                $('#rsvpSuccess').fadeIn();

                // freeze form & prevent multiple submissions
                $('#rsvpSubmit').attr('disabled', true);
                $('.form-control').each(function(){
                    $(this).attr('disabled', true);
                });
            },
            error: function(err) {
                // Show the message
                $('#rsvpError').fadeIn();
            }
        });
    };
    $('#rsvpForm').addClass('was-validated');
});
