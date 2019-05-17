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
    console.log(data);
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
    // #main-container-features, #features_id
    var row = document.createElement('div');

    row.classList.add('col-md-12');

    // formatting the row by applying css classes

    // row.classList.add('col   -md-4');
    row.innerHTML = "        <div class=\"card mb-12 box-shadow\" style='margin-bottom: 5em;'>\n" +
        "          <img class=\"card-img-top\"  alt=\"image\" style=\"      width: 100%;\n" +
        "      \n" +
        "      object-fit: cover;  width: 100%; display: block;\" src='"+ dataR.photoBlob +"' data-holder-rendered=\"true\">\n" +
        "          <div class=\"card-body\" style='height: 70px;'>\n" +
        "            <h3 style='float: left;color: red; margin-top:0px !important; padding-top: 0px !important;'> "+ dataR.caption + "</h3>\n" +
        "            <div class=\"d-flex justify-content-between align-items-center\" style='float: right'>\n" +
        "            </div>\n" +
        "          </div>\n" +
        "<div class=\"card-footer text-muted\">\n" +
        "<p>" + dataR.storyDate + "</p>";
        "  </div>\n" +
        "        </div>\n" +
        "      </div>\n";

    document.getElementById('main_row2').appendChild(row);


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
    $('#photoModal').modal('hide');
}

function noStoryResults() {
    var row = document.createElement('div');
    document.getElementById('overflow-thing').appendChild(row);
    row.classList.add('card');
    row.classList.add('card-header');
    // inside card information
    row.innerHTML = "😥 No current stories"
}