var dbPromise;

const EVENTURE_DB_NAME = 'db_eventure';
const USER_STORE_NAME = 'store_users';
const EVENT_STORE_NAME = 'store_events';
const STORY_STORE_NAME = 'store_stories';

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
    dbPromise = idb.openDb(EVENTURE_DB_NAME, 1, function (upgradeDb) {
        console.log(dbPromise);
        if (!upgradeDb.objectStoreNames.contains(USER_STORE_NAME)) {
            var eventureDB = upgradeDb.createObjectStore(USER_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            eventureDB.createIndex('email', 'email', {unique: true});
        }
        if (!upgradeDb.objectStoreNames.contains(EVENT_STORE_NAME)) {
            var eventureDB = upgradeDb.createObjectStore(EVENT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            eventureDB.createIndex('id', 'id', {unique: true});
        }
        if (!upgradeDb.objectStoreNames.contains(STORY_STORE_NAME)) {
            var eventureDB = upgradeDb.createObjectStore(STORY_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            eventureDB.createIndex('eventId', 'eventId', {unique: false, multiEntry: true});
        }
    });
    return dbPromise;
}

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
        }).catch(function (error) {
            localStorage.setItem(JSON.stringify(userObject));
        });
    }
    else localStorage.setItem(JSON.stringify(userObject));
}

function storeEventData(eventObject) {
    console.log('inserting: '+JSON.stringify(eventObject));
    console.log("HERE");
    initialise();
    console.log(dbPromise);
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(EVENT_STORE_NAME, 'readwrite');
            var store = tx.objectStore(EVENT_STORE_NAME);
            await store.put(eventObject);
            return tx.complete;
        }).then(function () {
            console.log('added event to the store! '+ JSON.stringify(eventObject));
        }).catch(function (error) {
            localStorage.setItem(JSON.stringify(eventObject));
        });
    }
    else localStorage.setItem(JSON.stringify(eventObject));
}


function storeStoryData(storyObject) {
    console.log('inserting: '+JSON.stringify(storyObject));
    console.log("HERE");
    initialise();
    console.log(dbPromise);
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(STORY_STORE_NAME, 'readwrite');
            var store = tx.objectStore(STORY_STORE_NAME);
            await store.put(storyObject);
            return tx.complete;
        }).then(function () {
            console.log('added story to the store! '+ JSON.stringify(storyObject));
        }).catch(function (error) {
            localStorage.setItem(JSON.stringify(storyObject));
        });
    }
    else localStorage.setItem(JSON.stringify(storyObject));
}

function getAllEventData() {
    initialise();
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction(EVENT_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENT_STORE_NAME);
            return store.getAll();
        }).then(function (readingsList) {
            console.log(readingsList);
            if (readingsList && readingsList.length>0){
                for (var elem of readingsList)

                    addToResults(elem);
                    updateMap(elem, readingsList);


            } else {
                noEventResults();
                // COME FIX SATURDAYTSHG
                updateMap(elem, readingsList);
                    addToEventList(elem);
            }
        });
    }
}

function getAllStoryData(id) {
    console.log('getallstories');
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

function getEvent(id) {
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

function getLogin(email, password) {
    initialise();
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log("Checking: " + email);
            var tx = db.transaction(USER_STORE_NAME, 'readonly');
            var store = tx.objectStore(USER_STORE_NAME);
            return store.getAll();
        }).then(function (readingsList) {
            for (var elem of readingsList) {
                if (elem.loginEmail == email) {
                    emailFound = elem;
                }
            }
            if (emailFound && emailFound.loginPassword == password) {
                alert("YEA FUCKING BOI");
            }
            else {
                alert("you fucked it");
            }

        });
    }
}