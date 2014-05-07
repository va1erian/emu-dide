/*
   EMU-DIDE - UI management module
*/

UI = (function() {
   'use strict';
   var pub = {}, //public symbols
       editor;

   var toolbarClickBindings = {
      '#newTbBtn' : function() {
         editor.setValue('\n');
      },

      '#runTbBtn': function() {
         //Assembler.assemble(editor.getValue());
         Emulator.run();
      },
      '#pauseTbBtn': function() {
         Emulator.halt();
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
            $(id).on('click',cb);
         });

         $(Emulator).bind('stateChange', function() { console.log('state changed');});
   };

   return pub;
})();
