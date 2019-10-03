const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const CONNECTION_URL = "mongodb+srv://kian:admin@cluster0-ypndi.mongodb.net/admin?retryWrites=true&w=majority";
const DATABASE_NAME = "ilpmo";

const connectorInfo= {
    'connector1':'admin-token-0a578dcba98f9b9ea124af1961422a18258087de',
    'connector2':'admin-token-145609b8fcd2489420e118493bda47dc4e93ea56'
}

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
app.post("/createuser/:username/:password", (req, res) => {
    collection.insertOne({
        username: req.params.username,
        password: req.params.password,
        ilp_address: null,
        accounts: []

    }, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result.result);
    });
});
/**
 * Authenticates/gets a username/pw combo for login.
 */
app.get('/authenticateUser/:username/:password', (req, res) => {
    collection.findOne({"username": req.params.username,
                        "password": req.params.password}, (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(result)
    })
})

/**
 * Allows a user to pay another user; user must specify
 * recipient's username and payment amount.
 */
app.post('/pay/:recipientusername/:userconnectorname/:amount', (req, res) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", connectorAdminUrl + `/accounts/${req.params.userconnectorname}/payments`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer admin-token-145609b8fcd2489420e118493bda47dc4e93ea56');

    xhr.onerror = function () {
        res.status(500).send(xhr.response);
    };
    xhr.send(JSON.stringify({
            "receiver": req.params.recipientusername,
            "source_amount": req.params.amount
        }
    ));
});

/**
 * Allows a user to create a new ledger account to their 
 * list of stored accounts. 
 */
app.post('/addUserAccount/:webusername/:webpassword/:ilpusername/:assetcode/:whichConnector', (req, res) => {
    const whichConnector = req.params.whichConnector;

    const connectorAdminUrl = "https://" + whichConnector +".localtunnel.me/";
    // adds a user account to a user
    const xhr = new XMLHttpRequest();
    xhr.open("POST", connectorAdminUrl + '/accounts', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + connectorInfo[whichConnector]);
    xhr.onload = function() {
        console.log('account creation...');
        collection.replaceOne({
            username: req.params.webusername,
            password: req.params.webpassword,
        }, {
            $push: {
                accounts: req.params.ilpusername
            }
        }).then(result => {
            if(result) {
                res.send(`Successfully found document: ${result}.`)
            } else {
                res.send("No document matches the provided query.")
            }
        });
    };
    xhr.onerror = function () {
        res.status(500).send(xhr.response);
    };
    xhr.send(JSON.stringify({
            "username": req.params.ilpusername,
            "asset_code": req.params.assetcode,
            "asset_scale": 9
        }
    ));
});

app.get('/getUserAccounts/:webusername/:webpassword', (req, res) => {
    const whichConnector = req.params.whichConnector;

    const connectorAdminUrl = "https://" + whichConnector +".localtunnel.me/";
    collection.findOne({
        username: req.params.webusername,
        password: req.params.webpassword,
    }).then(result => {
        if(result) {
            console.log(`Successfully found document: ${result}.`)
            res.send(result.accounts);
        } else {
            console.log("No document matches the provided query.")
        }
    });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", connectorAdminUrl + '/accounts', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + connectorInfo[whichConnector]);
    xhr.onload = function() {

    };
    xhr.onerror = function () {
        res.status(500).send(xhr.response);
    };
    xhr.send(JSON.stringify({
            "username": req.params.ilpusername,
            "asset_code": req.params.assetcode,
            "asset_scale": 9
        }
    ));
});


/**
 * Allows a user to add a friend to their list of friends
 * in our DB. 
 */
app.post('/addFriend', (req, res) => {
    
});

