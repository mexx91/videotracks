window.onload = function() {

    // global variable to control if the additional content should be displayed
    var showMetaData = true;

    // get the included video in the website
    var video = $('video')[0];
    // get the element of it
    var videoElement = $(video);
    // get the dimensions of the video
    var videoElementWidth = videoElement.width();
    var videoElementHeight = videoElement.height();
    // build a new container around the video. It is needed for the overlay
    wrapTheVideo(videoElement, videoElementWidth, videoElementHeight);
    // create custom video controls so we can use the fullscreen api
    createVideoControls(video);

    ////////////////////////////////////////////////////////////////////////////
    // Wraps the video with another div to display the extra content
    ////////////////////////////////////////////////////////////////////////////
    function wrapTheVideo(videoElement, vw, vh) {
        // build a new div around the video element
        videoElement.wrap('<div class="videoMainWrap" style="position: relative; display: block;" />');
        //set its size to the same as the video
        $('.videoMainWrap').width(vw);
        $('.videoMainWrap').height(vh);
        //set the video absolute to get the overlay effect
        videoElement.css({"position": "absolute", "top": 0});
    }

    ////////////////////////////////////////////////////////////////////////////
    // Add the video controls and hide the default ones
    ////////////////////////////////////////////////////////////////////////////
    function createVideoControls(video) {
        // first hide the default controls if there any
        if (video.hasAttribute("controls")) {
            video.removeAttribute("controls");
        }
        //then expand the videoMainWrapDiv to get space for the controlbar
        // get the element
        var vmw = $('.videoMainWrap');
        // get its height
        var vmwHeight = vmw.height();
        // add 30px to its height to make space for the controlbar
        vmw.height(vmwHeight + 30);
        // append several container for the controls and statusbar
        vmw.append("<div class='controlBar'>\n\
            <div class='statusBar'><div class='status'></div></div> \n\
            <div class='iconsBar'><i class='icon-play playPauseButton'></i>\n\
            <i class='icon-stop stopButton'></i>\n\
            <span class='time'></span>\n\
            <i class='icon-paperclip metaButton'></i>\n\
            <i class='icon-resize-full fullscreenButton'></i></div></div>");
    }

    // when the play/pause button is clicked
    $('.playPauseButton').click(function() {
        // check if the video is running or not
        if (video.paused) {
            // if not then start it
            video.play();
            // and change the icon
            $(this).addClass('icon-pause');
            $(this).removeClass('icon-play');
        } else {
            // else pause it
            video.pause();
            // and change the icon
            $(this).addClass('icon-play');
            $(this).removeClass('icon-pause');
        }
    });

    // when the stop button is clicked
    $('.stopButton').click(function() {
        // set the video to the start
        video.currentTime = 0;
        // show the play button
        $('.icon-pause').addClass('icon-play');
        $('.icon-play').removeClass('icon-pause');
        // pause the video
        video.pause();
    });

    // when the additional content is turned of by the user
    $('.metaButton').click(function() {
        // invert the variable for the visibility of additional content
        showMetaData = !showMetaData;
        // add a class to the icon to change its color to display its status
        $(this).toggleClass('inactive');
        // remove all cue items
        if (!showMetaData) {
            $('.cue-item').remove();
        }
    });

    $('.fullscreenButton').click(function() {
        //start fullscreen api
        toggleFullscreen();
    });

    function toggleFullscreen() {
        // select the videoMainWrap as fullscreen element
        var element = $('.videoMainWrap')[0];

        // if fullscreen mode is already active
        if (document.webkitIsFullScreen || document.mozFullScreen || document.isFullscreen) {
            // then leave the fullscreen mode
            if (document.cancelFullscreen) {
                document.cancelFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            // show the normal controlbar
            $('.controlBar').removeClass('scrollDown');
        } else {
            // enter the fullscreen mode
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
            /* hide the controlbar in fullscreen mode, it can be displayed when
             * the mouse hovers the statusbar due to css */
            $('.controlBar').addClass('scrollDown');
        }
    }

    // recognize every changes of fullscreen mode -> webkit method
    document.addEventListener("webkitfullscreenchange", function() {
        onFullscreenExit();
    }, false);

    // recognize every changes of fullscreen mode -> mozilla method
    document.addEventListener("mozfullscreenchange", function() {
        onFullscreenExit();
    }, false);

    function onFullscreenExit() {
        // check the fullscreen mode was turned from on to off
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.isFullscreen) {
            /* then remove the class 'scrolldown' from the statusbar
             * so that is is displayed normally again and not half hidden */
            $('.controlBar').removeClass('scrollDown');
        }
    }

    // when the statusbar is clicked
    $('.statusBar').click(function(e) {
        // get the offset of the element
        var parentOffset = $(this).parent().offset();
        // calculate the current mouse position relative to the element offset
        var mousePosX = e.pageX - parentOffset.left;
        var width = $(this).width();
        // calc the percentage of the position
        var percentage = mousePosX / width * 100;
        // round it
        percentage = percentage.toFixed(2);
        // jump to the calculatet time
        var jumpToTime = video.duration * percentage / 100;
        video.currentTime = jumpToTime.toFixed(2);
    });

    function buildTimeline() {
        // get the duration of the video
        var duration = Math.round(video.duration);
        // and the current time
        var currentTime = video.currentTime;
        // then calculate the percentage of progress
        var percentage = (currentTime / duration * 100).toFixed(2);
        // set the width of the statusbar to display the progress graphically
        $('.status').width(percentage + '%');
        // display the time values in a readable format
        $('.time').html(secondsToHMS(currentTime.toFixed(0)) + ' / ' + secondsToHMS(duration));
    }
    setInterval(buildTimeline, 200);
    // taken from: http://stackoverflow.com/questions/11792726/turn-seconds-into-hms-format-using-jquery
    function secondsToHMS(s) {
        // get the whole hours
        var h = Math.floor(s / 3600);
        s -= h * 3600;
        // get the remaining minutes
        var m = Math.floor(s / 60);
        s -= m * 60;
        // check if it is neccessary to show the hours
        if (h > 0) {
            //zero padding on minutes and seconds
            return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
        } else {
            //zero padding on minutes and seconds
            return (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
        }
    }

    //increase the height of the timeline by hovering the video
    $('.videoMainWrap').on('mouseenter', function() {
        var statusBar = $(this).find('.statusBar');
        statusBar.css({'top': '-4px', 'height': '9'});
    }).on('mouseleave', function() {
        var statusBar = $(this).find('.statusBar');
        statusBar.css({'top': '0', 'height': '5'});
    });

    ////////////////////////////////////////////////////////////////////////////
    // Reading the cues
    ////////////////////////////////////////////////////////////////////////////

    // get the textTracks and their cues
    var cues = video.textTracks[0].cues;

    // for each cue
    $.each(cues, function(j, cue) {
        console.log(cue);
        // bind events for entering the cue
        cue.onenter = function() {
            cueEntered(this, video, j);
        };

        // and also a event by leaving it
        cue.onexit = function() {
            cueLeft(this, video, j);
        };
    });

    ////////////////////////////////////////////////////////////////////////////
    // Cue events on Entering and leaving
    ////////////////////////////////////////////////////////////////////////////
    function cueEntered(cue, video, j) {
        /* prepend the text inside the cue to the videoMainWrap of the video where
         * it belongs to. And wrap a div around with the unique cue id number (j)
         * so that we can delete it later on when we exit the cue timestamp */
        if (showMetaData) {
            $(video).parent().prepend('<span class="cue-item-wrap itemId' + j + '">' + cue.text + '</span>');
        }
    }

    function cueLeft(cue, video, j) {
        // get the item which we want to delete
        $(video).parent().find('.itemId' + j).remove();
    }
};
