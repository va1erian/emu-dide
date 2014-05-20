/*
 EMU-DIDE - Emulator module
 */

Emulator = (function() {
    'use strict';

    var MEMORY_SIZE = 32768 * 4;
    var PROGRAM_OBJ_SIZE = 77824;
    var PROGRAM_OFFSET = 4096;
    var REG_COUNT = 32;
    var CPU_STATE = {
        HALTED: 0, RUNNING: 1, PAUSED: 2
    };

    var pub = {}; //public symbols

    var registers = new Array(REG_COUNT); // 32 registers of 32 bit
    var statusRegister;
    var programCounter;

    var buffer = new ArrayBuffer(MEMORY_SIZE);
    var memory = new DataView(buffer);

    var state;


    var INSTRUCTIONS = {
        '0': { //ADD, ADDI
            f1: function(regD, regA, regB) {
                registers[regD] = registers[regA] + registers[regB];
                $(pub).trigger('regWrite');
                programCounter += 4;
            },
            f2: function(regD, regA, imm) {
                
            }
        },
        '1': { //SUB, SUBI
            f1: function(regD, regA, regB) {
                
            },
            f2: function(regD, regA, imm) {
                
            }
        },
        '2': { //CMP, CMPI
            f1: function(regD, regA, regB) {
                
            },
            f2: function(regD, regA, imm) {
                
            }
        },
        '4': { //AND, ANDI
            f1: function(regD, regA, regB) {
                
            },
            f2: function(regD, regA, imm) {
                
            }
        },
        '5': { //XOR, XORI
            f1: function(regD, regA, regB) {
                
            },
            f2: function(regD, regA, imm) {
                
            }
        },
        '6': { //OR, ORI
            f1: function(regD, regA, regB) {
                
            },
            f2: function(regD, regA, imm) {
                
            }            
        },
        '7': { // LUI
            f2: function(regD, regA, imm) {
                registers[regD] = imm << 16;
                $(pub).trigger('regWrite');
                programCounter += 4;
            }
        },
        '8': { // SLL
            f2: function(regD, regA, imm) {
                registers[regD] = registers[regA] << imm;
                $(pub).trigger('regWrite');
                programCounter += 4;
            }
        },
        
        '10': { //LOAD
            f2: function(regD, regA, imm) {
                registers[regD] = readWord(registers[regA] + imm);
                $(pub).trigger('regWrite');
                programCounter += 4;
            }
        },
        '11': { // STORE
            f2: function(regD, regA, imm) {
                writeWord(registers[regD] + imm, registers[regA]);
                $(pub).trigger('memWrite', [registers[regD] + imm]);
                programCounter += 4;
            }
        }
        //TODO other instructions
    };


    function readWord(offset) {
        return memory.getUint32(offset, true);
    }
    
    function writeWord(offset, word) {
        memory.setUint32(offset, word, true);
    }
    
    function fetch() {
        return readWord(programCounter);
    }

    function decode(instruction) {
        var format, codop, rD, rA, rB, imm;
        
        /*Check the first 2 bits*/
        if((instruction >> 30) === 3){
            format = 3;
        }
        else if(((instruction & ~0xF8000000 ) >> 26) === 1){
            format = 2;
        } else{
            format = 1;
        }
        
        codop = instruction >>> 27; // We don't care about the sign
        
        if(format === 3) {
            imm = (instruction & ~0xF8000000);
        } else {
            rD = (instruction & ~0xFC000000 ) >> 21;
            rA = (instruction & ~0xFFE00000 ) >> 16; 
            if(format === 1) {
                rB = (instruction & ~0xFFFF0000 ) >> 11;
            } else {
                imm = (instruction & ~0xFFFF0000);
            }
        }
        
        return { 'codop' : codop, 'rD' : rD,
                 'rA' : rA, 'rB' : rB, 'imm' : imm,
                 'format' : format};
    }

    function execute(decoded) { 
        console.log(decoded);
        var opcodeHash = decoded.codop.toString(16);
        
        if(!(opcodeHash in INSTRUCTIONS)) {
            console.log('Emulator error : Unrecognized opcode ', opcodeHash);
        }
        
        switch(decoded.format) {
            case 1:
                INSTRUCTIONS[opcodeHash].f1(decoded.rD, decoded.rA, decoded.rB);
                break;
            case 2:
                INSTRUCTIONS[opcodeHash].f2(decoded.rD, decoded.rA, decoded.imm);
                break;
        }
        
        console.log(registers);
        console.log(programCounter);
    }

    function cycle() {
        var instruction = fetch();
        var decoded = decode(instruction);
        execute(decoded);

        Video.drawBuffer(pub.getFramebuffer());
        if (state === CPU_STATE.RUNNING) {
            setTimeout(cycle, 0); // schedule next cycle
        }
    }

    // reset the emulator
    pub.reset = function() {
        var i;
        for (i = 0; i < registers.length; i++) {
            registers[i] = 0;
        }
        programCounter = 0x00001000;
        statusRegister = 0;

        for (i = 0; i < memory.length; i++) {
            memory[i] = 0;
        }
        state = CPU_STATE.HALTED;
    };

    // TODO : Copie du programme depuis l'assembleur puis recopie dans la mémoire

    pub.loadProgram = function(program) {
        for (var i = PROGRAM_OFFSET; i < (PROGRAM_OBJ_SIZE + PROGRAM_OFFSET); i = i + 4){
            writeWord(i, program[(i-PROGRAM_OFFSET)/4]);
        }
    };
    
    pub.run = function() {
        if (state !== CPU_STATE.RUNNING) {
            state = CPU_STATE.RUNNING;
            $(pub).trigger('stateChange');
            cycle();
        }
    };

    pub.halt = function() {
        state = CPU_STATE.HALTED;
        $(pub).trigger('stateChange');
    };

    pub.pause = function() {
        state = CPU_STATE.PAUSED;
        $(pub).trigger('stateChange');
    };

    pub.step = function() {
        pub.pause();
        cycle();
    };

    //reg is the register id, 0-31
    pub.readRegister = function(reg) {
        return registers[reg]; //TODO: error checking or reg
    };


    //reg is the register id, 0-31
    pub.writeRegister = function(reg, value) {
        registers[reg] = value; //TODO: Error checking
        $(pub).trigger('regWrite');
    };
    
    // return a slice of the main memory as a typed array
    pub.readMem = function() {
      return new Uint32Array(buffer);
    };
    
    pub.getFramebuffer = function() {
        return new Uint16Array(buffer, 106496);
    };
    
    pub.peek = readWord;
    
    pub.poke = writeWord;


    pub.REG_COUNT = REG_COUNT;
    pub.MEMORY_SIZE  = MEMORY_SIZE;
    
    return pub;
})();