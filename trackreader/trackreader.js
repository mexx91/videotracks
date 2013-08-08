////////////////////////////////////////////////////////////////////////////
// globals
////////////////////////////////////////////////////////////////////////////
var debug = true;
var printDebug = false;
var element;
var currenttime;
var duration;


$('document').ready(function() {
    window.onload = function() {

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
            $('.videoMainWrap').height(vh + 30);
            //set the video absolute to get the overlay effect
            $(video).css("position", "absolute");

            element = $('.videoMainWrap')[0];
        }

        duration = $('video')[0].duration;


        ////////////////////////////////////////////////////////////////////////////
        // Cue events on Entering and leaving
        ////////////////////////////////////////////////////////////////////////////
        function cueEntered(cue, video, j) {
            log("Cue entered...");
            //Prepend the text inside the cue to the videoMainWrap of the video where
            // it belongs to. And wrap a div around with the unique cue id number (j)
            // so that we can delete it later on when we exit the cue timestamp
            $(video).parent().prepend('<div class="cue-item cue-item' + j + '">' + cue.text + '</div>');
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


        }


        ////////////////////////////////////////////////////////////////////////////
        // Player Options
        ////////////////////////////////////////////////////////////////////////////

        function makeControls() {

            var progressbar = '<div class="progressbar"><span class="progress"></span></div>';
            var playPause = '<div class="playPause controlIcon"></div>';
            var stop = '<div class="stop controlIcon"></div>';
            var fullscreen = '<div class="fullscreen controlIcon"></div>';
            var icons = playPause + stop + fullscreen;

            var controls = progressbar + '<div class="controlbar">' + icons + '</div>';
            $('.videoMainWrap').append(controls);
        }
        makeControls();

        // if the play / pause button is clicked:
        $('.playPause').click(function() {
            // get the parent video of the clicked controls
            var video = $(this).parent().parent().find('video');
            video = $(video)[0];
            playPauseVideo(video);
        });

        $('.stop').click(function() {
            // get the parent video of the clicked controls
            var video = $(this).parent().parent().find('video');
            video = $(video)[0];
            stopVideo(video);
        });

        $('.fullscreen').click(function() {
            // get the parent video of the clicked controls
            var wrap = $(this).parent().parent();
            wrap = $(wrap)[0];
            toggleFullscreen(wrap);
        });

        function playPauseVideo(video) {
            // check if the video is currentyl running or not
            if (video.paused) {
                // if it is paused then start playing
                video.play();
            } else {
                // if it is playing then pause it
                video.pause();
            }
        }

        function stopVideo(video) {
            video.currentTime = 0;
            video.pause();
            $('.progressbar .progress').width(0);
        }


        function toggleFullscreen(wrap) {
            enterFullscreen(wrap)
        }

        function enterFullscreen(element) {
            if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
        }

        setInterval(function() {
            var video = $('video')[0];
            if (!video.paused) {
                currenttime = video.currentTime;
                $('.progressbar').find('span').width(((currenttime / duration) * 100).toFixed(2) + '%');
                log(((currenttime / duration) * 100).toFixed(2) + '%');
            }
        }, 150);


    };
});

