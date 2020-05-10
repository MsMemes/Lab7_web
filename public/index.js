
const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function getAllBookmarks() {

	let url = '/bookmarks';
	let settings = {
		method : 'GET',
		headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
	}

	let results = document.querySelector('.results');

	fetch( url, settings )
		.then( response => {
			if( response.ok){
				return response.json();
			}
			else{
				throw new Error( response.statusText);
			}
		})
		.then (responseJSON => {
			results.innerHTML = "";
			for(let i = 0; i < responseJSON.length; i++){
				results.innerHTML += `
				<div class="item">
					<div class="title">
						${responseJSON[i].title}
					</div>
					<div class="datos">
						<div>
						${responseJSON[i].id}
						</div>
						<div>
						${responseJSON[i].description}
						</div>
						<div>
						${responseJSON[i].url}
						</div>
						<div>
						${responseJSON[i].rating}
						</div>
					</div>
				</div>
				`
			}
		})
		.catch( err => {
			results.innerHTML = err.message;
		});
}

function fetchAddBookmark(title, description, url, rating) {
	let urlApi = '/bookmarks';

	let data = {
		title : title,
		description : description,
		url : url,
		rating : rating
	}

	let settings = {
		method : 'POST',
		headers : {
			Authorization : `Bearer ${API_TOKEN}`,
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify( data )
	}

	let results = document.querySelector('.results');

	fetch( urlApi, settings )
	.then( response =>{
		if(response.ok){
			return response.json();
		}
		else {
			throw new Error( response.statusText );
		}
	})
	.then(responseJSON =>{
		getAllBookmarks();
	})
	.catch( err => {
		results.innerHTML = err.message;
	})
}

function fetchBookmarlTitle(title) {
	let urlApi = `/bookmark?title=${title}`;

	let settings = {
		method : 'GET',
		headers : {
			Authorization : `Bearer ${API_TOKEN}`,
		},
	}

	let results = document.querySelector('.results');

	fetch( urlApi, settings )
		.then( response => {
			if( response.ok){
				return response.json();
			}
			else{
				throw new Error( response.statusText);
			}
		})
		.then( responseJSON =>{
			results.innerHTML = "";
			for(let i = 0; i < responseJSON.length; i++){
				results.innerHTML += `
				<div class="item">
					<div class="title">
						${responseJSON[i].title}
					</div>
					<div class="datos">
						<div>
						${responseJSON[i].description}
						</div>
						<div>
						${responseJSON[i].url}
						</div>
						<div>
						${responseJSON[i].rating}
						</div>
					</div>
				</div>
				`
			}
		})
		.catch( err => {
			results.innerHTML = err.message;
		});

}

function fetchDeleteBookmark(id) {
	let url = `/bookmark/${id}`;

	let settings = {
		method : 'DELETE',
		headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
	}

	let results = document.querySelector('.results');

	fetch(url, settings )
	.then( response => {
		if( response.ok){
			return response;
		}
		else{
			throw new Error( response.statusText);
		}
	})
	.then( responseJSON => {
		
		getAllBookmarks();
	})
	.catch( err => {
		console.log("here");
		results.innerHTML = err.message;
	});
}

function fetchUpdateBookmark(id, newBookmark) {
	let urlApi = `/bookmark/${id}`;

	let settings = {
		method : 'PATCH',
		headers : {
			Authorization : `Bearer ${API_TOKEN}`,
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify( newBookmark )
	}

	let results = document.querySelector('.results');

	fetch( urlApi, settings )
	.then(response => {
		if(response.ok){
			return response.json();
		}
		else{
			throw new Error (response.statusText);
		}
	})
	.then(responseJSON => {
		getAllBookmarks();
	})
	.catch( err => {
		results.innerHTML = err.message;
	});
}

function FormAddBookmark() {

	let addBookmarkForm = document.querySelector('.addBookmark');

	addBookmarkForm.addEventListener( 'submit', ( event ) => {
		event.preventDefault();
		let title = document.getElementById("AbookmarkT").value;
		let description = document.getElementById("AbookmarkD").value;
		let url = document.getElementById("AbookmarkU").value;
		let rating = document.getElementById("AbookmarkR").value;

		console.log(title, description, url, rating);

		fetchAddBookmark(title, description, url, rating);
	})
	
}

function FormGetBookmarkTitle() {
	let searchBookmarkForm = document.querySelector('.bookmarkTitle');

	searchBookmarkForm.addEventListener( 'submit' , (event) => {
		event.preventDefault();
		let title = document.getElementById( 'SbookmarkTitle' ).value;
		fetchBookmarlTitle(title);
	})
	
}

function FormDeleteBookmark() {

	let deleteBookmarkForm = document.querySelector('.deleteBookmark');
	console.log("here");

	deleteBookmarkForm.addEventListener( 'submit', ( event ) => {
		event.preventDefault();
		let id = document.getElementById('DbookmarkI').value;
		console.log(id);
		fetchDeleteBookmark(id);
	})
	
}

function FormUpdateBookmark() {
	let updateForm = document.querySelector(".updateBookmark");

	updateForm.addEventListener( 'submit', (event) => {
		event.preventDefault();
		let id = document.getElementById('UbookmarkID').value;
		let title = document.getElementById('UbookmarkT').value;
		let description = document.getElementById('UbookmarkD').value;
		let url = document.getElementById('UbookmarkU').value;
		let rating = document.getElementById('UbookmarkR').value;

		let newBookmark = {id};

		if(title){
			newBookmark.title = title;
		}
		if(description){
			newBookmark.description = description;
		}
		if(url){
			newBookmark.url = url;
		}
		if(rating){
			newBookmark.rating = rating;
		}

		fetchUpdateBookmark(id, newBookmark);
	})
	
}

function init() {
	getAllBookmarks();
	FormAddBookmark();
	FormGetBookmarkTitle();
	FormDeleteBookmark();
	FormUpdateBookmark();
}

init();