/*************************************************************************
************************************
************************************
* Vimeo Simple API
*
* The Simple API is a really easy way to get information about public videos, users, groups, channels, albums, and activity.
*
* http://developer.vimeo.com/apis/simple
* https://github.com/vimeo/vimeo-api-examples/blob/master/simple-api/gallery/js-example.html
************************************
************************************
**************************************************************************/

var apiEndpoint = 'http://vimeo.com/api/v2/'; // Vimeo Simple API Endpoint
var videosCallback = 'setupGallery'; // Callback function for setting up the gallery
var oEmbedEndpoint = 'http://vimeo.com/api/oembed.json' // Vimeo oEmbed API Endpoint
var oEmbedCallback = 'switchVideo'; // Callback function for embedding the selected video
var vimeoUsername = 'brad'; // Vimeo username for the account to show videos from


// Request the user's videos, and return it to our 'setupGallery' callback function
$(document).ready(function() {
        var url = apiEndpoint + vimeoUsername + '/videos.json?callback=' + videosCallback;
        // Load a JSON file from the Vimeo Simple API Server using a GET HTTP request
        // The 'videos.json' method requests a list of the user's videos in JSON format
        // By appending '?callback=', Vimeo wraps their response in our 'setupGallery' function
        $.getScript(url);
        // The getScript method then executes our 'setupGallery' callback function
});

// Request oEmbed code for a video, and send it to our 'switchVideo' callback function
function getVideo(url) {
        var url = oEmbedEndpoint + '?url=' + url + '&width=504&height=280&callback=' + oEmbedCallback;
        // Load a JSON file from the Vimeo Simple API Server using a GET HTTP request,        
        // By appending '&callback=', Vimeo wraps the response in our 'switchVideo' function
        $.getScript(url);
        // The getScript method then executes our 'switchVideo' callback function 
}

// Set-up the gallery, and load the first video
function setupGallery(videos) {
		// The argument to this function will be the videos object returned from our $().ready request

		var firstVideo = videos[0]; // Access the first video
		var firstVideoUrl = firstVideo.url; // Access the URL property of the first video
		var username = firstVideo.user_name; // Access the username property via the first video
		var portrait_url = firstVideo.user_portrait_medium; // Access a link to the user's thumbnail portrait

        // Set the user's thumbnail and the page title
        $('#stats').prepend('<img id="portrait" src="' + portrait_url + '" />'); // Prepend <img> to #stats section
        $('#stats h2').text(username + "'s Videos"); // Set a string of text as the content of the #stats h2 element

        // Call getVideo to load and embed the first video
        getVideo(firstVideoUrl);

        // Add the videos to the gallery
        for (var i = 0; i < videos.length; i++) {
                // For each video in 'videos'
                var video = videos[i]; // Access the i'th video from the video object
                var html = '<li>'; // New list item for each video
                html += '<a href="' + video.url + '">'; // Add an anchor tag for the video
                html += '<img src="' + video.thumbnail_medium + '" class="thumb" />'; // Add an image tag for the video
                html += '<p>' + video.title + '</p></a>' // The a paragraph tag for the video
                html += '</li>'; // Close the list item tag
                $('#thumbs ul').append(html); // Append the 'html' string to #thumbs ul
        }

        // Call 'getVideo' again to switch to the video when a thumbnail is clicked
        $('#thumbs a').click(function(event) {
                // On a click event for any #thumbs anchor tag
                event.preventDefault(); // The default action of the event will not be triggered.
                url = this.href // Using the anchor tag, access the URL of the video via the href attribute
                getVideo(url); // Call 'getVideo' with the URL of the clicked video
                return false; // Why is this necessary?
        });

}

// Load the embed code of the video into the 'embed' section of the DOM
function switchVideo(video) {
        // The argument to this function will be the video object returned from our 'getVideo' request
        video = video.html; // Access the iframe embed code via the html property of the returned video object
        video = video.replace("//", "https://"); // If request originates from localhost we need to replace '//'' with 'https://'
        video = unescape(video); // Remove escape charecters from the string
        $('#embed').html(video); // The 'video' string of HTML is set as the content of the '#embed' element
}

