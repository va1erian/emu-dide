/*
   EMU-DIDE - Emulator module
*/

Emulator = (function() {
   'use strict';

   var MEMORY_SIZE = 32768*4;
   
   var CPU_STATE = {
		HALTED:0,RUNNING:1,PAUSED:2
   };
   
   var pub = {}; //public symbols
	
   var  registers = new Array(32); // 32 registers of 32 bit
   
   var statusRegister;
   
   // give the address of current instruction
   var programCounter; 
   
   var buffer = new ArrayBuffer(MEMORY_SIZE);
   var memory = new Uint32Array(buffer);
   
   var state;
   
   // reset the emulator
   pub.reset = function(){
		for(var i =0; i < registers.length; i++){
			registers[i] = 0;
		}
		programCounter = 0x00007000;
		statusRegister = 0;
		
		for (var i = 0; i < memory.length; i++){
			memory[i] = 0;
		}
		state = CPU_STATE.HALTED;
   };
   
    // TODO : Copie du programme depuis l'assembleur puis recopie dans la mémoire
	
   pub.loadProgram = function(program){
		memory.set(program,77824);
   };
   
   function fetch(){
		return memory[programCounter/4];
   }
   
   function decode(instruction){
		/*
			extraire different champs
			on reçoit 32 bit --> décalage de bit pour récuperer les champs
			renvoyer objet anonyme (avec codeOp etc...)
		*/
   }
   
   function execute(){
		/*
			créer une fonction pour chaque champs
		*/
   }
   
   pub.run = function(){
		while (state === CPU_STATE.RUNNING){
			var instruction  = fetch();
			var decoded = decode(instruction);
			execute(decoded);
		}
   };
   
   return pub;
})();