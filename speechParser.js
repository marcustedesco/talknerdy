(function($) {

    $(document).ready(function() {
        var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            theme: "night",
            basefiles: ["util.js", "stringstream.js", "select.js", "undo.js", "editor.js", "tokenize.js"],
            styleActiveLine: true,
            mode: "text/x-java",
            extraKeys: {
              "F11": function(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
              },
              "Esc": function(cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
              }
            }
        });

        var recognition = new webkitSpeechRecognition();

        //The div to put the spoken code into
        //var divToPutSpokenCodeIn =  document.getElementById('code-palette');

        //Stores ALL code written
        var currentCode = ''; 

        //A stack object that keeps track of open control structures (like for, while, etc.)
        var stackOfTags = new ControlStructureStack();

        //A single line of input (will reset (become empty) for every new line)
        var singleLineInput = '';

        /* Signifies which control structure parseRawInput() thinks the current line is
         * 0 : unknown
         * 1 : for loop
         * 2 : while loop
         * 3 : if statement
         * 4 : else statement
         * 5 : else if statement
         * 6 : Not a control structure
         */
        var controlStructureTypeOfCurrentLine = 0;

        recognition.continuous = true;
        recognition.interimResults = true;

        var interimResult = '';

        $('.begin-recording').click(function(){
            recognition.start();
            $('.recording-button').removeClass('begin-recording').addClass('end-recording');
        });

        $('.end-recording').click(function(){
            recognition.stop();
            $('.recording-button').removeClass('end-recording').addClass('begin-recording');
        });

        //could take this out
        $('.speech-mic-works').click(function(){
            recognition.stop();
        });

        recognition.onresult = function (event) 
        {            
            for (var r = event.resultIndex; r < event.results.length; ++r) {
                if (event.results[r].isFinal) {
                    /*var raw = event.results[i][0].transcript;
                    document.getElementById('rawtext').innerHTML = "\"" + raw + "\"";
                    editor.setValue(interpret(raw));
                    //interpret(raw);*/

                    singleLineInput += event.results[r][0].transcript;
                    document.getElementById('rawtext').innerHTML = "\"" + singleLineInput + "\"";

                    //If parseRawInput returned false (which it will when user has moved onto new line) then call newLine()
                    if(!parseRawInput(singleLineInput)) {

                        //TODO: Add completed line to currentCode


                        //Clear events.results (Need to move onto next line)
                        event.results = [];

                        //Initialize new line
                        newLine();
                    }
                    //document.getElementById('code-pallet').innerHTML = event.results[i][0].transcript;
                    //editor.setValue(singleLineInput);
                }
            }
        };

        /*
         * When event ends..
         */
        recognition.onend = function() {
            $('.speech-content-mic').removeClass('speech-mic-works').addClass('speech-mic');
        };

        function parseRawInput(currentEventResult)
        {
            resultWordArray = currentEventResult.split(" ");
            //If control structure of current line is unkown...
            if(controlStructureTypeOfCurrentLine == 0)
            {
                
                //Go through all possible
                if(is_For_Loop(resultWordArray))
                {
                    /*controlStructureTypeOfCurrentLine = 1;*/
                    //alert('Is a for loop');
                    //editor.setValue("for(;;){\n\n}");

                    //editor.setLineContent(editor.cursorLine(),"for(;;){\n\n}");
                    //editor.setLineContent(editor.currentLine(),"for(;;){\n\n}");
                    
                    //----------------
                    // var cursor = editor.getCursor("from");
                    // editor.replaceRange("for(/*init*/;/*condition*/;/*iteration*/){\n\n}", cursor);
                    // editor.setCursor(cursor.line,cursor.ch+4);
                    // cursor.ch +=4;
                    // editor.setSelection(cursor);
                    // var cursor2 = editor.getCursor("from");
                    // editor.setSelection(cursor2, {line:cursor2.line,ch:cursor2.ch+8});//cursor3);
                    // //editor.replaceRange("i = 0", cursor2, cursor3);
                    // editor.replaceSelection("i = 0");
                    // var cursor3 = editor.getCursor("from");
                    // editor.setSelection({line:cursor3.line,ch:cursor3.ch+1}, {line:cursor3.line,ch:cursor3.ch+14});
                
                    controlStructureTypeOfCurrentLine = 1;
                    stackOfTags.pushCS(controlStructureTypeOfCurrentLine);

                    currentLineType = new ForLoopLine();

                    //TODO: PRINT FOR LOOP
                }

                else if(is_While_Loop(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 2;
                }

                else if(is_If_Statement(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 3;
                }

                else if(is_Else_Statement(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 4;
                }

                else if(is_ElseIf_Statement(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 5;
                }
                else if(is_Jump(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 6;
                    for(var i = 0; i < resultWordArray.length; ++i) 
                    {
                        if(!isNaN(parseInt(resultWordArray[i]))){
                            editor.setCursor(parseInt(resultWordArray[i])-1,0);
                            break;
                        }
                    }
                }
                else if(is_Main(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 7;

                    var cursor = editor.getCursor("from");
                    editor.replaceRange("public static void main(String[] args){\n\n}", cursor);
                    editor.setCursor(cursor.line+1,cursor.ch);
                    editor.execCommand("defaultTab");
                }

                else if(is_Definatly_Not_A_Control_Struct(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 8;
                }
                
            }

            //Control Structure is known or it's know that it's definatly not a control structure.
            else
            {
               //alert("Know it's definatly a number" + controlStructureTypeOfCurrentLine);
                //if(controlStructureTypeOfCurrentLine == 1 && currentLineType.isAllFilledOut(["int", "i", "equals", "8", "while", "i", "is", "less", "than", "7", "fds", "fdsds", "increments", "by", "7"]))

                if(controlStructureTypeOfCurrentLine == 1 && currentLineType.isAllFilledOut(resultWordArray))
                {
                    // DONE --> return false
                    alert("Done");
                    return false;
                }
            }

            return true;
        }

        /*
         * Takes a word array of result text-parse and returns if it's declaring a for loop
         */
        function is_For_Loop(possibleFor)
        {
            var common_For_Parse_MisIdentities = new Array("4", "four");
            var forText = "for";

            var common_Loop_Parse_MisIdentities = new Array("Luke", "leaf");
            var loopText = "loop";

            var common_merged_MisIdentities = new Array("Hulu");

            for(var i = 0; i < possibleFor.length; ++i)
            {

                //Certain it's a for
                if(forText.localeCompare(possibleFor[i]) == 0)
                {
                    //Go up to 3 past i in the split string to check for 'loop' or loop-mis-identities
                    for(var j = 1; j+i < possibleFor.length && j < 4; ++j)
                    {
                        if(loopText.localeCompare(possibleFor[i + j]) == 0)
                        {
                            return true;
                        }

                        else
                        {
                            for(var k = 0; k < common_Loop_Parse_MisIdentities.length; ++k)
                            {
                                if(common_Loop_Parse_MisIdentities[k].localeCompare(possibleFor[i + j]) == 0)
                                {
                                    //TODO: For now still return true, but in future have way to account for fact that there is less certainty about this...
                                    return true;
                                }
                            }
                        }
                    }
                }

                else
                {
                    for(var e = 0; e < common_For_Parse_MisIdentities.length; ++e)
                    {
                        if(common_For_Parse_MisIdentities[e].localeCompare(possibleFor[i]) == 0)
                        {
                            //Go up to 3 past i in the split string to check for 'loop' or loop-mis-identities
                            for(var f = 1; e+f < possibleFor.length && f < 4; ++f)
                            {
                                if(loopText.localeCompare(possibleFor[e + f]) == 0)
                                {
                                    return true;
                                }

                                else
                                {
                                    for(var g = 0; g < common_Loop_Parse_MisIdentities.length; ++g)
                                    {
                                        if(common_Loop_Parse_MisIdentities[g].localeCompare(possibleFor[e + f]) == 0)
                                        {
                                            //TODO: For now still return true, but in future have way to account for fact that there is less certainty about this...
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    for(var mI = 0; mI < common_merged_MisIdentities.length; ++mI)
                    {
                        if(common_merged_MisIdentities[mI].localeCompare(possibleFor[i]) == 0)
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        function is_While_Loop(possibleWhile)
        {
            return false;
        }

        function is_If_Statement(possibleIf)
        {
            return false;
        }

        function is_Else_Statement(possibleElse)
        {
            return false;
        }

        function is_ElseIf_Statement(possibleElseIf)
        {
            return false;
        }

        function is_Jump(possibleJump){
            //change this so not case sensitive
            var jumpText = "jump";

            for(var i = 0; i < possibleJump.length; ++i) 
            {
                //Certain it's a jump
                if(jumpText.localeCompare(possibleJump[i]) == 0)
                {
                    return true;
                }
            }

            return false;
        }

        function is_Main(possibleMain)
        {
            var common_Main_Parse_MisIdentities = new Array("mane", "maine", "Maine", "man");
            var mainText = "main";

            var common_Method_Parse_MisIdentities = new Array("function");
            var methodText = "method";

            for(var i = 0; i < possibleMain.length; ++i) 
            {

                //Certain it's a main
                if(mainText.localeCompare(possibleMain[i]) == 0)
                {
                    //Go up to 3 past i in the split string to check for 'loop' or loop-mis-identities
                    for(var j = 1; j+i < possibleMain.length && j < 4; ++j)
                    {
                        if(methodText.localeCompare(possibleMain[i + j]) == 0)
                        {
                            return true;
                        }

                        else
                        {
                            for(var k = 0; k < common_Method_Parse_MisIdentities.length; ++k)
                            {
                                if(common_Method_Parse_MisIdentities[k].localeCompare(possibleMain[i + j]) == 0)
                                {
                                    //TODO: For now still return true, but in future have way to account for fact that there is less certainty about this...
                                    return true;
                                }
                            }
                        }
                    }
                }

                else
                {
                    for(var e = 0; e < common_Main_Parse_MisIdentities.length; ++e)
                    {
                        if(common_Main_Parse_MisIdentities[e].localeCompare(possibleMain[i]) == 0)
                        {
                            //Go up to 3 past i in the split string to check for 'loop' or loop-mis-identities
                            for(var f = 1; e+f < possibleMain.length && f < 4; ++f)
                            {
                                if(methodText.localeCompare(possibleMain[e + f]) == 0)
                                {
                                    return true;
                                }

                                else
                                {
                                    for(var g = 0; g < common_Method_Parse_MisIdentities.length; ++g)
                                    {
                                        if(common_Method_Parse_MisIdentities[g].localeCompare(possibleMain[e + f]) == 0)
                                        {
                                            //TODO: For now still return true, but in future have way to account for fact that there is less certainty about this...
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return false;
        }


        function is_Definatly_Not_A_Control_Struct(possibleNonCS)
        {
            return false;
        }

        function newLine()
        {
            alert('creating New line');
            singleLineInput = '';
        }

    });
})(jQuery);

function interpret(input){
    if(input.indexOf("create") != -1){
        if(input.indexOf("for") != -1 || input.indexOf("4") != -1)
            return "for(;;){}";
    }

    return "";
}
