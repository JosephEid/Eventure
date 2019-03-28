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
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
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
            }
        });
    }
}