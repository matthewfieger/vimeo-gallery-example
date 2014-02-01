/*************************************************************************
************************************
************************************
* Vimeo Simple API
*
* The Simple API is a really easy way to get information about public videos, users, groups, channels, albums, and activity.
*
* http://developer.vimeo.com/apis/simple
************************************
************************************
**************************************************************************/

var apiEndpoint = 'http://vimeo.com/api/v2/';
var oEmbedEndpoint = 'http://vimeo.com/api/oembed.json'
var oEmbedCallback = 'switchVideo';
var videosCallback = 'setupGallery';
var vimeoUsername = 'brad';


// Request Users Videos
$(document).ready(function() {
        // Load a JSON file from the Vimeo Simple API Server using a GET HTTP request, then execute it.
        // Vimeo wraps the response in a callback function called 'setupGallery'
        // console.log("Requested videos from " + apiEndpoint + vimeoUsername + '/videos.json?callback=' + videosCallback);
        $.getScript(apiEndpoint + vimeoUsername + '/videos.json?callback=' + videosCallback);
});



// Request oEmbed Code
function getVideo(url) {
        // Load a JSON file from the Vimeo Simple API Server using a GET HTTP request, then execute it.
        // Vimeo wraps the response in a callback function called 'switchVideo'
        console.log("Requested embed code from " + oEmbedEndpoint + '?url=' + url + '&width=504&height=280&callback=' + oEmbedCallback);
        $.getScript(oEmbedEndpoint + '?url=' + url + '&width=504&height=280&callback=' + oEmbedCallback);
}


function setupGallery(videos) {

        // Set the user's thumbnail and the page title
        // console.log(videos)
        $('#stats').prepend('<img id="portrait" src="' + videos[0].user_portrait_medium + '" />');
        $('#stats h2').text(videos[0].user_name + "'s Videos");

        // Load the first video
        // console.log("Request embed code for " + videos[0].url);
        console.log(getVideo(videos[0].url));
        getVideo(videos[0].url);

        // Add the videos to the gallery
        for (var i = 0; i < videos.length; i++) {
                // console.log(videos[i]);
                var html = '<li><a href="' + videos[i].url + '"><img src="' + videos[i].thumbnail_large + '" class="thumb" />';
                html += '<p>' + videos[i].title + '</p></a></li>';
                $('#thumbs ul').append(html);
        }

        // Switch to the video when a thumbnail is clicked
        $('#thumbs a').click(function(event) {
                event.preventDefault();
                getVideo(this.href);
                return false;
        });

}


function switchVideo(video) {
        video = video.html; // Access the html property of the video object, which is the iframe embed code
        video = video.replace("//", "https://"); // If request originates from localhost we need to replace '//'' with 'http://'
        video = unescape(video); // Remove escape charecters from the string
        // console.log(video);
        $('#embed').html(video);
}

