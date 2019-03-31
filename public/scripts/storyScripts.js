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

function addToStoryList(dataR) {
    if (document.getElementById('storyList') != null) {
        const story = document.createElement('div');
        const body = document.createElement('div');

        // formatting the row by applying css classes
        story.classList.add('card');
        story.classList.add('event-cards');
        body.classList.add('card-body');
        body.classList.add('card-body-story');

        // appending a new row
        document.getElementById('storyList').appendChild(story);
        story.appendChild(body);
        console.log(dataR.photoBlob);
        body.innerHTML = dataR.storyDate + " " + dataR.storyTime + "<a href=view_story/" + dataR.id + "></a><br>" + dataR.caption +"<br> <img src=\""+dataR.photoBlob + "\" height=\"200\" alt=\"Image preview...\" class=\"imagePreview\">"
    }
}

function addToDropdown(event) {
    if (document.getElementById('eventId') != null) {
        const option = document.createElement('option');
        option.value = event.id;
        console.log(event.id);
        option.innerHTML = event.eventName;

        document.getElementById('eventId').appendChild(option);
    }
}

function closeModal() {
    console.log("You here mate");
    $('#photoModal').modal('hide');
}