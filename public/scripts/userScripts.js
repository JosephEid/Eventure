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
    //
    // if (validatePassword(password, confirm_password)) {
    //
    // }
    // else {
    //     console.log("no bueno");
    // }
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

function validatePassword(password, confirm_password){
    console.log(password);
    console.log(confirm_password);
    if(password != confirm_password) {
        return false;
    } else {
        return true;
    }
}

function login() {
    var formArray= $("form").serializeArray();
    var data={};
    //var url="/post_event";
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