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

var apiEndpoint = 'http://vimeo.com/api/v2/'; //Endpoint for the Vimeo Simple API
var videosCallback = 'setupGallery'; // The name of our callback function
//
var oEmbedEndpoint = 'http://vimeo.com/api/oembed.json' //Endpoint for the Vimeo oEmbed API
var oEmbedCallback = 'switchVideo'; // The name of our callback function
//
var vimeoUsername = 'brad'; // The username of the account we want to get videos for


// Request the user's videos, and send it to our callback function
$(document).ready(function() {
        // Load a JSON file from the Vimeo Simple API Server using a GET HTTP request,
        var url = apiEndpoint + vimeoUsername + '/videos.json?callback=' + videosCallback;
        // Vimeo kindkly wraps the response in our 'setupGallery' function
        $.getScript(url);
        // getScript then executes our callback function, which is 'setupGallery'
});

// Request oEmbed code for a video, and send it to our callback function
function getVideo(url) {
        // Load a JSON file from the Vimeo Simple API Server using a GET HTTP request,
        var url = oEmbedEndpoint + '?url=' + url + '&width=504&height=280&callback=' + oEmbedCallback;
        // Vimeo kindly wraps the response in our 'switchVideo' function
        $.getScript(url);
        // getScript then executes our callback function, which is 'setupGallery'
}

// Set up the gallery, and load the first video
function setupGallery(videos) {

		var firstVideo = videos[0];
		var firstVideoUrl = firstVideo.url;
		var username = firstVideo.user_name;
		var portrait = firstVideo.user_portrait_medium;

        // Set the user's thumbnail and the page title
        $('#stats').prepend('<img id="portrait" src="' + portrait + '" />');
        $('#stats h2').text(username + "'s Videos");

        // Call getVideo to load the first video
        getVideo(firstVideoUrl);

        // Add the videos to the gallery
        for (var i = 0; i < videos.length; i++) {
        	    // For each video in 'videos', which comes from $(document).ready
                var video = videos[i];
                var html = '<li><a href="' + video.url + '"><img src="' + video.thumbnail_medium + '" class="thumb" />';
                html += '<p>' + video.title + '</p></a></li>';
                $('#thumbs ul').append(html);
        }

        // Call 'getVideo' again to switch to the video when a thumbnail is clicked
        $('#thumbs a').click(function(event) {
                event.preventDefault();
                getVideo(this.href);
                return false;
        });

}

// Load the embed code of the video into the 'embed' section of the DOM
function switchVideo(video) {
        video = video.html; // Access the html property of the video object, which is the iframe embed code
        video = video.replace("//", "https://"); // If request originates from localhost we need to replace '//'' with 'https://'
        video = unescape(video); // Remove escape charecters from the string
        $('#embed').html(video); // The 'video' string of HTML is set as the content of each matched '#embed' element
}
