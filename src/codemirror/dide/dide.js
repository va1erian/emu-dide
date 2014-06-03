/*
 *  EMU-DIDE - Syntax mode for CodeMirror, based on the z80 mode
 *  
 */


/* jshint ignore:start */
CodeMirror.defineMode('dide', function() {
    var keywords1 = /^(ADD|ADDI|SUB|CMP|CMPI|AND|ANDI|XOR|XORI|OR|ORI|LUI|SLL|SAR|SLR|STORE|LOAD)\b/i;
    var keywords2 = /^(BE|BGT|BLE|BGTU|BLEU|BA|BC|BO)\b/i;
    var keywords3 = /^b_?(call|jump)\b/i;
    var errors = /^([hl][xy]|i[xy][hl]|slia)\b/i;
    var numbers = /^([\da-f]+h|[0-7]+o|[01]+b|\d+)\b/i;

    return {
        startState: function() {
            return {context: 0};
        },
        token: function(stream, state) {
            if (!stream.column())
                state.context = 0;

            if (stream.eatSpace())
                return null;

            var w;

            if (stream.eatWhile(/\w/)) {
                w = stream.current();


                if (keywords1.test(w)) {
                    state.context = 1;
                    return 'keyword';
                } else if (keywords2.test(w)) {
                    state.context = 2;
                    return 'keyword';
                } else if (keywords3.test(w)) {
                    state.context = 3;
                    return 'keyword';
                }

                if (errors.test(w))
                    return 'error';
                
            } else if (numbers.test(w)) {
                return 'number';
            }
            
            if (stream.eat(';')) {
                stream.skipToEnd();
                return 'comment';
            } else if (stream.eat('"')) {
                while (w = stream.next()) {
                    if (w == '"')
                        break;

                    if (w == '\\')
                        stream.next();
                }
                return 'string';
            } else if (stream.eat('\'')) {
                if (stream.match(/\\?.'/))
                    return 'number';
            } else if (stream.eat('.') || stream.sol() && stream.eat('#')) {
                state.context = 4;

                if (stream.eatWhile(/\w/))
                    return 'def';
            } else if (stream.eat('$')) {
                if (stream.eatWhile(/[\da-f]/i))
                    return 'number';
            } else if (stream.eat('%')) {
                if (stream.eatWhile(/[01]/))
                    return 'number';
            } else {
                stream.next();
            }
            return null;
        }
    };
});

CodeMirror.defineMIME("text/x-dide", "dide");
/* jshint ignore:start */
