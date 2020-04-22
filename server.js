const express = require( 'express' );

const app = express();

let bookmarks = [
    {
        id : 1234,
        title : "The Name of the Wind",
        description : "Told in Kvothe's own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.",
        url : "www.thenameofthewind.com",
        rating : 4.54
    },
    {
        id : 1235,
        title : "The Ways of Kings",
        description : "The age before the Heralds abandoned us and the Knights Radiant turned against us. A time when there was still magic in the world and honor in the hearts of men.",
        url : "www.thewaysofkings.com",
        rating : 4.65
    }
];

app.get( '/bookmarks', ( req, res ) => {
    console.log( "Getting all bookmarks" );

    return res.status( 200 ).json( bookmarks );
});

app.listen( 8080, () => {
    console.log( 'This server is running on port 8080' );
});


//htpp://localhost:8080/

