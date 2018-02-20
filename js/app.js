// Smooth scrolling
// https://www.w3schools.com/bootstrap/bootstrap_ref_js_scrollspy.asp

// Add smooth scrolling on all links inside the navbar on desktop
$("#navbar a").on('click', function(event) {
    // Prevent default anchor click behavior
    event.preventDefault();

    // store offset from mobile navbar and collapse if expanded
    var offs
    if ( $('.navbar-toggler').is(':visible') && $('#navbarSupportedContent').is(':visible') ) {
        offs = $('#navbarSupportedContent').height();

        // collapse the menu on click
        $('.navbar-toggler').click();

    } else {
        offs = 0
    };

    // Store hash
    var hash = this.hash;

    // animate scroll
    if ( hash != "" ) {
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
    console.log(form.serialize())

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
                $('#rsvpSuccess').fadeIn();

                // freeze form & prevent multiple submissions
                $('#rsvpSubmit').attr('disabled', true);
                $('.form-control').each(function(){
                    $(this).attr('disabled', true);
                });
            },
            error: function(err) {
                $('#rsvpError').fadeIn();
            }
        });
    };
    $('#rsvpForm').addClass('was-validated');
});

