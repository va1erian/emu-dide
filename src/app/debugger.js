/*
 EMU-DIDE - Debugger module
 */

Debugger = (function() {
    'use strict';

    var pub = {}; //public symbols

    var regViewTemplate; 



    function formatWord(word) {
        var u = word;
        if( u < 0) {
            u = 0xFFFFFFFF + u + 1;
        }
        
        return ('00000000' + u.toString(16).toUpperCase()).substr(-8);
    }
    
    
    function renderCPUViewer() {
        for(var i = 0; i < Emulator.REG_COUNT; i++) {            
            $('#reg-viewer-' + i).text('0x'+ formatWord(Emulator.readRegister(i)));
        }
        
        $('#pc-viewer').text('0x' + formatWord(Emulator.getProgramCounter()));  
        
        if(Emulator.getZeroFlag()) {
            $('#cpu-zero-flag-viewer').addClass('cpu-flag-viewer-active');
        } else {
            $('#cpu-zero-carry-viewer').removeClass('cpu-flag-viewer-active');
        }
    }
    
    function renderMemViewer() {
        var memDump = '';
        var mem = Emulator.readMem();
        for(var i = 0; i < ( Emulator.MEMORY_SIZE / 4); i++) {
            if( (i % 4) === 0 ) {
                memDump += '0x' + formatWord(i * 4) + ':';
            }
            memDump += formatWord(mem[i]) + ' ';
            
            if( ((i + 1) % 4) === 0) {
                memDump += '<br/>';
            }
        }
        
        $('#mem-viewer').html(memDump);
    }
    
    function regWriteCallback() {
        renderCPUViewer();
    }    
    
    function stateChangeCallback() {
        renderCPUViewer();
    }
    
    pub.init = function() {
        console.log($('#reg-viewer-tmpl').text());
        regViewTemplate = _.template($('#reg-viewer-tmpl').text());
        $('#cpu-viewer').append(regViewTemplate({regCount: Emulator.REG_COUNT}));
        
        $(Emulator).on('regWrite', regWriteCallback);
        $(Emulator).on('stateChange', stateChangeCallback);
    };

    return pub;
})();