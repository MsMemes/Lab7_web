const express = require( 'express' );
const uuidv4 = require("uuid/v4");
const bodyParser = require('body-parser');
const morgan = require( 'morgan' );
const mongoose = require( 'mongoose' );
const app = express();
const jsonParser = bodyParser.json();
const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";
const { Bookmarks } = require( './bookmarkModel');
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ) );

function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,Authorization,content-type,application/json');
    if (req.method === "OPTIONS") {
        return res.send(204);
    }
    next();
}

function validate( req, res, next ){
    
    let token = req.headers.bookapikey;
    let tokenB = req.headers.authorization;
    let tokenP = req.query.apikey;
    let apikey = false;
    let bearer = false;
    let param = false;

    if(token === TOKEN){
        apikey = true;
    }
    else if (tokenP === TOKEN){
        param = true;
    }
    else if(tokenB === `Bearer ${TOKEN}`){
        bearer = true;
    }
    else {
        res.statusMessage = "The 'authorization' TOKEN is invalid.";
        return res.status( 401 ).end();
    }

    next();
}

app.use( cors );
app.use( validate );

app.get( '/bookmarks', ( req, res ) => {
    Bookmarks
    .getAllBookmarks()
    .then( result => {
        return res.status( 200).json( result );
    })
    .catch( err => {
        res.statusMessage = "Something went wrong with the DB";
        return res.status( 500 ).end();
    })
});

app.get( '/bookmark', ( req, res ) => {

    let title = req.query.title;

    if ( !title ){
        res.statusMessage = "Please send the title as parameter";
        return res.status( 406 ).end();
    }

    Bookmarks
    .getBookmark(title)
    .then( titleBookmark => {
        if(titleBookmark.length > 0){
            return res.status( 200 ).json(titleBookmark);
        }
        else{
            res.statusMessage = "This title was not found";
            return res.status( 404 ).end();
        }
    })
    .catch( err => {
        res.statusMessage = "Something went wrong with the DB";
        return res.status( 500 ).end();
    })

});

app.post( '/bookmarks', jsonParser, ( req, res ) =>{
    
    console.log(req.body);
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if( !title || !description || !url || !rating ){
        res.statusMessage = "Please send all the fields";
        return res.status( 406 ).end();
    }
    

    let id = uuidv4();
    const newBookmark = { id, title, description, url, rating }
    Bookmarks
        .createBookmark( newBookmark )
        .then( result => {
            return res.status( 201 ).json( result );
        })
        .catch( err => {
            res.statusMessage =  "Somethong went wrong with the DB";
            return res.status( 500 ).end();
        });

});

app.delete('/bookmark/:id', (req, res) =>{

    let id = req.params.id;

    if( !id ){
        res.statusMessage = "Please send the 'id' to delete a bookmark";
        return res.status( 406 ).end();
    }

    Bookmarks
    .deleteBookmark(id)
    .then(result => {
        if(result.deletedCount > 0){
            return res.status( 200 ).end();
        }
        else{
            res.statusMessage = "That 'id' was not found in the list of students.";
        return res.status( 404 ).end();
        }
    })
    .catch( err => {
        res.statusMessage =  "Somethong went wrong with the DB";
            return res.status( 500 ).end();
    })
});

app.patch('/bookmark/:id', jsonParser, (req, res ) => {
    
    let id = req.params.id;
    if( !id ){
        res.statusMessage = "Please send the 'id'";
        return res.status( 406 ).end();
    }

    const newItems = req.body;

    Bookmarks.updateBookmark(id, newItems)
    .then(result => {
        console.log(result);
        if(result.nModified > 0){
            return res.status( 202 ).json(result);
        }
        else{
            res.statusMessage = "There is no bookmark with the id passed";
        return res.status( 409 ).end();
        }
    })
    .catch( err => {
        res.statusMessage =  "Somethong went wrong with the DB";
            return res.status( 500 ).end();
    });
})

app.listen( 8080, () => {
    console.log( 'This server is running on port 8080' );

    const settings = {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true
    };

    new Promise( (resolve, reject) => {
        mongoose.connect( 'mongodb://localhost/bookmarksdb', settings, ( err ) => {
            if ( err ){
                reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err =>{
        mongoose.disconnect();
        console.log( err );
    });
});


//htpp://localhost:8080/

