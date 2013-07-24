var debug = true;
var printDebug = true;

$('document').ready(function() {

    function log(msg) {
        if (debug) {
            console.log(msg);
        }
        if (printDebug) {
            $('#debug').append("<p>" + msg + "<p>");
        }
    }

});