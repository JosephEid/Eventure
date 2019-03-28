function newEvent() {
    var formArray= $("#new_event").serializeArray();
    var data={};
    //var url="/post_event";
    for (index in formArray){
        data[formArray[index].name] = formArray[index].value;
    }
    console.log(data);
    sendAjaxQuery('/new_user', data);
    event.preventDefault();
}

function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
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
            document.getElementById('results').innerHTML= JSON.stringify(dataR);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function loadEvents() {

}