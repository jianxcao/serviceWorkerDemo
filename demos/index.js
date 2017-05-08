var logEle = document.querySelector('#log');
var serviceWorker = navigator.serviceWorker;
function serviceReg () {
	if ('serviceWorker' in navigator) {
		// 通过ServiceWorkerContainer注册一个 serviceWorker
		serviceWorker
		.register('sw.js', {
			// 该serviceWorker的作用范围
			scope: './'
		})
		.then(function (registration) {
			console.log(registration);
			var worderInstance;
			if (registration.installing) {
				worderInstance = registration.installing;
				logEle.textContent = 'installing';
			} else if (registration.waiting) {
				worderInstance = registration.waiting;
				logEle.textContent = 'waiting';
			} else if (registration.active) {
				worderInstance = registration.active;
				logEle.textContent = 'active';
			}
			if (worderInstance) {
				worderInstance.addEventListener('statechange', function (e) {
					console.log(e.target.state);
				});
			}
		})
		.catch(function (error) {});
		// ready是一个promise，如果  navigator状态为  active则解决
		serviceWorker.ready
		.then(function (registration) {
			// 准备好后 参数是是 ServiceWorkerRegistration
			console.log('ready', registration);
			// 打印serviceWoker的scope
			console.log('registration scope', registration.scope);
			//  发送一个消息给 sw
			if (registration.active) {
				registration.active.postMessage('sw hello');
			}
			// 获取注册者
			console.log('getRegistration', serviceWorker.getRegistration());
			// 获取注册者们
			console.log('getRegistrations', serviceWorker.getRegistrations());
			// 消息推送接口
			console.log('pushManager', registration.pushManager);
		});
		// 打印controller
		console.log('controller', navigator.serviceWorker.controller);	
	} else {
		alert('浏览器不支持 serviceworker');
	}
};

function serviceEvt () {
	serviceWorker.addEventListener('controllerchange', function (evt) {
		console.log('sw oncontrollerchange triggerd', evt);
	});

	serviceWorker.addEventListener('message', function (evt) {
		console.log('sw serviceWorker message triggerd', evt.data);
	});	
}

serviceEvt();
serviceReg();

// Notification // 通知对象
// 注意这里应该有权限问题，如果没有权限，需要先申请权限
window.addEventListener('load', function () {
	document.querySelector('#test').onclick = function () {
		show();
	};
	function show () {
		// 直接显示一个通知
		// 不一定支持，有的手机有这个api不让掉，会抛出错误
		// 建议在serviceWorker中使用

		if (window.Notification && Notification.permission === "granted") {
			try {
				var notify = new Notification('牛逼', {
					body: '你好啊',
					tag: 'test',
					'renotify': true,
					requireInteraction: true
				});
				notify.onshow = function () {
					console.log('show');
				};
				notify.onclick = function (e) {
					console.log('你好被点击了');
					e.target.close();
				};
			} catch(e) {
				alert(e.message);
			}
		} else if (window.Notification && Notification.permission !== "denied") {
			// 没有权限再次请求
			Notification.requestPermission(function (status) {
				if (status === "granted") {
					var notify = new Notification('牛逼', {
						body: '你好啊'
					});
					notify.onclick = function (e) {
						console.log('你好被点击了');
						e.target.close();
					};
				} else {
					alert("Hi!");
				}
			});
		} else {
			alert('hi');
		}		
	}
});
