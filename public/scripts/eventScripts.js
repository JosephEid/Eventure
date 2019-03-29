function newEvent() {
    var formArray= $("form").serializeArray();
    var data={};
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


function addToEventList(dataR) {
    if (document.getElementById('eventList') != null) {
        const row = document.createElement('div');
        const body = document.createElement('div');

        // formatting the row by applying css classes
        row.classList.add('card');
        row.classList.add('event-cards');
        body.classList.add('card-body');

        // appending a new row
        document.getElementById('eventList').appendChild(row);
        row.appendChild(body);


        body.innerHTML = "<a href=view_event/" + dataR.id + ">" + dataR.eventName + ", "  + dataR.eventLocation + "</a>"
        body.innerHTML += "<div class='card-story-counter red'>&nbsp; <span class=\"w3-badge w3-red\">"+dataR.id+"</span></div> <div class=\"card-story-counter\">\n" +
            "        Stories:\n" +
            "      </div>"
    }
}

function noEventResults() {
    const row = document.createElement('div');
    const body = document.createElement('div');

    // appending a new row
    document.getElementById('eventList').appendChild(row);
    row.appendChild(body);
    // formatting the row by applying css classes
    row.classList.add('card');
    row.classList.add('event-cards');
    body.innerHTML = "No events."
}


var address_array = [];


function updateMap(dataR, thing2) {
    var thing3 = thing2;
    var name_array = [];
    var index_array = [];

    const row = document.createElement('div');
    const body = document.createElement('div');
    var name;
    // appending a new row
    document.getElementById('map').remove();
    document.getElementById('james_is_the_best').appendChild(body);
    body.innerHTML = "<div id='map'></div>";

    var i;
    for (i = 0; i < thing2.length; i++) {
        address_array.push(thing2[i].eventLocation);
        name_array.push(thing2[i].eventName);
        index_array.push(thing2[i].id)
    }



    initMap(thing3);


    var map;
    function initMap(thing3) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 0, lng: 0},
            zoom: 12
        });

        var geocoder = new google.maps.Geocoder();

        geocodeAddress(geocoder, map, thing3);
    }

    function geocodeAddress(geocoder, resultsMap, thing3) {



        var image = {
            url: 'images/Asset 13@288x.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(100, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
        };
        //
        // var shape = {
        //     coords: [100, 100, 100, 100, 100, 100, 100, 100],
        //     type: 'poly'
        // };

        var labels = ['cat', 'dog', 'chicken'];
        var string = []
        var labelIndex = 0;
        var newIndex = 0;
        //var address = 'kt152er';
        for (p = 0; p < address_array.length; p++) {

            geocoder.geocode({'address': address_array[p]}, function(results, status) {

                if (status === 'OK') {

                    resultsMap.setCenter(results[0].geometry.location);


                    var index_value = index_array[labelIndex++ % index_array.length];
                    var label_value = name_array[newIndex++ % name_array.length];
                    var contentString = "<a href=view_event/" + index_value + ">" + label_value + "</a>"

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });



                    var marker = new google.maps.Marker({
                        map: resultsMap,
                        position: results[0].geometry.location,
                        animation: google.maps.Animation.DROP,
                        //icon: image,
                    });
                    marker.addListener('click', function() {
                        infowindow.open(map, marker);
                    });

                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

    }

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
}


function displayEvent(dataR) {
    document.getElementById('nameAndLocation').innerHTML = dataR.eventName + ", " + dataR.eventLocation + ", " + dataR.eventDate;
    document.getElementById('description').innerHTML = dataR.eventDescription;
    getAllStoryData(dataR.id);
}

