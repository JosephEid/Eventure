var dbPromise;

const EVENTURE_DB_NAME = 'db_eventure';
const USER_STORE_NAME = 'store_users';
const EVENT_STORE_NAME = 'store_events';
const STORY_STORE_NAME = 'store_stories';

/**
 * it inits the database
 */
function initDatabase(){
    dbPromise = idb.openDb(EVENTURE_DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(USER_STORE_NAME)) {
            var eventureDB = upgradeDb.createObjectStore(USER_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            //eventureDB.createIndex('location', 'location', {unique: false, multiEntry: true});
        }
        if (!upgradeDb.objectStoreNames.contains(EVENT_STORE_NAME)) {
            var eventureDB = upgradeDb.createObjectStore(EVENT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            //eventureDB.createIndex('location', 'location', {unique: false, multiEntry: true});
        }
        if (!upgradeDb.objectStoreNames.contains(STORY_STORE_NAME)) {
            var eventureDB = upgradeDb.createObjectStore(STORY_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            //eventureDB.createIndex('location', 'location', {unique: false, multiEntry: true});
        }
    });
}

function storeUserData(userObject) {
    console.log('inserting: '+JSON.stringify(userObject));
    if (dbPromise) {
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

function getAllEventData() {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching all events:');
            var tx = db.transaction(EVENT_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENT_STORE_NAME);
            //var index = store.index('location');
            return store.getAll();
        }).then(function (readingsList) {
            if (readingsList && readingsList.length>0){
                var max;
                for (var elem of readingsList)
                    if (!max || elem.date>max.date)
                        max= elem;
                if (max) addToResults(max);
            } else {
                const value = localStorage.getItem(city);
                if (value == null)
                    addToResults({city: city, date: date});
                else addToResults(value);
            }
        });
    } else {
        const value = localStorage.getItem(city);
        if (value == null)
            addToResults( {city: city, date: date});
        else addToResults(value);
    }
}