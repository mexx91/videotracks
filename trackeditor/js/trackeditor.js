$(document).ready(function() {

    $("#fontsize-slider").slider({
        min: 10,
        max: 50,
        slide: function(event, ui) {
            $('#fontsize-input').val(ui.value);
        }
    });


    $('#colorSelector').ColorPicker({
        color: '#0000ff',
        onShow: function(colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function(colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function(hsb, hex, rgb) {
            $('#colorSelector div').css('backgroundColor', '#' + hex);
        }
    });

    $('#background-color').ColorPicker({
        color: '#0000ff',
        onShow: function(colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function(colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function(hsb, hex, rgb) {
            $('#background-color div').css('backgroundColor', '#' + hex);
        }
    });


    $('#createCue').click(function() {
        var text = $('#textarea').val();
        var textcolor = $('#colorSelector').children().css("background-color");
        var fontsize = $('#fontsize-input').val();
        var backgroundColor = $('#background-color').children().css("background-color");
        
        text = '<span style="color: ' + textcolor + '; font-size: ' + fontsize + 'px; background-color:' + backgroundColor + '">' + text + '</span>';

        var href = $('#href').val();
        if (href != '') {
            text = '<a target="_blank" href="' + href + '">' + text + '</a>';
        }

        console.log(text);

        $('#videowrap').append(text);
    });


});
