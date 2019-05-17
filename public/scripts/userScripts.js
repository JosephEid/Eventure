// userScripts.js - contains functions related to the sign in and register view pages

/**
 * Serializes and extracts data from form and passes this data as an AJAX request to post the user details.
 */
function signUp() {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        if (formArray[index].name == 'loginPassword') {
            data[formArray[index].name] = formArray[index].value;
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
    var data={};
    for (index in formArray){
        data[formArray[index].name] = formArray[index].value;
    }
    console.log(data);

    $.ajax({
        url: '/post_user',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (loggedIn) {
            if (loggedIn) {
                console.log("login successful");
                window.location.replace("/");
            }
            else {
                $('#loginCard').append($('<div class="alert alert-warning" role="alert">').text("Incorrect Username or password"));
                console.log("login unsuccessful");

            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
    event.preventDefault();
}

function checkLoggedIn() {
    var data = {};
    data["checkLoggedIn"] = 1;
    $.ajax({
        url: '/post_user',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (isLoggedIn) {
            if (isLoggedIn) {
                console.log("Logged in");
                $('#userInfo').empty()
                $('#userInfo').append($('<li class="nav-item">').append($('<a class="nav-link active" href="/login">').text("Logout")));
                //window.location.replace("/");
            }
            else {
                $('#userInfo').empty();
                $('#userInfo').append($('<li class="nav-item">').append($('<a class="nav-link active" href="/login">').text("Login")));
                $('#userInfo').append($('<li class="nav-item">').append($('<a class="nav-link active" href="/register">').text("New Account")));
                console.log("Not logged in");

            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}