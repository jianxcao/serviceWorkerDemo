// 注意这个js不是在刷新页面的时候就一定调用，如果当前的serviceWorker处于 active状态，即已经安装过，但是又没有改变，则不会调用这个js
this.addEventListener('fetch', function () {
	console.log('sw fetch');
	//  显示一个通知 -- 为了测试放在这里
	// 不知道为啥，chrome在 mac的全屏下通知出不来，必须退出才出现
	// 非常有用的广告，即使浏览器最小化也可以显示这个通知
	// 通知demo
	// https://tests.peter.sh/notification-generator/#notificationCloseEvent=true 
	var result = self.registration.showNotification('测试', {
		actions: [{
			action: 'yes',
			title: '我选择是'
		},{
			action: 'no',
			title: '我选择不'
		}],
		body: "hello, 欢迎使用",
		requireInteraction: true,
		icon: 'http://caipiao.163.com/favicon.ico',
		dir: 'rtl',
		data: {
			test: 'hi'
		},
		vibrate: [100, 100, 300]
		// image: 'http://pimg1.126.net/caipiao/img/service-24_33e2b60.png'
	})
	.then(function (result) {

	});
	console.log('所有通知', self.registration.getNotifications().then(function (...arg) {
		console.log(...arg);
	}));	
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

self.addEventListener('notificationclose', function (e) {
	console.log(e.notification);
	e.notification.close();
	
});

self.addEventListener('notificationclick', function (e) {
	console.log(e.notification);
	console.log('data', e.notification.data);
	e.notification.close();
});

this.addEventListener('message', function (evt) {
	console.log('SW message', evt.data);
});

//  当前的this是  ServiceWorkerGlobalScope
console.log('child', this);
