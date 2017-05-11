this.addEventListener('fetch', function () {
	console.log('fetch');
});

this.addEventListener('message', function (evt) {
	console.log('ws1 receive message', evt.data);
});
