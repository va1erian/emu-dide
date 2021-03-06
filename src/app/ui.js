/*
 EMU-DIDE - UI management module
 */

UI = (function() {
    'use strict';
    var pub = {}, //public symbols
            editor;

    var lastErroneousLine = 0;
    var lastExecutedLine = 0;

    var SIDE_PANE = {DEBUGGER: 0, LOGIN: 1, PROGRAMS: 2};
    var currentSidePane = SIDE_PANE.DEBUGGER;

    function markErroneousLine(lineNo) {
        lastErroneousLine = editor.getLineHandle(lineNo);
        editor.addLineClass(lastErroneousLine, 'background', 'erroneous-line');
    }

    function markExecutedLine(lineNo) {
        lastExecutedLine = editor.getLineHandle(lineNo);
        editor.addLineClass(lastExecutedLine, 'background', 'executed-line');
    }

    function clearErroneousLine() {
        editor.removeLineClass(lastErroneousLine, 'background', 'erroneous-line');
    }

    function clearExecutedLine() {
        editor.removeLineClass(lastExecutedLine, 'background', 'executed-line');
    }


//    function makeBreakpointMarker() {
//        var marker = document.createElement("div");
//        marker.style.color = "#822";
//        marker.innerHTML = "●";
//        return marker;
//    }

    function setStatusBarError(message) {
        $('#status-bar').html(message).addClass('error');
        setTimeout(function() {
            $('#status-bar').removeClass('error');
        }, 500);
    }

    function setStatusBarMessage(message) {
        $('#status-bar').html(message);
    }

    function switchSidePane(pane) {
        switch (pane) {
            case SIDE_PANE.DEBUGGER:
                $('#login-pane, #member-pane').fadeOut(500);
                currentSidePane = SIDE_PANE.DEBUGGER;

                if (ServerStorage.isLoggedIn()) {
                    $('#sidePaneBtn').text('Saved programs');
                } else {
                    $('#sidePaneBtn').text('Log in');
                }
                break;
            case SIDE_PANE.LOGIN:
                $('#login-pane').fadeIn(500);
                $('#sidePaneBtn').text('Debugger');
                currentSidePane = SIDE_PANE.LOGIN;
                break;
            case SIDE_PANE.PROGRAMS:
                $('#login-pane').fadeOut(500);
                $('#member-pane').fadeIn(500);
                $('#sidePaneBtn').text('Debugger');
                currentSidePane = SIDE_PANE.PROGRAMS;
                break;
        }

    }

    function updateUI() {
        switch (Emulator.getState()) {
            case Emulator.STATE.RUNNING:
                $('#runTbBtn').text('Pause');
                setStatusBarMessage('Emulator running...');
                break;
            case Emulator.STATE.HALTED:
                $('#runTbBtn').text('Run');
                setStatusBarMessage('Emulator halted.');
                break;
            case Emulator.STATE.PAUSED:
                $('#runTbBtn').text('Run');
                setStatusBarMessage('Emulator paused - PC = ' + Emulator.getProgramCounter());
                break;
        }
    }

    var toolbarClickBindings = {
        '#newTbBtn': function() {
            pub.setSources('\n');
        },
        '#assembleTbBtn': function() {
            clearErroneousLine();
            clearExecutedLine();
            try {
                var tmpProg = Assembler.assemble(editor.getValue());
                Emulator.reset();
                Emulator.loadProgram(tmpProg);
                setStatusBarMessage('Assembly phase succeeded, run the program.');
            } catch (e) {
                if (e instanceof Assembler.AssemblerException) {
                    markErroneousLine(e.line);
                    setStatusBarError(e.toString());
                } else {
                    setStatusBarError('Sorry, an error occured. Try again later :^)');
                    throw e;
                }
            }
        },
        '#runTbBtn': function() {
            clearExecutedLine();
            if( (Emulator.getState() === Emulator.STATE.PAUSED) ||
                (Emulator.getState() === Emulator.STATE.HALTED)) {
                Emulator.run();
            } else {
                Emulator.pause();   
            }
        },
        '#stepTbBtn': function() {
            Emulator.step();
            clearExecutedLine();
            var line = Assembler.addressToLine(Emulator.getProgramCounter());
            if (line !== -1) {
                markExecutedLine(line);
            } else {
                console.log('oops: failed to find instruction line for the given PC');
            }

        },
        '#saveTbBtn': function() {
            if(ServerStorage.isLoggedIn()) {
                var name = prompt('Please name your program.');
                ServerStorage.storeProgram(name, editor.getValue());
                
            } else {
                alert('You must be logged in to save your program');
            }
        },
        '#sidePaneBtn': function() {
            if (currentSidePane === SIDE_PANE.DEBUGGER) {
                if (ServerStorage.isLoggedIn()) {
                    switchSidePane(SIDE_PANE.PROGRAMS);
                }
                else {
                    switchSidePane(SIDE_PANE.LOGIN);
                }
            } else {
                switchSidePane(SIDE_PANE.DEBUGGER);
            }
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
            mode: 'dide',
            lineNumbers: true,
            gutters: ['CodeMirror-linenumbers', 'breakpoints']
        });

//        editor.on("gutterClick", function(cm, n) {
//            var info = cm.lineInfo(n);
//            if (info.gutterMarkers) {
//                cm.setGutterMarker(n, 'breakpoints', null);
//            } else {
//                cm.setGutterMarker(n, 'breakpoints', makeMarker());
//            }
//        });

        _.each(toolbarClickBindings, function(cb, id) {
            $(id).on('click', cb);
        });

        $(Emulator).on('stateChange', updateUI);

        setStatusBarMessage("Welcome to EMU-DIDE");
    };

    pub.getEditorBreakpoints = function() {
        var breakpoints = [];

        editor.eachLine(function(handle) {
            var lineInfo = editor.lineInfo(handle);
            if (lineInfo.gutterMarkers) {
                breakpoints.push(lineInfo.line);
            }
        });

        return breakpoints;
    };
    
    pub.setSources = function(sources) {
        Emulator.halt();
        Emulator.reset();
        console.log(sources);
        editor.setValue(sources);
        clearExecutedLine();
        clearErroneousLine();
    };

    pub.switchSidePane = switchSidePane;

    pub.SIDE_PANE = SIDE_PANE;

    return pub;
})();
