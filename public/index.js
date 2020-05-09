const ApiKey = "2abbf7c3-245b-404f-9473-ade729ed4653";

function getAllBookmarks() {

	let url = 'http://localhost:8080/bookmarks';
	let settings = {
		method : 'GET',
		header : {
			Authorization : `Bearer ${ApiKey}`
		}
	}

	let results = document.querySelector('.resultsGetAll');

	fetch( url, settings )
		.then( response => {
			if( response.ok){
				return response.json();
			}
			else{
				console.log('here');
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
					<div class="datos>
						<p>
						${responseJSON[i].description}
						</p>
						<p>
						${responseJSON[i].url}
						</p>
						<p>
						${responseJSON[i].rating}
						</p>
					</div>
				</div>
				`
			}
		})
		.catch( err => {
			results.innerHTML = err.message;
		});
}

function init() {
	getAllBookmarks();
}

init();