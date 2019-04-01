/**
 * When a new story form is submitted, will serialize the information and pass it to an ajax request
 */
function newStory() {
    console.log(document.getElementById('eventId').value);
    var formArray = $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name] = formArray[index].value;
    }
    console.log(formArray);
    sendAjaxQuery('/post_story', data);
    event.preventDefault();
}

/**
 * Given the url for the post story route and the new story data, will send an ajax request to the server.
 * On success it will pass the data to the store in database function
 * @param url
 * @param data
 */
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            storeStoryData(dataR);
            // in order to have the object printed by alert
            // we need to JSON stringify the object;
            //document.getElementById('results').innerHTML= JSON.stringify(dataR);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * Given a story record, adds the relevant information in it to new html sections that are added to the page
 * @param dataR
 */
function addToStoryList(dataR) {
    if (document.getElementById('storyList') != null) {
        const story = document.createElement('div');
        const body = document.createElement('div');

        // formatting the row by applying css classes
        story.classList.add('card');
        story.classList.add('event-cards');
        body.classList.add('card-body');
        body.innerHTML = "<br> <img style='display: block;\n" +
            "  margin-left: auto;\n" +
            "  margin-right: auto;" +
            "border-radius:5px;'src=\""+dataR.photoBlob + "\" width=\"100%\" alt=\"Image preview...\" class=\"imagePreview\">"+"<div class=\"row description-container\">\n";
        body.classList.add('card-body-story');

        // appending a new row
        document.getElementById('storyList').appendChild(story);
        story.appendChild(body);
        // document.getElementById('title_of_story').innerHTML = dataR.caption;
        // document.getElementById('author_of_story').innerHTML = dataR.caption;
        // document.getElementById('time_of_story').innerHTML = dataR.storyDate + ", " + dataR.storyTime;
        // document.getElementById('story_image').innerHTML = "<br> <img src=\""+dataR.photoBlob + "\" height=\"400\" alt=\"Image preview...\" class=\"imagePreview\">"
        body.innerHTML += "<div class=\"col-md-12 desc\">\n" +
            "                            <hr></hr>\n" +
            "                            <b id=\"title_of_story\"> " + dataR.caption + "</b><br>\n" +
            "                            <b id=\"time_of_story\"> " + dataR.storyDate + ", " +  dataR.storyTime + " </b>\n" +
            "                        </div>\n" +
            "                    </div>";
    }
}

/**
 * Given an event record, will add a corresponding option to the html dropdown select box
 * @param event
 */
function addToDropdown(event) {
    if (document.getElementById('eventId') != null) {
        const option = document.createElement('option');
        option.value = event.id;
        console.log(event.id);
        option.innerHTML = event.eventName;

        document.getElementById('eventId').appendChild(option);
    }
}

/**
 * Closes the camera
 */
function closeModal() {
    console.log("You here mate");
    $('#photoModal').modal('hide');
}