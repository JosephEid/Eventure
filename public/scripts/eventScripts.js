function newEvent() {
    var formArray= $("form").serializeArray();
    var data={};
    //var url="/post_event";
    for (index in formArray){
        data[formArray[index].name] = formArray[index].value;
    }
    console.log(formArray);
    sendAjaxQuery('/post_event', data);
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
            storeEventData(dataR);
            // in order to have the object printed by alert
            // we need to JSON stringify the object;
            //document.getElementById('results').innerHTML= JSON.stringify(dataR);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}


function addToResults(dataR) {
    if (document.getElementById('eventList') != null) {
        const row = document.createElement('div');
        const body = document.createElement('div');

        // appending a new row
        document.getElementById('eventList').appendChild(row);
        row.appendChild(body);
        // formatting the row by applying css classes
        row.classList.add('card');
        row.classList.add('event-cards');

        body.classList.add('card-body');
        body.innerHTML = "<a href=view_event/" + dataR.id + ">" + dataR.eventName + ", "  + dataR.eventLocation + "</a>"
        body.innerHTML += "<div class='card-story-counter red'>&nbsp; <span class=\"w3-badge w3-red\">"+dataR.id+"</span></div> <div class=\"card-story-counter\">\n" +
            "        Stories:\n" +
            "      </div>"


    }
}

function displayEvent(dataR) {
    document.getElementById('nameAndLocation').innerHTML = dataR.eventName + ", " + dataR.eventLocation;
    document.getElementById('description').innerHTML = dataR.eventDescription;
    document.getElementById('dateAndAuthor').innerHTML = dataR.eventDate;
}