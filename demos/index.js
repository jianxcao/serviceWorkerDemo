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
			console.log('ready', registration);
			//  发送一个消息给 sw
			if (registration.active) {
				registration.active.postMessage('sw hello');
			}
		});
		// 打印controller
		console.log('controller', navigator.serviceWorker.controller);	
	} else {
		alert('浏览器不支持 serviceworker');
	}
};

function serviceEvt () {
	serviceWorker.addEventListener('oncontrollerchange', function () {
		console.log('sw oncontrollerchange triggerd');
	});

	serviceWorker.addEventListener('message', function (evt) {
		console.log('sw serviceWorker message triggerd', evt.data);
	});	
}

serviceEvt();
serviceReg();

