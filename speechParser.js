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

        //A stack object that keeps track of open control structures (like for, while, etc.)
        var stackOfTags = new ControlStructureStack();

        //A single line of input (will reset (become empty) for every new line)
        var singleLineInput = "";

        //Current Line's LineType (each type has a class)
        var currentLineType = new Object();

        var cursor; //cursor

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

                    singleLineInput = event.results[r][0].transcript;
                    //document.getElementById('rawtext').innerHTML = "";


                    //If parseRawInput returned false (which it will when user has moved onto new line) then call newLine()
                    if(!parseRawInput(singleLineInput)) {
                        


                        //Clear events.results (Need to move onto next line)
                        event.results = [];

                        //Initialize new line
                        //newLine();
                        singleLineInput = "";
                    }

                    document.getElementById('rawtext').innerHTML = "\"" + singleLineInput + "\"";
                }
            }
        };

        /*
         * When event ends..
         */
        /*recognition.onend = function() {
            $('.speech-content-mic').removeClass('speech-mic-works').addClass('speech-mic');
        };*/

        function parseRawInput(currentEventResult)
        {
            var resultWordArray = currentEventResult.split(" ");
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
                    cursor = editor.getCursor("from");
                    editor.replaceRange("for(/*init*/;/*condition*/;/*iteration*/){\n\n", cursor);
                    editor.replaceRange("}", {line:cursor.line+2,ch:cursor.ch});
                    editor.setCursor(cursor.line,cursor.ch+4);
                    cursor.ch +=4;
                    editor.setSelection(cursor);
                    var cursor2 = editor.getCursor("from");
                    editor.setSelection(cursor2, {line:cursor2.line,ch:cursor2.ch+8});

                }

                else if(is_While_Loop(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 2;
                    alert("It's a while");

                    var whileLoopLine = new WhileLoopLine();
                    whileLoopLine


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
                    for(var i = 0; i < resultWordArray.length; ++i) 
                    {
                        if(!isNaN(parseInt(resultWordArray[i]))){
                            editor.setCursor(parseInt(resultWordArray[i])-1,0);
                            break;
                        }
                    }
                    controlStructureTypeOfCurrentLine = 0;
                    return false;
                }

                else if(is_Main(resultWordArray))
                {

                    cursor = editor.getCursor("from");
                    editor.replaceRange("public static void main(String[] args){\n\n}", cursor);
                    editor.setCursor(cursor.line+1,cursor.ch);
                    editor.execCommand("defaultTab");
                    controlStructureTypeOfCurrentLine = 0;
                    return false;
                }
                else if(is_Comment(resultWordArray))
                {

                    // cursor = editor.getCursor("from");
                    // editor.replaceRange("public static void main(String[] args){\n\n}", cursor);
                    // editor.setCursor(cursor.line+1,cursor.ch);
                    // editor.execCommand("defaultTab");
                    var commentText = "comment";
                    var found = false;
                    for(var i = 0; i < resultWordArray.length; ++i) 
                    {
                        if(found){
                            cursor = editor.getCursor("from");
                            editor.replaceRange(resultWordArray[i] + " ", cursor);
                        }
                        //Certain it's a comment
                        if(commentText.localeCompare(resultWordArray[i]) == 0)
                        {
                            found = true;
                            cursor = editor.getCursor("from");
                            editor.replaceRange("\/\/", cursor);
                        }
                    }
                    cursor = editor.getCursor("from");
                    editor.replaceRange("\n", cursor);
                    editor.setCursor(cursor.line+1,cursor.ch);
                    controlStructureTypeOfCurrentLine = 0;
                    return false;
                }

                else if(is_Print(resultWordArray))
                {
                    var printText = "print";
                    var found = false;
                    for(var i = 0; i < resultWordArray.length; ++i) 
                    {
                        if(found){
                            cursor = editor.getCursor("from");
                            editor.replaceRange(resultWordArray[i] + " ", cursor);
                        }
                        //Certain it's a print
                        if(printText.localeCompare(resultWordArray[i]) == 0)
                        {
                            found = true;
                            cursor = editor.getCursor("from");
                            editor.replaceRange("System.out.println(\"", cursor);
                        }
                    }
                    cursor = editor.getCursor("from");
                    editor.replaceRange("\");\n", cursor);
                    editor.setCursor(cursor.line+1,cursor.ch);
                    controlStructureTypeOfCurrentLine = 0;
                    return false;
                }

                else if(is_Definatly_Not_A_Control_Struct(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 8;
                }

                //Declaring value
                else
                {
                    var declarationStatement = new VariableChangeLine();
                    if(declarationStatement.create(resultWordArray))
                    {
                        cursor = editor.getCursor("from");
                        editor.replaceSelection(declarationStatement.resultToPrint + "\n");
                        editor.setCursor(cursor.line+1,cursor.ch);

                        return false;
                    }
                }
            }

            //Control Structure is known or it's know that it's definatly not a control structure.
            else
            {
               //alert("Know it's definatly a number" + controlStructureTypeOfCurrentLine);
                //if(controlStructureTypeOfCurrentLine == 1 && currentLineType.isAllFilledOut(["int", "i", "equals", "8", "while", "i", "is", "less", "than", "7", "fds", "fdsds", "increments", "by", "7"]))
            
                if(controlStructureTypeOfCurrentLine == 1)
                {

                    if(currentLineType.isAllFilledOut(resultWordArray)) {
                        editor.replaceSelection(currentLineType.variableEndOperation);
                        cursor = editor.getCursor("from");
                        //might have to change this char index
                        editor.setCursor(cursor.line+1,cursor.ch);
                        editor.execCommand("autoIndent");

                        controlStructureTypeOfCurrentLine = 0;
                        return false;
                    }

                    else
                    {
                        if(currentLineType.declarationFilledOut && !currentLineType.conditionFilledOut && ! currentLineType.printedDeclaration)
                        {
                            //alert(currentLineType.variableDeclaration);
                            editor.replaceSelection(currentLineType.variableDeclaration);
                            cursor = editor.getCursor("from");
                            editor.setSelection({line:cursor.line,ch:cursor.ch+1}, {line:cursor.line,ch:cursor.ch+14});
                            currentLineType.printedDeclaration = true;

                        }

                        if(currentLineType.conditionFilledOut && !currentLineType.endOperationFilledOut && !currentLineType.printedCondition)
                        {
                            //alert(currentLineType.variableCondition);
                            editor.replaceSelection(currentLineType.variableCondition);
                            cursor = editor.getCursor("from");
                            editor.setSelection({line:cursor.line,ch:cursor.ch+1}, {line:cursor.line,ch:cursor.ch+14});
                            currentLineType.printedCondition = true;
                        }
                    }
                }

                else
                {
                    controlStructureTypeOfCurrentLine = 0;
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

            var common_Loop_Parse_MisIdentities = new Array("Luke", "leaf", "loot", "loops");
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
                                if(loopText.localeCompare(possibleFor[i + f]) == 0)
                                {
                                    return true;
                                }

                                else
                                {
                                    for(var g = 0; g < common_Loop_Parse_MisIdentities.length; ++g)
                                    {
                                        if(common_Loop_Parse_MisIdentities[g].localeCompare(possibleFor[i + f]) == 0)
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
            var common_While_Parses = new Array("while", "While", "wild");

            for(var i = 0; i < possibleWhile.length; ++i)
            {
                for(var j = 0; j < common_While_Parses.length; ++j)
                {
                    if(common_While_Parses[j].localeCompare(possibleWhile[i]) == 0)
                    {
                        return true;
                    }
                }
            }

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

        function is_Jump(possibleJump)
        {
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

        function is_Comment(possibleComment){
            //change this so not case sensitive
            var commentText = "comment";

            for(var i = 0; i < possibleComment.length; ++i) 
            {
                //Certain it's a comment
                if(commentText.localeCompare(possibleComment[i]) == 0)
                {
                    return true;
                }
            }

            return false;
        }

        function is_Print(possiblePrint){
            //change this so not case sensitive
            var printText = "print";

            for(var i = 0; i < possiblePrint.length; ++i) 
            {
                //Certain it's a print
                if(printText.localeCompare(possiblePrint[i]) == 0)
                {
                    return true;
                }
            }

            return false;
        }


        function is_Definatly_Not_A_Control_Struct(possibleNonCS)
        {
            return false;
        }

        /*function newLine()
        {
            alert('creating New line');
            singleLineInput = '';
        }*/

    });
})(jQuery);
