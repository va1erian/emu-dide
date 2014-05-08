/*
   EMU-DIDE - UI management module
*/

UI = (function() {
    'use strict';
    var pub = {}, //public symbols
            editor;


    function markErroneousLine(lineNo) {
        editor.addLineClass(lineNo, 'background', 'erroneous-line');
    }
    
    function setStatusBarError(message) {
        $('#status-bar').html(message).addClass('error');
        setTimeout(function() { $('#status-bar').removeClass('error');}, 500);
    }
    
    function setStatusBarMessage(message) {
        $('#status-bar').html(message);
    }
    
    var toolbarClickBindings = {
        '#newTbBtn': function() {
            editor.setValue('\n');
        },
        '#runTbBtn': function() {
            try {
                Assembler.assemble(editor.getValue());
            } catch(e) {
                console.log(e);
                markErroneousLine(e.line);
                setStatusBarError(e.toString());
            }
        },
        '#debugTbBtn': function() {
            console.log('debug');
        },
        '#settingsTbBtn': function() {
            console.log('settings');
        }
    };

    pub.init = function() {
        editor = new CodeMirror(document.getElementById('main'), {
            value: "SLL R2, 4, R2 ; deplacement k<- k*4\n" +
                    "ADD R2, R2, R1 ; R2 <- @ v[k]\n" +
                    "LOAD R3, 0(R2) ; temp = R3 <- v[k]\n" +
                    "LOAD R4, 4(R2) ; R4 <- v[k+1]\n" +
                    "LOAD R4, 0(R2) ; v[k] <- R4\n" +
                    "STORE R3, 4(R2) ; v[k+1] <- temp\n",
            mode: 'javascript',
            lineNumbers: true
        });

        _.each(toolbarClickBindings, function(cb, id) {
            $(id).on('click', cb);
        });

        setStatusBarMessage("Welcome to EMU-DIDE");
    };

    pub.setStatusMessage = function(message) {
        
    };

         $(Emulator).bind('stateChange', function() { console.log('state changed');});
   };

   return pub;
})();
