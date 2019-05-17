var User = require('../../models/user');

//Function to handle all types of user post data
exports.insert = function (req, res) {
    var userData = req.body;
    console.log(userData);
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    //If a new user is being inserted, insert it in the mongodb
    if (userData.loginFirstName && userData.loginLastName && userData.loginUsername && userData.loginEmail && userData.loginPassword) {
        try {
            var user = new User({
                first_name: userData.loginFirstName,
                last_name: userData.loginLastName,
                username: userData.loginUsername,
                email: userData.loginEmail,
                password: userData.loginPassword
            });
            console.log('received: ' + user);

            user.save(function (err, results) {
                console.log("you made mongo");
                if (err) {
                    console.log("there was an error");
                    res.status(500).send('Invalid data!');
                }


                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(userData));
            });
        } catch (e) {
            res.status(500).send('error ' + e);
        }
    }
    //If the posted data is a username and a password authenticate them and attempt to log them in
    else if (userData.loginUsername && userData.loginPassword) {
        console.log("log in check");
        User.authenticate(userData.loginUsername, userData.loginPassword, function (error, user) {
            if (error || !user) {
                console.log("couldnt authenticate");
                return res.send(false);
            } else {
                console.log("you here2");
                console.log(user.username);
                req.session.username = user.username;
                req.session.userId = user._id;
                req.session.loggedIn = true;
                return res.send(true);
            }
        });
    }
    //If the posted data is the variable check logged in, then check if the current user is logged in
    else if (userData.checkLoggedIn) {
        if (req.session.loggedIn) {
            data = {};
            data["username"] = req.session.username;
            data["loggedIn"] = req.session.loggedIn;
            return res.send(data);
        }
        else {
            data = {};
            data["username"] = "anon";
            data["loggedIn"] = req.session.loggedIn;
            return res.send(data);
        }
    }
    else if (userData.logout) {
        if (req.session.loggedIn) {
            req.session.loggedIn = false;
            return res.send(true);
        }
        else {
            return res.send(false);
        }
    }
}