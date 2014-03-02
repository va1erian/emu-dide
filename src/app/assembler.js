/*
   EMU-DIDE - Assembler module
*/

Assembler = (function() {
   'use strict';

   var pub = {}; //public symbols

   var DIDE_INSTRUCTIONS = 
      ['ADD', 'ADDI', 'SUB', 'SUB', 'CMP', 'CMPI', 'AND',
       'ANDI', 'XOR', 'XORI', 'ORI', 'LUI', 'SLL', 'SAR',
       'SLR', 'LOAD', 'STORE', 'BE', 'BGT', 'BLE', 'BGTU',
       'BLEU', 'BA', 'BC', 'BO'];

   var ASSEMBLER_DIRECTIVES = ['BYTE', 'WORD', 'DEFINE'];
       
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

      if(!_.contains(DIDE_INSTRUCTIONS, tokens[0]))
         throw new pub.AssemblerException(index + 1, 
            'Unknown instruction ' + tokens[0]);
      else {
         console.log(tokens);
      }
   }

   function buildLabels(labels, line, index) {
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
         return 'Assembly exception at at line ' + this.value + ': ' + 
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
      _.each(lines, _.partial(buildLabels, labels, _ ));
      
      //assembly phase
      _.each(lines, assembleLine);
   };

   return pub;
})();