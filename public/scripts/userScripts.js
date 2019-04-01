// userScripts.js - contains functions related to the sign in and register view pages

/**
 * Serializes and extracts data from form and passes this data as an AJAX request to post the user details.
 */
function signUp() {
    var formArray= $("form").serializeArray();
    var data={};
    //var url="/post_event";
    for (index in formArray){
        if (formArray[index].name == 'loginPassword') {
            password = formArray[index].value;
            data[formArray[index].name] = formArray[index].value;
        }
        else if (formArray[index].name == 'confirmPassword') {
            confirm_password = formArray[index].value;
        }
        else {
            data[formArray[index].name] = formArray[index].value;
        }

    }
    console.log(data);

    sendAjaxQuery('/post_user', data);
    event.preventDefault();
}

/**
 * Stores the user data if the query is successful.
 * @param url - the url in which the query is sent to
 * @param data - the form serialized and processed in the correct format
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
            storeUserData(dataR);
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
 * Takes the provided email and password and uses the function getLogin to sign in/ reject the user.
 */
function login() {
    var formArray= $("form").serializeArray();
    for (index in formArray){
        if (formArray[index].name == 'loginPassword') {
            password = formArray[index].value;
        }
        if (formArray[index].name == 'loginEmail') {
            email = formArray[index].value;
        }


    }
    getLogin(email, password);
    event.preventDefault();
}