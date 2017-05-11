var CACHE_NAME  = 'first_cache';
var urlsToCache = [
	'test.js'
];
self.addEventListener('install', function(event) {
  // 确保安装成功
  event.waitUntil(
	// 打开一个缓存
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('已经打开了', cache);
		// 增加缓存
        return cache.addAll(urlsToCache);
      })
  );
}); 


// 注意这个js不是在刷新页面的时候就一定调用，如果当前的serviceWorker处于 active状态，即已经安装过，但是又没有改变，则不会调用这个js
self.addEventListener('fetch', function () {
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


self.addEventListener('fetch', function (event) {
	// event.request一个请求对象，里面具体包括请求头，请求url等信息
	console.log('fetch', event.request);
	event.respondWith(caches.match(event.request)
	.then(function (response) {
		// 如果这个请求已经在cache中存在
		// response表示响应，通常数据都在response中得body属性中
		if (response) {
			console.log('response', response);
			// 直接返回响应的数据
			console.log(response.url + "--的数据是通过缓存获取的");
			return response;
		}
		// 直接去请求-- 这里就直接向服务器请求数据了
		// 这里的fetch直接访问真实数据，如果不出错就resolve，否则就拒绝了

		// 这里我们必须clone一些request对象，因为这里面的数据只能读取一次，类似流，而我们这里需要读取2次，一次给请求，一次是放入缓存
		cloneReq = event.request.clone();
        return fetch(event.request)
		.then(function (response) {
			// 获取response的状态必须是成功的 - 不是200得，或者basic的请求就不缓存了
			if(!response || response.status !== 200 || response.type !== 'basic') {
				return response;
			}
			// response也是需要clone的因为也要用2次，一次给页面用，一次给缓存用
			var cloneRes = response.clone();
			// 打开我们的缓存
			caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log(cloneReq.url + " 的数据被放入了缓存 " + CACHE_NAME + "下");
				cache.put(cloneReq, cloneRes);
			});
			return response;
		})
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
