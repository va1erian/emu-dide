/*
   EMU-DIDE Assembler and Emulator entry point
*/

(function() {
   'use strict';
   $(document).ready( function() {

      UI.init();
      ServerStorage.init();
      Emulator.reset();
      Debugger.init();
      Video.init();
   });

})();