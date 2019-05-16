var User = require('../../models/user');

exports.insert = function (req, res) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var user = new User({
            first_name: userData.loginFirstName,
            last_name: userData.loginLastName,
            email: userData.loginEmail,
            password: userData.loginPassword
        });
        console.log('received: ' + user);

        user.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(userData));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}