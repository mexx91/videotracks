
window.onload = function() {
    $('document').ready(function() {

        var showMetaData = true;

        //get the video element included in the website
        var video = $('video')[0];
        var videoElement = $(video);
        // get the dimensions of the video
        var videoElementWidth = videoElement.width();
        var videoElementHeight = videoElement.height();
        // build another container around the video for the overlay
        wrapTheVideo(videoElement, videoElementWidth, videoElementHeight);
        // create custom video controls so we can use the fullscreen api
        createVideoControls(video);
        ////////////////////////////////////////////////////////////////////////////
        // Wraps each video with another div to display the extra content
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
            // first hide the default controls
            if (video.hasAttribute("controls")) {
                video.removeAttribute("controls");
            }
            //then expand the videoMainWrapDiv to get space for the controlbar
            var vmw = $('.videoMainWrap');
            var vmwHeight = vmw.height();
            vmw.height(vmwHeight + 30);
            vmw.append("<div class='controlBar'>\n\
            <div class='statusBar'><div class='status'></div></div> \n\
            <div class='iconsBar'><i class='icon-play playPauseButton'></i>\n\
            <i class='icon-stop stopButton'></i>\n\
            <span class='time'></span>\n\
            <i class='icon-paperclip metaButton'></i>\n\
            <i class='icon-resize-full fullscreenButton'></i></div></div>");
        }

        $('.playPauseButton').click(function() {
            // check if the video is running or not
            if (video.paused) {
                // if not then start it and change the icon
                video.play();
                $(this).addClass('icon-pause');
                $(this).removeClass('icon-play');
            } else {
                // else pause it and change the icon
                video.pause();
                $(this).addClass('icon-play');
                $(this).removeClass('icon-pause');
            }
        });
        $('.stopButton').click(function() {
            video.currentTime = 0;
            $('.icon-pause').addClass('icon-play');
            $('.icon-play').removeClass('icon-pause');
            video.pause();
        });
        $('.metaButton').click(function() {
            // Enable and Disable the visibility of additional content
            showMetaData = !showMetaData;
        });
        $('.fullscreenButton').click(function() {
            //start fullscreen api
            toggleFullscreen();
        });

        function toggleFullscreen() {
            var element = $('.videoMainWrap')[0];

            if (document.webkitIsFullScreen || document.mozFullScreen || document.isFullscreen) {
                // then leave the fullscreen
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                // show the normal controlbar
                $('.controlBar').removeClass('scrollDown');
            } else {
                // enter fullscreen
                if (element.requestFullScreen) {
                    element.requestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                }
                // hide the controlbar in fullscreen
                $('.controlBar').addClass('scrollDown');
            }
        }

        // recognize every changes of fullscreen mode
        document.addEventListener("webkitfullscreenchange", function() {
            onFullscreenExit();
        }, false);

        document.addEventListener("mozfullscreenchange", function() {
            onFullscreenExit();
        }, false);

        function onFullscreenExit() {
            if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.isFullscreen) {
                $('.controlBar').removeClass('scrollDown');
            }
        }

        // Timecode in control bar
        video.addEventListener('loadedmetadata', function() {

        });
        function buildTimeline() {
            var duration = Math.round(video.duration);
            var currentTime = video.currentTime;
            var percentage = (currentTime / duration * 100).toFixed(2);
            $('.status').width(percentage + '%');
            $('.time').html(secondsToHMS(currentTime.toFixed(0)) + ' / ' + secondsToHMS(duration));
        }
        setInterval(buildTimeline, 200);
        // taken from: http://stackoverflow.com/questions/11792726/turn-seconds-into-hms-format-using-jquery
        function secondsToHMS(s) {
            var h = Math.floor(s / 3600); //Get whole hours
            s -= h * 3600;
            var m = Math.floor(s / 60); //Get remaining minutes
            s -= m * 60;
            if (h > 0) {
                return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
            } else {
                return (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds  
            }
        }


        //increase the height of the timeline by hovering the video
        $('.videoMainWrap').on('mouseenter', function() {
            var statusBar = $(this).find('.statusBar');
            statusBar.css({'top': '-3px', 'height': '8'});
        }).on('mouseleave', function() {
            var statusBar = $(this).find('.statusBar');
            statusBar.css({'top': '0', 'height': '5'});
        });
    });
};