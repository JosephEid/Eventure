var dbPromise;

const EVENTURE_DB_NAME = 'db_eventure';
const USER_STORE_NAME = 'store_users';
const EVENT_STORE_NAME = 'store_events';
const STORY_STORE_NAME = 'store_stories';

/**
 * Check for support of indexedDB and if there is initialise the database
 */
function initialise() {
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * it inits the database
 */
function initDatabase(){
    //Opening new idb as a promise
    dbPromise = idb.openDb(EVENTURE_DB_NAME, 1, function (upgradeDb) {
        console.log(dbPromise);
        //If the database doesn't already contain a user store, create one
        if (!upgradeDb.objectStoreNames.contains(USER_STORE_NAME)) {
            var eventureDB = upgradeDb.createObjectStore(USER_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            //Create an index for email address in the user store
            eventureDB.createIndex('email', 'email', {unique: true});
        }
        //If the database doesn't already contain an event store, create one
        if (!upgradeDb.objectStoreNames.contains(EVENT_STORE_NAME)) {
            var eventureDB = upgradeDb.createObjectStore(EVENT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            //Create an index for the primary key in the event store
            eventureDB.createIndex('id', 'id', {unique: true});
        }
        //If the database doesn't already contain a story store, create one
        if (!upgradeDb.objectStoreNames.contains(STORY_STORE_NAME)) {
            var eventureDB = upgradeDb.createObjectStore(STORY_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            //Create an index for eventId in the story store
            eventureDB.createIndex('eventId', 'eventId', {unique: false, multiEntry: true});
        }
    });
    return dbPromise;
}

/**
 * Takes a record containing new user data puts it in the database
 * @param userObject
 */
function storeUserData(userObject) {
    console.log('inserting: '+JSON.stringify(userObject));
    initialise();
    console.log(dbPromise);
    if (dbPromise) {
        console.log('madeit');
        dbPromise.then(async db => {
            var tx = db.transaction(USER_STORE_NAME, 'readwrite');
            var store = tx.objectStore(USER_STORE_NAME);
            await store.put(userObject);
            return tx.complete;
        }).then(function () {
            console.log('added user to the store! '+ JSON.stringify(userObject));
            window.location.replace("/login");

        }).catch(function (error) {
            localStorage.setItem(JSON.stringify(userObject));
        });
    }
    else localStorage.setItem(JSON.stringify(userObject));
}

/**
 * Takes a record containing new event data puts it in the database
 * @param eventObject
 */
function storeEventData(eventObject) {
    initialise();
    console.log(dbPromise);
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(EVENT_STORE_NAME, 'readwrite');
            var store = tx.objectStore(EVENT_STORE_NAME);
            await store.put(eventObject);
            return tx.complete;
        }).then(function () {
            window.location.replace("/");
        }).catch(function (error) {
            localStorage.setItem(JSON.stringify(eventObject));
        });
    }
    else localStorage.setItem(JSON.stringify(eventObject));
}

/**
 * Takes a record containing new story data puts it in the database
 * @param storyObject
 */
function storeStoryData(storyObject) {
    console.log('inserting: '+JSON.stringify(storyObject));
    initialise();
    console.log(dbPromise);
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(STORY_STORE_NAME, 'readwrite');
            var store = tx.objectStore(STORY_STORE_NAME);
            await store.put(storyObject);
            return tx.complete;
        }).then(function () {
            window.location.replace("/view_event/"+storyObject.eventId);
            //redirect("/view_event/"+storyObject.eventId);
        }).catch(function (error) {
            localStorage.setItem(JSON.stringify(storyObject));
        });
    }
    else localStorage.setItem(JSON.stringify(storyObject));
}

/**
 * (This is the first function called when the home page is loaded)
 * Queries the database to get all events and passes them one by one to a script which adds them to the results list
 */
function getAllEventData() {
    $.ajax({
        url: '/list_events',
        type: 'GET',
        success: function(dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            console.log(dataR);
            console.log("testing");
            if (dataR.length>0) {
                for (i = 0; i < 6; i++) {
                    update_features(dataR[i])
                }

                for (var elem of dataR)
                    addToEventList(elem);

                updateMap(dataR);
            }
            else {
                getIndexedEvents();
            }
            // in order to have the object printed by alert
            // we need to JSON stringify the object;
            //document.getElementById('results').innerHTML= JSON.stringify(dataR);
        },
        error: function(xhr, status, error) {
            console.log(error.message);
            alert('Error, you are offline: ' + error.message);
        }
    });
}

