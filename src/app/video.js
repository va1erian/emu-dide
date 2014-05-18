/*
 EMU-DIDE - Video output module
 */

Video = (function() {

    var pub = {}; // public symbols

    var MYWIDTH = 128 * 2;
    var MYLENGTH = 96 * 2;

    var c, ctx;

    function convertDwordToInt(nb) {

        var red = nb & 0x1f;
        red = Math.floor((red * 255) / 32);
        var green = (nb & 0x7e0) >> 5;
        green = Math.floor((green * 255) / 64);
        var blue = (nb & 0xf800) >> 11;
        blue = Math.floor((blue * 255) / 32);

        return new Array(red, green, blue);
    }

    pub.generateTestBuffer = function() {
        var memoireVideo = new Uint16Array(MYWIDTH * MYLENGTH);

        for (var i = 0; i < MYWIDTH * MYLENGTH; i++) {
            memoireVideo[i] = Math.floor(Math.random() * (65535));
        }
  
        return memoireVideo;
    };

    pub.init = function() {
        c = document.getElementById("video_canvas");        
        c.width = MYWIDTH;
        c.height = MYLENGTH;
        ctx = c.getContext("2d");
    };

    pub.drawBuffer = function(buf) {
        var memoireVideo = buf;

        var i = 0;
        for (var x = 0; x < MYWIDTH; x = x + 2) {
            for (var y = 0; y < MYLENGTH; y = y + 2) {
                var pixel = convertDwordToInt(memoireVideo[i]);
                ctx.fillStyle = "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
                //maChaine += "=> " + x + ":" + y + " \n";
                ctx.fillRect(x, y, 2, 2);
                i++;
            }
            i++;
        }
    };

    return pub;
})();