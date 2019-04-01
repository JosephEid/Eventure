function newEvent() {
    var address = document.getElementById('line1').value + ' ' + document.getElementById('line2').value + ' ' +
        document.getElementById('postalCode').value + ' ' + document.getElementById('town').value + ' ' +
        document.getElementById('city').value + ' ' + document.getElementById('country').value;
    console.log(address);
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name] = formArray[index].value;
    }
    data['eventLocation'] = address;
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

function fileSystemPhoto() {
    var preview = document.querySelector(".eventImagePreview");
    var file    = document.querySelector('input[type=file]').files[0];
    var field   = document.getElementById('eventPhoto');
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
        console.log(reader.result);
        preview.src = reader.result;
        field.value = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}



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

        body.innerHTML = "<a class=\"eventNameResult\" href=view_event/" + dataR.id + ">" + dataR.eventName + ", "  + dataR.eventLocation + " " + dataR.eventDate + "</a>"
        body.innerHTML += "<div class='card-story-counter red'>&nbsp; <span class=\"w3-badge w3-red\">"+dataR.id+"</span></div> <div class=\"card-story-counter\">\n" +
            "        Stories:\n" +
            "      </div>"
    }
}

function noEventResults() {
    var row = document.createElement('div');

    document.getElementById('eventList').appendChild(row);
    row.classList.add('card');
    row.classList.add('card-header');
    row.innerHTML = "😥 No current events"

}


// store all the locations from the event
var address_array = [];

// update the google map with new events
function updateMap(dataR, thing2) {
    var thing3 = thing2;
    var name_array = [];
    var index_array = [];

    var row = document.createElement('div');
    var body = document.createElement('div');
    var name;

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
            center: {lat: 53, lng: 1},
            zoom: 12
        });

        var geocoder = new google.maps.Geocoder();

        geocodeAddress(geocoder, map, thing3);
    }

    function geocodeAddress(geocoder, resultsMap, thing3) {



        var image = {
            url: '/images/icons/icon.png',
        };


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
                        icon: image
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

        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var image = {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',

            };

            var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                position: myLatLng,

                animation: google.maps.Animation.DROP
            });

            var contentString = "You are here."

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

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

function updateResults(content) {
    $('.eventNameResult').parent().hide();

    // Search and show
    $('.eventNameResult:contains("'+content+'")').parent().show();
}
function displayEvent(dataR) {

    if (dataR.eventName != null) {
        document.getElementById('nameAndLocation').innerHTML = dataR.eventName;
    } else {
        document.getElementById('nameAndLocation').innerHTML = "ERROR: no name chosen";
    }

    var header = document.getElementById('masthead_id');

    if (dataR.eventPhoto != null) {
        header.style.background = "url('"+dataR.eventPhoto+"')";
    } else {
        header.style.background = "url('/images/placeholder_img_prev.jpg')";
    }

    document.getElementById('address').innerHTML = dataR.eventLocation;
    document.getElementById('date').innerHTML += dataR.eventDate;
    document.getElementById('smaller_title_date').innerHTML = dataR.eventDate;
    document.getElementById('address').innerHTML += "<br><hr><i>" + dataR.eventDescription + "</i>";
    //document.getElementById('title_of_event_2').innerHTML = dataR.eventLocation;
    //document.getElementById('photoHeader').src = dataR.eventPhoto;


    getAllStoryData(dataR.id);
}

