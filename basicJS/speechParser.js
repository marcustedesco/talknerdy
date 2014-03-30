(function($) {

    $(document).ready(function() {

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

                    //alert(event.results[i][0].transcript);
                    var divToPut =  document.getElementById('code-pallet').innerHTML = event.results[i][0].transcript;
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