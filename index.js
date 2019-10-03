const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const CONNECTION_URL = "mongodb+srv://kian:admin@cluster0-ypndi.mongodb.net/admin?retryWrites=true&w=majority";
const DATABASE_NAME = "ilpmo";

const connectorAdminUrl = "https://connector1.localtunnel.me";

var app = Express();

var database, collection;

app.listen(3000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("users");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});
/**
 * Creates a user on initial login; stores their credentials
 * in our DB. 
 */
app.post('/createUser', (req, res) => {

});

/**
 * Authenticates a username/pw combo for login.
 */
app.get('/authenticateUser', (req, res) => {

});

/**
 * Allows a user to pay another user; user must specify
 * recipient's username and payment amount.
 */
app.post('/pay', (req, res) => {
    
});

/**
 * Allows a user to create a new ledger account to their 
 * list of stored accounts. 
 */
app.post('/addUserAccount', (req, res) => {
    // adds a user account to a user
});

/**
 * Allows a user to add a friend to their list of friends
 * in our DB. 
 */
app.post('/addFriend', (req, res) => {
    
});

app.post("/createuser/:username/:password", (req, res) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", connectorAdminUrl + '/accounts', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer admin-token-9e1048f4a566a01193810ec474ec819e1c7baf59');
    xhr.onload = function() {
        collection.insertOne({ username: req.params.username, password: req.params.password }, (error, result) => {
            if(error) {
                return res.status(500).send(error);
            }
            res.send(result.result);
        });
    };
    xhr.onerror = function () {
        res.status(500).send(xhr.response);
    }
    xhr.send(JSON.stringify({
            "username": req.params.username,
            "asset_code": "ABC",
            "asset_scale": 9
        }
    ));
});