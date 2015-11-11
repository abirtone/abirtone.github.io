function load_common(){
    // Enable tooltip
    jQuery('[data-toggle="tooltip"]').tooltip().click(function(e) {
        jQuery(this).tooltip('toggle');
    });

    var val2 = "ac" + String.fromCharCode(116) + "o";
    var vai20 = "con" + String.fromCharCode(116);
    var emailHost = "abir" + String.fromCharCode(116) + "one." + "com";
    var arroba = String.fromCharCode(64)
    var contact = vai20 + val2 + arroba + emailHost;
    var mskoo_ = "<i class=\"glyphicon glyphicon-envelope\"></i> Correo: <a href=\"mailto:" + contact + "\" >" + contact + "</a>";
    $("#9971yhhs").html(mskoo_);

    var k91 = "647" + " 8";
    var _K9919 = "79" + " 925";
    var _ji1iiii = k91 + _K9919;
    var mskoo_ = "<i class=\"glyphicon glyphicon-phone\"></i> Teléfono: <a href=\"te" + "l:" + _ji1iiii + "\" >" + _ji1iiii + " <i class='glyphicon glyphicon-earphone'></i></a>";
    $('#_ksi82').html(mskoo_);

    // Enable modal images
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });
}

function set_contact(){
    var val2 = "ac" + String.fromCharCode(116) + "o";
    var vai20 = "con" + String.fromCharCode(116);
    var emailHost = "abir" + String.fromCharCode(116) + "one." + "com";
    var arroba = String.fromCharCode(64)
    var contact = vai20 + val2 + arroba + emailHost;
    var mskoo_ = "<a href=\"mailto:" + contact + "\" >" + contact + "</a>";
    $("#ks91ksk").html(mskoo_);
    $('#contact-form').attr('action', '//formspree.io/' + contact);
}

function set_alert_contact(){
    var val2 = "ificaciones" + "-formacion";
    var vai20 = "no" + String.fromCharCode(116);
    var emailHost = "abir" + String.fromCharCode(116) + "one." + "com";
    var arroba = String.fromCharCode(64)
    var contact = vai20 + val2 + arroba + emailHost;
    $('#contact-form').attr('action', '//formspree.io/' + contact);
}

function set_head_hunting_mail(){
    var val2 = "-" + "hunting";
    var vai20 = "head";
    var emailHost = "abir" + String.fromCharCode(116) + "one." + "com";
    var arroba = String.fromCharCode(64)
    var contact = vai20 + val2 + arroba + emailHost;
    $('#contact-form').attr('action', '//formspree.io/' + contact);
}

function set_bolsa_trabajo_mail(){
    var val2 = "-" + "trabajo";
    var vai20 = "bolsa";
    var emailHost = "abir" + String.fromCharCode(116) + "one." + "com";
    var arroba = String.fromCharCode(64)
    var contact = vai20 + val2 + arroba + emailHost;
    $('#contact-form').attr('action', '//formspree.io/' + contact);
}


function load_social () {
    $(window).load(function() {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.3";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
}