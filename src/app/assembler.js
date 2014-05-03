/*
 EMU-DIDE - Assembler module
 */

Assembler = (function() {
    'use strict';

    var pub = {}; //public symbols

    //DIDE instruction set, their format type, and opcode
    var DIDE_INSTRUCTIONS = {
        'ADD': {format: 1, opcode: 0x00}, 'ADDI': {format: 2, opcode: 0x00},
        'SUB': {format: 1, opcode: 0x01}, 'SUBI': {format: 2, opcode: 0x01},
        'CMP': {format: 1, opcode: 0x02}, 'CMPI': {format: 2, opcode: 0x02},
        'AND': {format: 1, opcode: 0x04}, 'ANDI': {format: 2, opcode: 0x04},
        'XOR': {format: 1, opcode: 0x05}, 'XORI': {format: 2, opcode: 0x05},
        'OR': {format: 1, opcode: 0x06},  'ORI': {format: 2, opcode: 0x06},
        'LUI': {format: 2, opcode: 0x07}, 'SLL': {format: 2, opcode: 0x08},
        'SAR': {format: 2, opcode: 0x09}, 'SLR': {format: 2, opcode: 0x0A},
        'LOAD': {format: 2, opcode: 0x10},'STORE': {format: 2, opcode: 0x11},
        'BE': {format: 3, opcode: 0x18},  'BGT': {format: 3, opcode: 0x19},
        'BLE': {format: 3, opcode: 0x1A}, 'BGTU': {format: 3, opcode: 0x1B},
        'BLEU': {format: 3, opcode: 0x1C},'BA': {format: 3, opcode: 0x1D},
        'BC': {format: 3, opcode: 0x1E},  'BO': {format: 3, opcode: 0x1F}
    };

    var ASSEMBLER_DIRECTIVES = ['BYTE', 'WORD', 'DEFINE'];
    var EXECUTABLE_SIZE = 19456; // In 32-bit word
    var REG_COUNT = 32;
    var SPACE_COMMA_SPLIT = /[\s,]+/;

    //Convert a register identifier to a number
    // like "R12" -> 12
    function parseReg(identifier) {
        return parseInt(identifier.slice(1));
    }

    //Parse the base + offset field for format type 2 instructions
    // Field is a string in the following format : "Offset(Rd)" or "Rd"
    // spit an object like that : { register : 2, offset : 4 }
    function parseBaseOffsetField(field) {
        var output = {register: undefined, offset: undefined};
        var parenPos = field.indexOf('(');

        if (parenPos === -1) {
            output.register = parseReg(field);
            output.offset = 0;
        } else {
            var offsetStr = field.substring(0, parenPos);
            var regStr = field.slice(parenPos, -1);
            output.offset = parseInt(offsetStr);
            output.register = parseReg(regStr);
        }

        return output;
    }


    //CodeEmitter object type 
    function CodeEmitter() {
        this.codeObj = new Uint32Array(EXECUTABLE_SIZE);
        this.cursor = 0;
    }

    //CodeEmitter methods
    CodeEmitter.prototype = {
        emitF1Instruction: function(opcode, regDest, regA, regB) {
            var word = 0;
            word |= (opcode  << 27);
            word |= (regDest << 21);
            word |= (regA    << 16);
            word |= (regB    << 11);
            this.codeObj[this.cursor] = word;
            this.cursor++;
        },
        emitF2Instruction: function(opcode, regDest, regA, imm) {
            var word = 0;
            word |= (opcode << 27);
            word |= (1 << 22);
            word |= (regDest << 21);
            word |= (regA    << 16);
            word |= imm;
            this.codeObj[this.cursor] = word;
            this.cursor++;            
        },
        emitF3Instruction: function(opcode, imm) {
           var word = 0;
           word |= (opcode << 27);
           word |= imm;
           this.codeObj[this.cursor] = word;
           this.cursor++;
        },
        emitWord: function(word) {
           this.codeObj[this.cursor] = word;
           this.cursor++;
        },
        getCodeObj: function() {
            return this.codeObj; 
        }
    };


    //Assemble a single line by manipulating the code
    //emitter 
    function assembleLine(emitter, line, index) {
        var tokens, 
            rDest,
            regA,
            regB;
        var colonPos = line.indexOf(':');

        if (colonPos !== -1) {
            //If there is label on the line, ignore it
            line = line.substr(colonPos + 1).trim();
        }

        if (!line) {
            return; //ignore empty lines
        }
        
        tokens = line.split(SPACE_COMMA_SPLIT);

        if (!_.has(DIDE_INSTRUCTIONS, tokens[0])) {
            throw new pub.AssemblerException(index + 1, 'Unknown instruction ' + tokens[0]);
        }
        
        switch (DIDE_INSTRUCTIONS[tokens[0]].format) {
            case 1: // dest , rega , regb
                rDest = parseReg(tokens[1]);
                regA  = parseReg(tokens[2]);
                regB  = parseReg(tokens[3]);
                
                if( rDest >= REG_COUNT || rDest < 0 || regA >= REG_COUNT || regA < 0 || 
                        regB >= REG_COUNT || regB < 0) {
                    throw new pub.AssemblerException(index + 1, 'invalid register index');
                }
                
                emitter.emitF1Instruction(
                        DIDE_INSTRUCTIONS[tokens[0]].opcode,
                        rDest,
                        regA,
                        regB);
                break;
            case 2: // dest, rega, imm
                rDest = parseReg(tokens[1]);
                var fieldData = parseBaseOffsetField(tokens[2]);
                
                if( rDest >= REG_COUNT || rDest < 0|| fieldData.register >= REG_COUNT ||
                        fieldData.register < 0) {
                    throw new pub.AssemblerException(index + 1, 'invalid register index');
                } 
                
                if(fieldData.offset > 0xFFFF || fieldData.offset < 0) {
                    throw new pub.AssemblerException(index + 1, 'invalid offset');
                }

                emitter.emitF2Instruction(
                        DIDE_INSTRUCTIONS[tokens[0]].opcode,
                        parseReg(tokens[1]),
                        fieldData.register,
                        fieldData.offset);
                break;
            case 3: // imm
                emitter.emitF3Instruction(
                        DIDE_INSTRUCTIONS[tokens[0]].opcode,
                        parseInt(tokens[1]));
                break;
            default:
                console.log('oops! Incorrect instruction format type');
                break;
        }
    }

    //add the found label on the given line
    //to the 'labels' object.  
    //index should be the line number.
    function getLabel(labels, line, index) {
        if (!line)
            return; //ignore empty line

        var colonPos = line.indexOf(':'),
                tokens;

        if (colonPos === -1)
            return; //no colon, no labels, ignore line

        tokens = line.substr(0, colonPos).split(' ');

        if (tokens.length > 2) {
            //more than 2 tokens means there
            //is a space somewhere. Labels shouldn't contain spaces.
            throw new pub.AssemblerException(index + 1, 'Invalid label');
        } else if (_.contains(DIDE_INSTRUCTIONS, tokens[0])) {
            //labels cannot use an instruction name
            throw new pub.AssemblerException(index + 1, 'Label cannot use an instruction name');
        }else if (labels.hasOwnProperty(tokens[0])) {
            throw new pub.AssemblerException(index + 1, "Multiple definitions of label " + tokens[0]);
        } else {
            Object.defineProperty(labels, tokens[0], {value: index});
        }
    }

    pub.AssemblerException = function(line, message) {
        this.value = line;
        this.message = message;
        this.toString = function() {
            return 'Assembly exception at line ' + this.value + ': ' + this.message;
        };
    };
 
    pub.assemble = function(sources) {
        //get an array of trimmed line, without comments
        var lines = _.map(sources.split('\n'), function(line) {
            var commentTokenPos = line.indexOf(';');
            if (commentTokenPos === -1)
                return line.trim();
            else
                return line.substr(0, commentTokenPos).trim();
        });

        var labels = {};
        var emitter = new CodeEmitter();
        //label lookup
        _.each(lines, _.partial(getLabel, labels, _));
        console.log(labels);
        //assembly phase
        _.each(lines, _.partial(assembleLine, emitter, _));
        
        console.log(emitter.getCodeObj());
    };

    return pub;
})();