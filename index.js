const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://kian:admin@cluster0-ypndi.mongodb.net/admin?retryWrites=true&w=majority";
const DATABASE_NAME = "ilpmo";

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

})

/**
 * Authenticates a username/pw combo for login.
 */
app.get('/authenticateUser/:username/:password', (req, res) => {
    collection.findOne({"username": req.params.username}, (error, result) => {
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
app.post('/pay', (req, res) => {
    
})

/**
 * Allows a user to create a new ledger account to their 
 * list of stored accounts. 
 */
app.post('/addUserAccount', (req, res) => {
    // adds a user account to a user
})

/**
 * Allows a user to add a friend to their list of friends
 * in our DB. 
 */
app.post('/addFriend', (req, res) => {
    
})

app.post("/person", (request, response) => {
    collection.insertOne({ username: "ff" }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});