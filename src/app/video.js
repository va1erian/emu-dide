/*
 EMU-DIDE - Video output module
 */

Video = (function() {

    var pub = {}; // public symbols

    var FRAME_WIDTH = 64;
    var FRAME_HEIGHT = 48;

    var c, ctx, img;

    function convertDwordToInt(nb) {

        var red = nb & 0x1F;
        red = Math.floor((red * 255) / 32);
        var green = (nb & 0x7E0) >> 5;
        green = Math.floor((green * 255) / 64);
        var blue = (nb & 0xF800) >> 11;
        blue = Math.floor((blue * 255) / 32);

        return new Array(red, green, blue);
    }

    pub.generateTestBuffer = function() {
        var memoireVideo = new Uint16Array(FRAME_WIDTH * FRAME_HEIGHT);

        for (var i = 0; i < FRAME_WIDTH * FRAME_HEIGHT; i++) {
            memoireVideo[i] = Math.floor(Math.random() * (65535));
        }
  
        return memoireVideo;
    };

    pub.init = function() {
        c = document.getElementById("video_canvas");        
        c.width = FRAME_WIDTH;
        c.height = FRAME_HEIGHT;
        ctx = c.getContext("2d");
        img = ctx.createImageData(FRAME_WIDTH, FRAME_HEIGHT);
        
        $(Emulator).on('memWrite', function() {
           pub.drawBuffer(Emulator.getFramebuffer()); 
        });
        
        pub.drawBuffer(Emulator.getFramebuffer());
    };

    pub.drawBuffer = function(buf) {
        
        var i = 0;
        for (var y = 0; y < FRAME_HEIGHT; y++) {
            for (var x = 0; x < FRAME_WIDTH; x++) {
                var pixel = convertDwordToInt(buf[i]);
                img.data[(i * 4)]   = pixel[0];
                img.data[(i * 4) + 1] = pixel[1];
                img.data[(i * 4) + 2] = pixel[2];
                img.data[(i * 4) + 3] = 255;
                i++;
            }
            //i++;
        }
        
        ctx.putImageData(img, 0, 0);  
    };

    return pub;
})();