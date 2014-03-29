$(document).ready(function(){
    
    $('#go').on('click', function(e){
        searchGo();
    });
    
    
    $('#content').on('click', '.DocElement', function(e){
        console.log('clicked on doc element');
        var eid = $(this).attr('id');
        getDoc(eid);
    });
    
    
});

function checkEnterSubmit()
{
    if (window.event.keyCode == 13)
    {
        fillCodeText();
    	//searchGo();    
    }
}

function fillCodeText()
{
    //var sentence = document.getElementById("voice-input").innerHTML;//encodeURI($('#voice-input').val());
    document.getElementById("codetext").innerHTML="testing js"; //sentence;
    //var data = {};
   // data[voice] = encodeURI($('#voice-input').val());
    //var sentence = encodeURI($('#voice-input').val());

    // $('#content').load("talknerdy/interpret", data, 
    //     function(response, status, xhr)
    //     {
    //         console.log('loaded'); //-----------remove
    //         if (xhr.status == "404")
    //         {
    //             var msg = "<br /><br />Sorry but there was an error: ";
    //             $("#error").html(msg + xhr.status + " " + xhr.statusText);
    //         } else {
    //             var msg = "<br /><br />All good!";
    //             $("#error").html(msg + xhr.status + " " + xhr.statusText);
    //         }
    //     }
    // );
}

/**
 * Populate the list of popular selections
 */
function searchGo(){
    
    var searchQuery = encodeURI($('#search-query').val());
    console.log(searchQuery);  //-----------remove
    
    $('#content').load(
        "search.php?q=" + searchQuery,
        function(response, status, xhr)
        {
            console.log('loaded'); //-----------remove
            if (xhr.status == "404")
            {
                var msg = "<br /><br />Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {
                var msg = "<br /><br />All good!";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            }
        }
    );
}

/**
 * Get the specific documentation for a function 
 */
function getDoc(eid){
    
    $('#content').load(
        "doc.php?d=" + eid,
        function(response, status, xhr)
        {
            console.log('loaded'); //-----------remove
            if (xhr.status == "404")
            {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {
                var msg = "All good!";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            }
        }
    );
}