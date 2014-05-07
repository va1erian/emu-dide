/*
   EMU-DIDE Assembler and Emulator
*/

(function() {
   'use strict';
   $(document).ready( function() {

      UI.init();
      Video.init();
      Video.drawBuffer(Video.generateTestBuffer());
   });

})();