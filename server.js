const express = require( 'express' );
const uuidv4 = require("uuid/v4");
const bodyParser = require('body-parser');
const morgan = require( 'morgan' );

const app = express();
const jsonParser = bodyParser.json();
const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

app.use( morgan( 'dev' ) );



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

app.use( validate );

let bookmarks = [
    {
        id : uuidv4(),
        title : "The Name of the Wind",
        description : "Told in Kvothe's own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.",
        url : "www.thenameofthewind.com",
        rating : 4.54
    },
    {
        id : uuidv4(),
        title : "The Ways of Kings",
        description : "The age before the Heralds abandoned us and the Knights Radiant turned against us. A time when there was still magic in the world and honor in the hearts of men.",
        url : "www.thewaysofkings.com",
        rating : 4.65
    }
];

app.get( '/bookmarks', ( req, res ) => {

    return res.status( 200 ).json( bookmarks );
});

app.get( '/bookmark', ( req, res ) => {

    let title = req.query.title;

    if ( !title ){
        res.statusMessage = "Please send the title as parameter";
        return res.status( 406 ).end();
    }

    let result = bookmarks.find( ( bookmark ) => {
        if( bookmark.title === title){
            return bookmark;
        }
    });

    console.log(result);

    if( !result ){
        res.statusMessage = "This title was not found";
        return res.status( 404 ).end();
    }

    return res.status( 200 ).json(result);
});

app.post( '/bookmarks', jsonParser, ( req, res ) =>{
    
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if( !title || !description || !url || !rating ){
        res.statusMessage = "Please send all the fields";
        return res.status( 406 ).end();
    }
    
    bookmarks.find( (bookmark) => {
        if(bookmark.title === title){
            res.statusMessage = "This bookmark already exist";
            return res.status( 409 ).end();
        }
    });

    let id = uuidv4();
    let newBookmark = { id, title, description, url, rating}
    bookmarks.push( newBookmark );

    return res.status( 201 ).json( newBookmark );
});

app.delete('/bookmark/:id', (req, res) =>{

    console.log( req.params );
    let id = req.params.id;

    console.log(id);

    if( !id ){
        res.statusMessage = "Please send the 'id' to delete a bookmark";
        return res.status( 406 ).end();
    }

    let itemToRemove = bookmarks.findIndex( ( bookmark ) => {
        if( bookmark.id === id ){
            return true;
        }
    });

    if( itemToRemove < 0 ){
        res.statusMessage = "That 'id' was not found in the list of students.";
        return res.status( 404 ).end();
    }

    bookmarks.splice( itemToRemove, 1 );
    return res.status( 200 ).end();
});

app.patch('/bookmark/:id', jsonParser, (req, res ) => {
    
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;
    let id = req.params.id;
    if( !id ){
        res.statusMessage = "Please send the 'id'";
        return res.status( 406 ).end();
    }

    let result = bookmarks.find( (bookmark) => {
        if(bookmark.id === id){
            return bookmark;
        }
    });

    if( !result ){
        res.statusMessage = "There is no bookmark with the id passed";
        return res.status( 409 ).end();
    }

    if(title){
        result.title = title
    }

    if(description){
        result.description = description;
    }

    if(url){
        result.url = url;
    }

    if(rating){
        result.rating = rating;
    }

    return res.status( 202 ).json(result);
})

app.listen( 8080, () => {
    console.log( 'This server is running on port 8080' );
});


//htpp://localhost:8080/

