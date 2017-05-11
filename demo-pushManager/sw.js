self.addEventListener('push', function(event) {
	console.log('[Service Worker] 收到消息');
	console.log(`[Service Worker] 消息内容: "${event.data.text()}"`);

	const title = '收到消息';
	const options = {
		body: event.data.text() || "默认值"
	};
	event.waitUntil(self.registration.showNotification('测试', {
		actions: [{
			action: 'yes',
			title: '我选择是'
		},{
			action: 'no',
			title: '我选择不'
		}],
		body: event.data.text() || "hello, 欢迎使用",
		icon: 'http://caipiao.163.com/favicon.ico'
	}));
});

self.addEventListener('notificationclick', function(event) {
	console.log('[Service Worker] 通知被点击了.');
	event.notification.close();
});
