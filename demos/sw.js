this.addEventListener('fetch', function () {
	console.log('sw fetch');
});
this.addEventListener('activate', function () {
	console.log('sw activate');
	// 不带匹配条件，获取所有client，发送一个消息出去
	self.clients.matchAll()
	.then(clients => {
		if (clients && clients.length) {
			clients.forEach(function (client) {
				console.log(client, client.url);
				client.postMessage("client message");
			});
		}
	});
});



this.addEventListener('message', function (evt) {
	console.log('SW message', evt.data);
});



//  当前的this是  ServiceWorkerGlobalScope
console.log('child', this);

