////////////////////////////////////////////////////////////////////////////
// globals
////////////////////////////////////////////////////////////////////////////
var debug = true;
var printDebug = false;


window.onload = function() {

};

$('document').ready(function() {

    ////////////////////////////////////////////////////////////////////////////
    // Controll of debug information
    ////////////////////////////////////////////////////////////////////////////
    function log(msg) {
        if (debug) {
            console.log(msg);
        }
        if (printDebug) {
            $('#debug').append("<p>" + msg + "<p>");
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Reading the track
    ////////////////////////////////////////////////////////////////////////////

    // Array with all video elements on this site
    var videoArray = $('video');

    // For each of them loop through this function
    $.each(videoArray, function(i, video) {
        //get the video size to give the same size to the wrap
        var vw = $(video).width();
        var vh = $(video).height();
        //call the wrap function
        wrapTheVideoWithDiv(video, vw, vh);


        // Wait till the metadata of the video has been loaded, so that the
        // textTracks can be read. Else, it does not work!
        video.addEventListener("loadeddata", function() {
            // read the textTracks and get their cues

            var cues = video.textTracks[0].cues;

            $.each(cues, function(j, cue) {
                log(cue);
                // bind events for the entering cue
                cue.onenter = function() {
                    cueEntered(this, video, j);
                };

                // and also one event for leaving it
                cue.onexit = function() {
                    cueLeft(this, video, j);
                };

            });


        }, false);

    });

    ////////////////////////////////////////////////////////////////////////////
    // Wraps each video with another div to display the extra content
    ////////////////////////////////////////////////////////////////////////////
    function wrapTheVideoWithDiv(video, vw, vh) {
        // build a new div around the video element
        $(video).wrap('<div class="videoMainWrap" style="position: relative; display: block;" />');
        //set its size to the same as the video
        $('.videoMainWrap').width(vw);
        $('.videoMainWrap').height(vh);
        //set the video absolute to get the overlay effect
        $(video).css("position", "absolute");
    }


    ////////////////////////////////////////////////////////////////////////////
    // Cue events on Entering and leaving
    ////////////////////////////////////////////////////////////////////////////
    function cueEntered(cue, video, j) {
        log("Cue entered...");
        //Prepend the text inside the cue to the videoMainWrap of the video where
        // it belongs to. And wrap a div around with the unique cue id number (j)
        // so that we can delete it later on when we exit the cue timestamp
        $(video).parent().prepend('<div class="cue-item' + j + '" style="width:200px">' + cue.text + '</div>');
    }

    function cueLeft(cue, video, j) {
        log("Cue left...");
        // get the item which we want to delete
        // 'j' is important to remove the right element
        itemToDelete = $(video).parent().find('.cue-item' + j).fadeOut("slow");
    }

    ////////////////////////////////////////////////////////////////////////////
    // Change fullscreen behaviour
    ////////////////////////////////////////////////////////////////////////////
    document.addEventListener("webkitfullscreenchange", onFullscreenChange, false);

    function onFullscreenChange() {
        log(this);
        var element = $('.videoMainWrap')[0];
        element.webkitRequestFullScreen();
    }


});

