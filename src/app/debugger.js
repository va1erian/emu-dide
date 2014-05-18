/*
 EMU-DIDE - Debugger module
 Made in 1 week 1 switch and 2000 compilation
 */

Debugger = (function() {
    'use strict';

    var REG_COUNT = 32;

    var pub = {}; //public symbols

    var regViewTemplate; 

    pub.init = function() {
        console.log($('#reg-viewer-tmpl').text());
        regViewTemplate = _.template($('#reg-viewer-tmpl').text());
        $('#reg-viewer').html(regViewTemplate({regCount: REG_COUNT}));
    };

    return pub;
})();