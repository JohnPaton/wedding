////// Options

var underConstruction = false;
var rsvpDisabled = true;


////// Util functions

function mobileNavExpanded(){
    // Use this instead of $('.cover').is('.visible') since this is true even
    //     during the collapse animation. False on desktop screens.
    return ( $('.navbar-toggler').is(':visible') 
             && $('#navbarSupportedContent').is(':visible') );
};


function mobileNavOffset() {
    // Extra scroll position recorded due to mobile nav content being visible
    if ( mobileNavExpanded() ) {
        return $('#navbarSupportedContent').height();
    } else {
        return 0;
    };
};


function mobileNavCollapse() {
    // Close the mobile navbar if it's expanded
    if ( mobileNavExpanded() ) {
        $('.collapse').collapse('hide');
    };
};


function scrollToAnchor(hash, offset){
    // Smoothly scroll to an anchor on the page
    // See https://www.w3schools.com/bootstrap/bootstrap_ref_js_scrollspy.asp
    if ( hash != '' ) {
        console.log('Scrolling to ' + hash)
        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it 
        //    takes to scroll to the specified area
        $('html, body').animate({
          scrollTop: $(hash).offset().top - offset
        }, 
        500, 
        function(){
            // Add hash (#) to URL when done scrolling (default click behavior)
            // window.location.hash = hash;
        });
    };
};


////// Style adjustments

// highlight language link for current page
$(".lang-link").each(function(){
    if ( this.pathname == window.location.pathname ){
        console.log('Highlighting lang-link '+this.innerHTML)
        $(this).addClass('text-light')
    };
});

if (rsvpDisabled) {
    $('#rsvpSubmit').attr('disabled', true)
                    .after("<span class=\"text-danger\"> (disabled until the invites go out!)</span>");

};


////// Content insertions

// Under contruction message (option: underConstruction)
var constructionAlert = "<div class=\"alert alert-danger show mt-5\" role=\"alert\">"
    + "<strong>This page is still under construction.</strong> It may contain bugs and/or errors."
    + " Don't take the info seriously! </div>"
if (underConstruction) {
    $('.container-fluid .anchor').after(constructionAlert)
};


////// Functionality

// Smooth scrolling on all links in the navbar (including the brand)
$("#navbar a").on('click', function(event) {
    // Prevent default anchor click behavior
    event.preventDefault();

    // store offset from mobile navbar, collapse if expanded, and scroll to hash
    var offset = mobileNavOffset();
    mobileNavCollapse();
    scrollToAnchor(this.hash, offset)
});


// Maintain position when loading other language page
// Save the scroll position if clicking the language link
$(".lang-link").on('click', function(e){
    e.preventDefault();
    // store offset from mobile navbar
    var offs = mobileNavOffset();

    // store location if we are changing pages in sessionStorage
    if ( this.pathname != window.location.pathname ){
        console.log('Storing scroll position')
        sessionStorage.setItem('scrollPos', $(window).scrollTop() - offs);

        // load page for target language
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


////// Form Validation

// Require group size only if accepting invite
// https://stackoverflow.com/a/11967638
$('#rsvpStatus').change(function() {
    var selection = $('#rsvpStatus option:selected')[0].innerHTML;
    if ((selection == "Regret") || (selection == "Wij komen niet")) {
        console.log('Regret, disabling fields')
        $('#rsvpNumber').attr('required', false);
        $('#rsvpNumber').attr('disabled', true);
        $('#rsvpDiet').attr('disabled', true);

    } else {
        console.log('Accept, enabling fields')
        $('#rsvpNumber').attr('required', true);
        $('#rsvpNumber').attr('disabled', false);
        $('#rsvpDiet').attr('disabled', false);
    };
});


// Form validation (Bootstrap) and submission to Formspree
var form = $('#rsvpForm');
form.submit(function(event) {
    // prevent default submission behaviour
    event.preventDefault();
    event.stopPropagation();

    // Add validation styles
    form.addClass('was-validated');

    if (form[0].checkValidity() == false) {
        // wait for better input
        console.log('form invalid')
    } else {
        // submit to Formspree & show error/success message
        console.log('form valid, submitting')
        $.ajax({
            // url: '//formspree.io/john@johnpaton.net',
            url: '//formspree.io/patonkoning2018@gmail.com',
            method: 'POST',
            data: form.serialize(),  // url encoding
            // dataType: 'json',
            // beforeSend: function() {
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
            },
        });
    };
});
