/**
 * When a new event is submitted, will serialise the data and pass it to an ajax request
 */
function newEvent() {
    var address = document.getElementById('line1').value + ' ' + document.getElementById('line2').value + ' ' +
        document.getElementById('postalCode').value + ' ' + document.getElementById('town').value + ' ' +
        document.getElementById('city').value + ' ' + document.getElementById('country').value;
    console.log(address);
    var formArray = $("form").serializeArray();
    var data = {};
    for (index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }

    data['eventLocation'] = address;
    console.log(formArray);
    sendAjaxQuery('/post_event', data);
    event.preventDefault();
}

/**
 * Given the url for the post event route and the new event data, will send an ajax request to the server.
 * On success it will pass the data to the store in database function
 */
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function(dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            console.log(dataR);
            storeEventData(dataR);
            // in order to have the object printed by alert
            // we need to JSON stringify the object;
            //document.getElementById('results').innerHTML= JSON.stringify(dataR);
        },
        error: function(xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 *Converts photo taken from the system into a data url displayable on the image preview, which can be submitted as part of the form
 */
function fileSystemPhoto() {
    var preview = document.querySelector(".eventImagePreview");
    var file = document.querySelector('input[type=file]').files[0];
    var field = document.getElementById('eventPhoto');
    var reader = new FileReader();

    reader.addEventListener("load", function() {
        console.log(reader.result);
        preview.src = reader.result;
        field.value = reader.result;
    }, false);
    if (file) {
        reader.readAsDataURL(file);
    }
}

/**
 * Given an event record, adds the relevant information in it to new html sections that are added to the page
 * @param dataR
 */
function addToEventList(dataR) {
    if (document.getElementById('eventList') != null) {
        var row = document.createElement('div');
        var body = document.createElement('div');

        // formatting the row by applying css classes
        row.classList.add('eventResult');
        row.classList.add('card');
        row.classList.add('event-cards');
        body.classList.add('card-body');

        // appending a new row
        document.getElementById('eventList').appendChild(row);
        row.appendChild(body);

        // add html to the event cards
        body.innerHTML = "<a class=\"eventNameResult\" href=view_event/" + dataR.id + ">" + dataR.eventName + ", " + dataR.eventLocation + " " + dataR.eventDate + "</a>"
        body.innerHTML += "<div class='card-story-counter red'>&nbsp; <span class=\"w3-badge w3-red\">" + dataR.id + "</span></div> <div class=\"card-story-counter\">\n" +
            "        Stories:\n" +
            "      </div>"
    }
}

/**
 * Creates a no events html div to display
 */
function noEventResults() {
    var row = document.createElement('div');
    document.getElementById('eventList').appendChild(row);
    row.classList.add('card');
    row.classList.add('card-header');
    // inside card information
    row.innerHTML = "😥 No current events"
}

// store all the locations from the event
var address_array = [];

/**
 * Update the google map with new events
 */
function updateMap(dataR, original_data) {
    var dataJ = original_data;
    var name_array = [];
    var index_array = [];

    var body = document.createElement('div');

    document.getElementById('map').remove();
    document.getElementById('james_is_the_best').appendChild(body);
    body.innerHTML = "<div id='map'></div>";

    var i;
    for (i = 0; i < original_data.length; i++) {
        address_array.push(original_data[i].eventLocation);
        name_array.push(original_data[i].eventName);
        index_array.push(original_data[i].id);
    }
    // start the google maps api
    initMap(dataJ);

    var map;

    function initMap(dataJ) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 53,
                lng: 1
            },
            zoom: 12
        });

        var geocoder = new google.maps.Geocoder();

        geocodeAddress(geocoder, map, dataJ);
    }
    // convert raw address name into lat lng
    function geocodeAddress(geocoder, resultsMap, dataJ) {

        var image = {
            url: '/images/icons/icon.png'
        };

        var labelIndex = 0;
        var newIndex = 0;
        var p;

        // for every event in the database
        for (p = 0; p < address_array.length; p++) {
            geocoder.geocode({
                'address': address_array[p]
            }, function(results, status) {

                if (status === 'OK') {

                    // track the index and labels of the events as they will be seperated
                    var index_value = index_array[labelIndex++ % index_array.length];
                    var label_value = name_array[newIndex++ % name_array.length];
                    var contentString = "<a href=view_event/" + index_value + ">" + label_value + "</a>";

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    // add on a marker for every result
                    var marker = new google.maps.Marker({
                        map: resultsMap,
                        position: results[0].geometry.location,
                        animation: google.maps.Animation.DROP,
                        icon: image
                    });
                    // add a listener for the event title to appear
                    marker.addListener('click', function() {
                        infowindow.open(map, marker);
                    });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

        navigator.geolocation.getCurrentPosition(function(position) {

            // find current user location
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // fetch new icon for current user location
            var image = {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            };

            var myLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                position: myLatLng, // center the map on the users location

                animation: google.maps.Animation.DROP
            });

            var contentString = "You are here."

            // create new window for event title can go in
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            // when event pin clicked open the window
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
            // center the map on the user
            map.setCenter(pos);
        });
    }

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
}

/**
 * Given the contents of the searchbar, filter the events by event details containing the content.
 * @param content - the contents of the searchbar
 */
function updateResults(content) {
    // hide all results first
    $('.eventNameResult').parent().hide();

    // show all results containing the content of the searchbar.
    $('.eventNameResult:contains("' + content + '")').parent().show();
}

/**
 * Given a specific event record, adds the relevant information in it to new html sections that are added to the event page
 * @param dataR
 */
function displayEvent(dataR) {

    if (dataR.eventName != null) {
        document.getElementById('nameAndLocation').innerHTML = dataR.eventName;
    } else {
        document.getElementById('nameAndLocation').innerHTML = "ERROR: no name chosen";
    }

    var header = document.getElementById('masthead_id');

    if (dataR.eventPhoto != null) {
        // use event header
        header.style.background = "url('" + dataR.eventPhoto + "')";
    } else {
        // use placeholder header
        header.style.background = "url('/images/placeholder_img_prev.jpg')";
    }
    // fetch story information
    document.getElementById('address').innerHTML = dataR.eventLocation;
    document.getElementById('date').innerHTML += dataR.eventDate;
    document.getElementById('smaller_title_date').innerHTML = dataR.eventDate;
    document.getElementById('address').innerHTML += "<br><hr><i>" + dataR.eventDescription + "</i>";

    // fetch information associated with
    getAllStoryData(dataR.id);
}