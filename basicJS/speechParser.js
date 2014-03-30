(function($) {

    $(document).ready(function() {

        var recognition = new webkitSpeechRecognition();


        recognition.continuous = true;
        recognition.interimResults = true;

        //The div to put the spoken code into
        var divToPutSpokenCodeIn =  document.getElementById('code-palette');

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

        //When being-recording button is clicked..
        $('.begin-recording').click(function(){
            recognition.start();
        });

        $('.end-recording').click(function(){
            recognition.stop();
        });

        /* 
         * When speech parser webkitSpeechRecognition returns a result.. 
         */
        recognition.onresult = function (event) 
        {   
            //Go through the results, only selecting one that webkitSpeechRecognition decided was final..
            for (var rI = event.resultIndex; rI < event.results.length; ++rI) {
                if (event.results[rI].isFinal) {
                    singleLineInput += event.results[rI][0].transcript;
                    divToPutSpokenCodeIn.innerHTML = singleLineInput;

                    //If parseRawInput returned false (which it will when user has moved onto new line) then call newLine()
                    if(!parseRawInput(singleLineInput)) {

                        //TODO: Add completed line to currentCode


                        //Clear events.results (Need to move onto next line)
                        event.results = [];

                        //Initialize new line
                        newLine();
                    }
                    //alert(event.results[i][0].transcript);
                    //var divToPut =  document.getElementById('code-palette').innerHTML = event.results[i][0].transcript;
                    document.getElementById('code-pallet').innerHTML = event.results[i][0].transcript;
                }
            }
        };

        /*
         * When event ends (in future was to )
         */
        recognition.onend = function() {
            $('base class for mic button').removeClass('mic working class').addClass('idle mic working class');
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
                    controlStructureTypeOfCurrentLine = 1;
                    alert('Is a for loop');
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

                else if(is_ElseIF_Statement(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 5;
                }

                else if(is_Definatly_Not_A_Control_Struct(resultWordArray))
                {
                    controlStructureTypeOfCurrentLine = 6;
                }
                
            }

            //Control Structure is known or it's know that it's definatly not a control structure.
            else
            {
               // alert("Know it's definatly a number" + controlStructureTypeOfCurrentLine);
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

        function is_ElseIF_Statement(possibleElseIf)
        {
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
