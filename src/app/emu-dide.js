/*
   EMU-DIDE Assembler and Emulator
*/

(function() {
   var codeMirror;

   $(document).ready( function() {
      codeMirror = CodeMirror(document.getElementById('main'), {
           value: "function myScript(){return 100;}\n",
           mode: 'javascript',
           lineNumbers: true
      });
   });

})();