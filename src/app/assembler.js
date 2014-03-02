/*
   EMU-DIDE - Assembler module
*/

Assembler = (function() {
   'use strict';

   var pub = {}; //public symbols

   //DIDE instruction set, their format type, and opcode
   var DIDE_INSTRUCTIONS = {
       'ADD' : {format: 1, opcode: 0x00}, 'ADDI' : {format: 2, opcode: 0x00},
       'SUB' : {format: 1, opcode: 0x01}, 'SUBI' : {format: 2, opcode: 0x01},
       'CMP' : {format: 1, opcode: 0x02}, 'CMPI' : {format: 2, opcode: 0x02},
       'AND' : {format: 1, opcode: 0x04}, 'ANDI' : {format: 2, opcode: 0x04},
       'XOR' : {format: 1, opcode: 0x05}, 'XORI' : {format: 2, opcode: 0x05},
       'OR'  : {format: 1, opcode: 0x06}, 'ORI'  : {format: 2, opcode: 0x06},
       'LUI' : {format: 2, opcode: 0x07}, 'SLL'  : {format: 2, opcode: 0x08},
       'SAR' : {format: 2, opcode: 0x09}, 'SLR'  : {format: 2, opcode: 0x0A},
       'LOAD': {format: 2, opcode: 0x10}, 'STORE': {format: 2, opcode: 0x11},
       'BE'  : {format: 3, opcode: 0x18}, 'BGT'  : {format: 3, opcode: 0x19},
       'BLE' : {format: 3, opcode: 0x1A}, 'BGTU' : {format: 3, opcode: 0x1B},
       'BLEU': {format: 3, opcode: 0x1C}, 'BA'   : {format: 3, opcode: 0x1D},
       'BC'  : {format: 3, opcode: 0x1E}, 'BO'   : {format: 3, opcode: 0x1F}
      };

   var ASSEMBLER_DIRECTIVES = ['BYTE', 'WORD', 'DEFINE'];
   
   //CodeEmitter object type 
   function CodeEmitter() {

   }

   //CodeEmitter methods
   CodeEmitter.prototype = {
      emitF1Instruction: function(opcode, regDest, regA, regB){

      },
      emitF2Instruction: function(opcode, regDest, regA, imm){

      },
      emitF3Instruction: function(opcode, imm){

      },
      emitWord: function(word){

      },
      getObject: function() {
         
      }
   };


   //Assemble a single line by manipulating the code
   //emitter (TODO!)
   function assembleLine(line, index) {
      var tokens;
      var colonPos = line.indexOf(':');

      if(colonPos != -1) {
         //If there is label on the line, ignore it
         line = line.substr(colonPos + 1).trim();
      }

      if (!line) 
         return; //ignore empty lines

      tokens = line.split(' ');

      if(!_.has(DIDE_INSTRUCTIONS, tokens[0]))
         throw new pub.AssemblerException(index + 1, 
            'Unknown instruction ' + tokens[0]);
      else {
         console.log(tokens);
      }
   }

   //add the found label on the given line
   //to the 'labels' object.  
   //index should be the line number.
   function getLabel(labels, line, index) {
      if(!line) 
         return; //ignore empty line

      var colonPos = line.indexOf(':'), 
          tokens;

      if(colonPos == -1)
         return; //no colon, no labels, ignore line

      tokens = line.substr(0, colonPos).split(' ');

      if(tokens.length > 2) {
         //if there is more than 2 tokens it means there
         //is a space somewhere. Labels shouldn't contain spaces.
         throw new pub.AssemblerException(index + 1,
            'Invalid label');
      } else if(_.contains(DIDE_INSTRUCTIONS, tokens[0])) {
         //labels cannot use an instruction name
         throw new pub.AssemblerException(index + 1,
            'Invalid label');
      }

      Object.defineProperty(labels, tokens[0], {value: index});
   }

   pub.AssemblerException = function(line, message) {
      this.value   = line;
      this.message = message;
      this.toString = function() {
         return 'Assembly exception at line ' + this.value + ': ' + 
            this.message;
      };
   };

   pub.assemble = function(sources) {
      //get an array of trimmed line, without comments
      var lines = _.map(sources.split('\n'), function(line){
         var commentTokenPos = line.indexOf(';'); 
         if(commentTokenPos == -1)
            return line.trim();
         else
            return line.substr(0, commentTokenPos).trim();
      });

      var labels = {};
      //label lookup
      _.each(lines, _.partial(getLabel, labels, _ ));
      
      //assembly phase
      _.each(lines, assembleLine);
   };

   return pub;
})();