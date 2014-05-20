/*
   EMU-DIDE - UI management module
*/

UI = (function() {
    'use strict';
    var pub = {}, //public symbols
            editor;

    var lastErroneousLine = 0;

    function markErroneousLine(lineNo) {
        lastErroneousLine = editor.getLineHandle(lineNo);
        editor.addLineClass(lastErroneousLine, 'background', 'erroneous-line');
    }
    
    function clearErroneousLine() {
        editor.removeLineClass(lastErroneousLine, 'background', 'erroneous-line');
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
        '#assembleTbBtn': function() {
            clearErroneousLine();
            try {
                var tmpProg = Assembler.assemble(editor.getValue());
                Emulator.loadProgram(tmpProg);
                setStatusBarMessage('Assembly phase succeeded, run the program.');
            } catch(e) {
                if(e instanceof Assembler.AssemblerException) {
                    markErroneousLine(e.line);
                    setStatusBarError(e.toString());
                } else {
                    setStatusBarError('Sorry, an error occured. Try again later :^)');
                    throw e;
                }
            }
        },
       
        '#runTbBtn': function() {
            console.log('run');
        },
        '#stepTbBtn': function() {
            Emulator.step();
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

   return pub;
})();
