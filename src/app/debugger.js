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
            $('#cpu-zero-flag-viewer').removeClass('cpu-flag-viewer-active');
        }
        
        if(Emulator.getCarryFlag()){
            $('#cpu-carry-flag-viewer').addClass('cpu-flag-viewer-active');
        } else {
            $('#cpu-carry-flag-viewer').removeClass('cpu-flag-viewer-active');
        }
        
        if(Emulator.getSignFlag()) {
            $('#cpu-sign-flag-viewer').addClass('cpu-flag-viewer-active');
        } else {
            $('#cpu-sign-flag-viewer').removeClass('cpu-flag-viewer-active');
        }
        
        if(Emulator.getOverflowFlag()) {
            $('#cpu-overflow-flag-viewer').addClass('cpu-flag-viewer-active');
        } else {
            $('#cpu-overflow-flag-viewer').removeClass('cpu-flag-viewer-active');
        }
    }
    
    function renderMemViewer() {
        var memDump = [];
        var mem = Emulator.readMem();
        for(var i = 0; i < ( Emulator.MEMORY_SIZE / 4); i++) {
            if( (i % 4) === 0 ) {
                memDump.push('0x');
                memDump.push(formatWord(i * 4));
                memDump.push(': ');
            }
            memDump.push(formatWord(mem[i]));
            
            if( ((i + 1) % 4) === 0) {
                memDump.push(' ');
            } else {
                memDump.push(' ');
            }
        }
        
        $('#mem-dump-content').text(memDump.join(''));
    }
    
    function memPeekBtnClick() {
        var addr = $('#peek-address-field').val();
        var offset = parseInt(addr, 16);
        $('#peek-result').text('0x' + formatWord(Emulator.peek(offset)));
    }
    
    function memPokeBtnClick() {
        var addr = $('#poke-address-field').val();
        var val  = $('#poke-value-field').val();
        Emulator.poke(parseInt(addr,16), parseInt(val, 16));
    }
    
    function memDumpBtnClick() {
        renderMemViewer();
        $('#mem-dump-pane').fadeIn(500);
    }
    
    function regWriteCallback() {
        //renderCPUViewer();
    }    
    
    function stateChangeCallback() {
        renderCPUViewer();
    }
    
    pub.init = function() {
        regViewTemplate = _.template($('#reg-viewer-tmpl').text());
        $('#cpu-viewer').append(regViewTemplate({regCount: Emulator.REG_COUNT}));
        
        $('#mem-peek-btn').click(memPeekBtnClick);
        $('#mem-poke-btn').click(memPokeBtnClick);
        $('#mem-dump-btn').click(memDumpBtnClick);
        $('#mem-dump-close').click(function() { 
            $('#mem-dump-content').empty();
            $('#mem-dump-pane').fadeOut(500);
        
        });
        
        $(Emulator).on('regWrite', regWriteCallback);
        $(Emulator).on('stateChange', stateChangeCallback);
    };

    return pub;
})();