function getIndexedEvents() {
    console.log("got from indexed instead")
    initialise();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); })
            .catch ( function(error) {
                console.log(error.message);
            });
    }

    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction(EVENT_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENT_STORE_NAME);
            return store.getAll();
        }).then(function (readingsList) {
            if (readingsList && readingsList.length>0){
                for (i = 0; i < 6; i++) {
                    update_features(readingsList[i])
                }
                for (var elem of readingsList)

                    addToEventList(elem);
                    //Call a function to add each event to the map
                updateMap(readingsList);
            } else {
                noEventResults();
            }
        });
    }
}

/**
 * Queries the database to get all events and passes them one by one to a script which adds them to the new story dropdown box
 */
function getEventName(id) {
    initialise();
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction(EVENT_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENT_STORE_NAME);
            var index = store.index('id');
            return index.get(IDBKeyRange.only(id));
        }).then(function (result) {
            console.log(result.name);
            $("#eventName").val(result.eventName).html(result.eventName);
        });
    }
}

/**
 * Given an event id, will return all stories with that particular event id and pass them to a script which adds them to the stories results
 * @param id
 */
function getAllStoryData(id) {
    $.ajax({
        url: '/list_stories',
        data: {id: id},
        dataType: 'json',
        type: 'POST',
        success: function(dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            console.log(dataR);
            console.log("testing");
            if (dataR.length>0) {
                for (var elem of dataR)
                    addToStoryList(elem);
            }
            else {
                getIndexedStories(id);
            }
            // in order to have the object printed by alert
            // we need to JSON stringify the object;
            //document.getElementById('results').innerHTML= JSON.stringify(dataR);
        },
        error: function(xhr, status, error) {
            console.log(error.message);
            alert('Error, you are offline: ' + error.message);
        }
    });
}

function getIndexedStories(id) {
    console.log('get all stories from indexeddb');
    initialise();
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction(STORY_STORE_NAME, 'readonly');
            var store = tx.objectStore(STORY_STORE_NAME);
            var index = store.index('eventId');
            return index.getAll(IDBKeyRange.only(id.toString()));
        }).then(function (readingsList) {
            console.log(readingsList);
            if (readingsList && readingsList.length>0){
                for (var elem of readingsList)
                    addToStoryList(elem);
            }
        });
    }
}

/**
 * Given an event id, will query the database for the event matching this id, and pass it to a script to display it
 * @param id
 */
function getEvent(id) {
    console.log("success");
    $.ajax({
        url: '/post_id',
        data: {id: id},
        dataType: 'json',
        type: 'POST',
        success: function(dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            console.log("success");
            console.log(dataR);
            if (dataR.length>0) {
                displayEvent(dataR);
            }
            else {
                getIndexedEvent(id)
            }
            // in order to have the object printed by alert
            // we need to JSON stringify the object;
            //document.getElementById('results').innerHTML= JSON.stringify(dataR);
        },
        error: function(xhr, status, error) {
            console.log("fail");
            console.log(error.message);
            alert('Error: ' + error.message);
        }
    });
}

function getIndexedEvent(id) {
    initialise();

    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction(EVENT_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENT_STORE_NAME);
            var index = store.index('id');
            return index.get(IDBKeyRange.only(id));
        }).then(function (readingsList) {
            console.log(readingsList);
            displayEvent(readingsList);
        });
    }
}

function checkLoggedIn() {
    var data = {};
    data["checkLoggedIn"] = 1;
    $.ajax({
        url: '/post_user',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            if (dataR.loggedIn) {
                console.log("Logged in");
                $('#userInfo').empty();
                $('#userInfo').append($('<li class="nav-item">').append($('<a class="nav-link active" onclick="logout()">').text(dataR.username + " ")));
                $('#userInfo').append($('<li class="nav-item">').append($('<a class="nav-link active" onclick="logout()">').text("| Logout")));
                window.username = dataR.username;

            }
            else {
                $('#userInfo').empty();
                $('#userInfo').append($('<li class="nav-item">').append($('<a class="nav-link active" href="/login">').text("Login")));
                $('#userInfo').append($('<li class="nav-item">').append($('<a class="nav-link active" href="/register">').text("New Account")));
                console.log("Not logged in");
                window.username = dataR.username;
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}