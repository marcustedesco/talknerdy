(function($) {

    $(document).ready(function() {
        var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            theme: "night",
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


        recognition.continuous = true;
        recognition.interimResults = true;

        var interimResult = '';

        $('.begin-recording').click(function(){
            recognition.start();
        });

        $('.speech-mic-works').click(function(){
            recognition.stop();
        });

        recognition.onresult = function (event) 
        {            
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    var raw = event.results[i][0].transcript;
                    document.getElementById('rawtext').innerHTML = "\"" + raw + "\"";
                    editor.setValue(interpret(raw));
                    //interpret(raw);
                }
            }
        };

        /*
         * When event ends..
         */
        recognition.onend = function() {
            $('.speech-content-mic').removeClass('speech-mic-works').addClass('speech-mic');
        };

    });
})(jQuery);

function interpret(input){
    if(input.indexOf("create") != -1){
        if(input.indexOf("for") != -1 || input.indexOf("4") != -1)
            return "for(;;){}";
    }

    return "";
}