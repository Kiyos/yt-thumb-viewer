// Clipboard manipulation
function copyURL(tab_id) {
    var current_image_url = document.getElementById('youtube_' + tab_id + '_url');

    // Supported since IE 8, Firefox 51, Chrome 49, Safari 10, Opera 12.1, iOS 9.3, Android 4.4
    current_image_url.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful.' : 'unsuccessful.';
        console.log('Copying was ' + msg);
    } catch (err) {
        console.log('There was an error copying the ' + tab_id + ' URL to the clipboard. Details:');
        console.log(err.message);
  }
}

// Fill a given tab and prepare the controls on it
function initTab(video_id, tab_id) {
    // Full URL of a given thumbnail
    var thumb_src = 'http://img.youtube.com/vi/' + video_id + '/' + tab_id + '.jpg';

    // Load the thumbnail
    $('#youtube_' + tab_id + '_img').attr('src', thumb_src);
    $('#youtube_' + tab_id + '_img').attr('alt', 'The requested YouTube ' + tab_id + ' thumbnail');

    // Place the URL into the text field
    $('#youtube_' + tab_id + '_url').val(thumb_src);

    // Change the link of the ‘Download’ button
    $('#download_' + tab_id + '_img').attr('href', thumb_src);
    $('#download_' + tab_id + '_img').attr('download', video_id + '.' + tab_id + '.jpg');

    // Change the link of the ‘Open in a new window’ button
    $('#open_' + tab_id + '_img').attr('href', thumb_src);
}

function prepareToGetThumbs() {
    // Hide the error indicators
    $('#video_url_group').removeClass('has-error');
    $('#video_url_group_err').addClass('hide');
    // If it's the first run, the output area is hidden,
    // so the hidden.bs.collapse event won’t be triggered,
    // and we have to manually initiate the extraction process
    if (!$('#output_area').hasClass('collapse in')) {
        getThumbs();
    } else {
        // Hide the collapsible output area
        $('#output_area').collapse('hide');
    }
}

// Make sure that we start processing each URL
// only when the output area is hidden again
$('#output_area').on('hidden.bs.collapse', function() {
    getThumbs();
});

// Pressing Enter key on the keyboard with the URL input field focused
// equals clicking on the 'Get thumbs' button
$('#video_url').keyup(function(event) {
    if (event.keyCode == 13) {
        // Cancel the browser-default action
        event.preventDefault();
        // Trigger the button
        document.getElementById('getthumbs').click();
    }
});

// Main function
function getThumbs() {
    // Extract the video ID using a carefully designed regular expression
    var yt_id_regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/,
        uri = $('#video_url').val(),
        video_id = uri.match(yt_id_regex);

    if (video_id !== null) { // The URL indeed contains a YouTube video ID
        try {
            // We need only the first regex match
            video_id = video_id[1];

            // Fill the tabs with content according to the video ID
            initTab(video_id, '0');
            initTab(video_id, '1');
            initTab(video_id, '2');
            initTab(video_id, '3');
            initTab(video_id, 'default');
            initTab(video_id, 'hqdefault');
            initTab(video_id, 'mqdefault');
            initTab(video_id, 'sddefault');
            initTab(video_id, 'maxresdefault');
        } finally {
            // Show the results of our hard work
            $('#output_area').collapse('show');
        }
    } else { // The regex wasn’t matched, we need to notify the user
        // Show the error indicators
        $('#video_url_group').addClass('has-error');
        $('#video_url_group_err').removeClass('hide');
    }
}
