/*
 EMU-DIDE - Emulator module
 */

Emulator = (function() {
    'use strict';

    var MEMORY_SIZE = 16384;
    var PROGRAM_OBJ_SIZE = 9216;
    var PROGRAM_OFFSET = 1024;
    var REG_COUNT = 32;
    var CPU_STATE = {
        HALTED: 0, RUNNING: 1, PAUSED: 2
    };

    var pub = {}; //public symbols

    var registers = new Array(REG_COUNT); // 32 registers of 32 bit
    var carryFlag, overflowFlag, signFlag, zeroFlag;
    var programCounter;

    var buffer;
    var memory;
    var frameBuffer;
    var state;


    var INSTRUCTIONS = {
        '0': { //ADD, ADDI
            f1: function(regD, regA, regB) {
                registers[regD] = doAddition(registers[regA],registers[regB]);
                $(pub).trigger('regWrite');
                programCounter += 4;
            },
            f2: function(regD, regA, imm) {
                registers[regD] = doAddition(registers[regA], imm);
                $(pub).trigger('regWrite');
                programCounter += 4;
            }
        },
        '1': { //SUB, SUBI
            f1: function(regD, regA, regB) {
                registers[regD] = doSubstraction(registers[regA],registers[regB]);
                $(pub).trigger('regWrite');
                programCounter += 4;
            },
            f2: function(regD, regA, imm) {
                registers[regD] = doSubstraction(registers[regA], imm);
                $(pub).trigger('regWrite');
                programCounter += 4;  
            }
        },
        '2': { //CMP, CMPI
            f1: function(regD, regA, regB) {
                doSubstraction(registers[regA], registers[regB]);
                programCounter += 4;                
            },
            f2: function(regD, regA, imm) {
                doSubstraction(registers[regA], imm);
                programCounter +=4;
            }
        },
        '4': { //AND, ANDI
            f1: function(regD, regA, regB) {
                registers[regD] = registers[regA] & registers[regB];
                $(pub).trigger('regWrite');
                programCounter += 4;
            },
            f2: function(regD, regA, imm) {
                registers[regD] = registers[regA] & imm;
                $(pub).trigger('regWrite');
                programCounter += 4;
            }
        },
        '5': { //XOR, XORI
            f1: function(regD, regA, regB) {
                registers[regD] = registers[regA] ^ registers[regB];
                $(pub).trigger('regWrite');
                programCounter += 4;
            },
            f2: function(regD, regA, imm) {
                registers[regD] = registers[regA] ^ imm;
                $(pub).trigger('regWrite');
                programCounter += 4;
            }
        },
        '6': { //OR, ORI
            f1: function(regD, regA, regB) {
                registers[regD] = registers[regA] | registers[regB];
                $(pub).trigger('regWrite');
                programCounter += 4;
            },
            f2: function(regD, regA, imm) {
                registers[regD] = registers[regA] | imm;
                $(pub).trigger('regWrite');
                programCounter += 4;
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
        '9': { // SAR
            f2: function(regD, regA, imm) {
                registers[regD] = registers[regA] >> imm;
                $(pub).trigger('regWrite');
                programCounter += 4;
            }           
        },
        'a': { // SLR
            f2: function(regD, regA, imm) {
                registers[regD] = registers[regA] >>> imm;
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
        },
        '18': { // BE
            f3: function(imm) {
                if(zeroFlag) {
                    programCounter += imm;
                } else {
                    programCounter += 4;
                }
            }
        },
        '19': { // BGT
            f3: function(imm) {
                if( (signFlag === overflowFlag) && !zeroFlag) {
                    programCounter += imm;
                } else {
                    programCounter += 4;
                }
            }
        },
        '1a': { //BLE
            f3: function(imm) {
                if((signFlag === overflowFlag) || zeroFlag) {
                    programCounter += imm;
                } else {
                    programcounter += 4;
                }
            }
        },
        '1b': { //BGTU
            f3: function(imm) {
                if(!carryFlag) {
                    programCounter += imm;
                } else {
                    programCounter += 4;
                }
            }
        },
        '1c': { //BLEU
            f3: function(imm) {
                if(carryFlag || zeroFlag) {
                    programCounter += imm;
                } else {
                    programCounter += 4;
                }
            }
        },
        '1d': { //BA
            f3: function(imm){
                programCounter += imm;
            }
        },
        '1e': { //BC
            f3: function(imm) {
                if(carryFlag) {
                    programCounter += imm;
                } else {
                    programCounter += 4;
                }
            }
        },
        '1f': { //BO
            f3: function(imm) {
                if(overflowFlag) {
                    programCounter += imm;
                } else {
                    programCounter += 4;
                }
            }
        }
    };
    
    
    //Perform a 32-bit addition and update the status flags accordingly
    function doAddition(x, y) {
        var result = x + y;
        
        if(result > 0xFFFFFFFF)  {// carry flag
            result -= 0xFFFFFFFF; //simulate 32-bit wrap
            carryFlag = true;
        } else {
            carryFlag = false;
        }
        
        setFlags(result);
        
        return result;
    }
    //Perform a 32-bit substraction and update the status flags accordingly
    function doSubstraction(x, y) {
        var result = x - y;
        
        if( result < -0xFFFFFFFF) {
            result =  (0xFFFFFFFF - (result + 2 * result)); // what? This is most likely wrong
            carryFlag = true;
        } else {
            carryFlag = false;
        }
        
        setFlags(result);
        
        return result;
    }
    
    //Set the CPU flag according to the given value EXCEPT the carry flag
    function setFlags(x) {
                
        if( x > 0x7FFFFFFF ) { //overflow Flag, this is probably wrong too
            overflowFlag = true;
        } else {
            overflowFlag = false;
        }
        
        if( (x >>> 31) === 1 ) { // sign flag
            signFlag = true;
        } else {
            signFlag = false;
        }
        
        if( x === 0 ) {
            zeroFlag = true; // zero flag
        } else {
            zeroFlag = false;
        }
    }

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
        if((instruction >>> 30) === 3){
            format = 3;
        }
        else if(((instruction & ~0xF8000000 ) >> 26) === 1){
            format = 2;
        } else{
            format = 1;
        }
        
        codop = instruction >>> 27; // discard sign
        
        if(format === 3) {
            imm = (instruction & ~0xF8000000);
            imm = imm << 5;
            imm = imm >> 5; //recreate sign bit, TODO more elegant solution ?
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

    //Execute the decoded instruction by dispatching it to the instruction handler
    function execute(decoded) { 
        var opcodeHash = decoded.codop.toString(16);
        
        if(!(opcodeHash in INSTRUCTIONS)) {
            console.log('Emulator error : Unrecognized opcode ', opcodeHash);
            pub.halt();
        }
        
        switch(decoded.format) {
            case 1:
                INSTRUCTIONS[opcodeHash].f1(decoded.rD, decoded.rA, decoded.rB);
                break;
            case 2:
                INSTRUCTIONS[opcodeHash].f2(decoded.rD, decoded.rA, decoded.imm);
                break;
            case 3:
                INSTRUCTIONS[opcodeHash].f3(decoded.imm);
                break;
        }
        
    }

    function cycle() {
        var instruction = fetch();
        var decoded = decode(instruction);
        execute(decoded);
    }
    
    function run() {
        cycle();
        cycle();
        cycle();
        cycle();

        if (state === CPU_STATE.RUNNING) {
            setTimeout(run, 0); // schedule next emulator 
        }
    }

    // reset the emulator
    pub.reset = function() {
        var i;
        for (i = 0; i < registers.length; i++) {
            registers[i] = 0;
        }
        programCounter = 0x0000400;
        overflowFlag = false;
        carryFlag    = false;
        zeroFlag     = false;
        signFlag     = false;

        buffer = new ArrayBuffer(MEMORY_SIZE);
        memory = new DataView(buffer);
        frameBuffer = new Uint16Array(buffer, 10240);
        state = CPU_STATE.HALTED;
    };

    pub.loadProgram = function(program) {
        for (var i = PROGRAM_OFFSET; i < (PROGRAM_OBJ_SIZE + PROGRAM_OFFSET); i += 4){
            writeWord(i, program[(i-PROGRAM_OFFSET)/4]);
        }
    };
    
    pub.run = function() {
        if (state !== CPU_STATE.RUNNING) {
            state = CPU_STATE.RUNNING;
            $(pub).trigger('stateChange');
            run();
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
        cycle();
        pub.pause();
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
        return frameBuffer;
    };
    
    pub.getCarryFlag = function() {
        return carryFlag;
    };
    
    pub.getOverflowFlag = function() {
        return overflowFlag;
    };
    
    pub.getZeroFlag = function() {
        return zeroFlag;
    };
    
    pub.getSignFlag = function() {
        return signFlag;
    };

    pub.getProgramCounter = function() {
        return programCounter;
    };
    
    pub.getState = function() {
        return state;
    };
    
    pub.peek = readWord;
    
    pub.poke = function(address, value) {
        writeWord(address, value);
        $(pub).trigger('memWrite');
    };


    pub.REG_COUNT = REG_COUNT;
    pub.MEMORY_SIZE  = MEMORY_SIZE;
    pub.STATE = CPU_STATE;
    
    return pub;
})();