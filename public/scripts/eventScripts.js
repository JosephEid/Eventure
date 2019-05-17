/**
 * When a new event is submitted, will serialise the data and pass it to an ajax request
 */
function newEvent() {
    var formArray = $("form").serializeArray();
    var data = {};
    for (index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }
    // console.log(data);
    // console.log("testing");
    sendAjaxQuery('/post_event', data);
    event.preventDefault();
}

/**
 * Given the url for the post event route and the new event data, will send an ajax request to the server.
 * On success it will pass the data to the store in database function
 */
function sendAjaxQuery(url, data) {
    console.log("sending ajax");
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
            console.log("testing");
            storeEventData(dataR);
            // in order to have the object printed by alert
            // we need to JSON stringify the object;
            //document.getElementById('results').innerHTML= JSON.stringify(dataR);
        },
        error: function(xhr, status, error) {
            console.log(error.message);
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

        document.getElementById("features_id").style.display = "block";
        document.getElementById("main-container-features").style.display = "block";
        document.getElementById("hold_all_the_events").style.display = "block";
        // #main-container-features, #features_id
        var row = document.createElement('div');
        var body = document.createElement('div');


        row.classList.add('col-md-4');

        row.innerHTML = "        <div class=\"card mb-4 box-shadow\">\n" +
            "          <img class=\"card-img-top\"  alt=\"image\" style=\"height: 225px; object-fit: contain; background-image: url("+dataR.eventPhoto+"); display: block;\" src='"+ dataR.eventPhoto +"' data-holder-rendered=\"true\">\n" +
            "          <div class=\"card-body\">\n" +
            "            <i><h5 style='marigin-bottom:0px !important; font-size: 12px;' class=\"card-text\"><b> "+ dataR.eventName.toUpperCase() + "</h5></i>\n" +
            "            <b><h4 style='color: red; margin-top:0px !important; padding-top: 0px !important;'> "+ dataR.city.toUpperCase() + "</h4></b>\n" +
            "            <p class=\"card-text\"> "+ dataR.eventDescription.slice(0, 70) + "</p>\n" +
            "            <div class=\"d-flex justify-content-between align-items-center\">\n" +
            "              <div class=\"btn-group\">\n" +
            "                <a href=view_event/" + dataR.id + " role='button' class='btn btn-sm btn-outline-danger' style='font-size: 12px;'>View event</a>\n" +
            "                <a href=new_story/" + dataR.id + " role='button' class='btn btn-sm btn-danger btn-block' style='float: right;font-size: 12px;'>Add a story</a>\n" +
            "              </div>\n" +
            "            </div>\n" +
            "          </div>\n" +
            "<div class=\"card-footer text-muted\">\n" +
            "    " + dataR.eventDate + "\n" +
            "  </div>\n" +
            "        </div>\n" +
            "      </div>";
        document.getElementById('main_row').appendChild(row);
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
    row.innerHTML = "😥 No current events";
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
        ev = original_data[i];
        var address = ev.line1 + ' ' + ev.line2 + ' ' + ev.postalCode + ' ' + ev.city;
        address_array.push(address);
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
    $('.mb-4').parent().hide();
    content = content.toUpperCase();

    // show all results containing the content of the searchbar.
    $('.mb-4:contains("' + content + '")').parent().show();
}

/**
 * Given a specific event record, adds the relevant information in it to new html sections that are added to the event page
 * @param dataR
 */
function displayEvent(dataR) {

    if (dataR.eventName != null) {
        document.getElementById('title-event').innerHTML = "<b><h1 style='font-family:initial; font-size: 55px;'> " + dataR.eventName.toUpperCase() + "</h1></b>";
    } else {
        document.getElementById('title-event').innerHTML = "ERROR: no name chosen";
    }

    if (dataR.eventPhoto != null) {
        // use event header
        document.getElementById("master-image").src = dataR.eventPhoto;
    } else {
        // use placeholder header
        document.getElementById("master-image").src = 'images/1.jpg';
    }

    // fetch story information
    var address = dataR.line1 + ' ' + dataR.line2 + ' ' + dataR.postalCode + ' ' + dataR.city;
    document.getElementById('address').innerHTML = address.toUpperCase();
    document.getElementById('date').innerHTML += "<br>" + dataR.eventDate + "</br>";
    document.getElementById('date_small').innerHTML = dataR.eventDate;
    document.getElementById('description_event').innerHTML = dataR.eventDescription;

    // fetch information associated with
    getAllStoryData(dataR.id);
}

function update_features(dataR) {
    if (dataR != null) {
        var row2 = document.createElement('div');
        var body2 = document.createElement('div');
        row2.classList.add('col-md-2');
        row2.classList.add('thumbnail-story');
        row2.classList.add('padding-override');
        document.getElementById('feature_thing_1').appendChild(row2);
        row2.appendChild(body2);
        if (dataR.eventPhoto == "") {
            body2.innerHTML = "<a href=view_event/\" + dataR.id + \"><img src='images/Asset 13@288x.png'></img></a>";
        } else {
            body2.innerHTML = "<img src=\'"+ dataR.eventPhoto +"'></img>";
            body2.innerHTML = "<a href=view_event/" + dataR.id + "><img src=\'"+ dataR.eventPhoto + "'></a>"
        }
    }
}