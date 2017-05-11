// Public Key
// BFFJZLdJUVUmiIwN7yrh2--UwtsMU0-aUMG9WGJKrgi5aWV4EEO_-YZqjldi7Gq_eU31nvv2DA1dYL9-KuK6yHI

// Private Key
// 5WouM-hdIqEutyPqxhkaHK-YgvfnOyXF9UEBsMgIBbE

// push address https://web-push-codelab.appspot.com/?hl=zh-cn
var applicationServerPublicKey = 'BFFJZLdJUVUmiIwN7yrh2--UwtsMU0-aUMG9WGJKrgi5aWV4EEO_-YZqjldi7Gq_eU31nvv2DA1dYL9-KuK6yHI';
var pushButton = document.querySelector('#message');
// 首先检测浏览器是否支持serviceWorker和PushManager
if ('serviceWorker' in navigator && 'PushManager' in window) {
	// 注册 serviceWorker
	navigator.serviceWorker.register('sw.js')
	.then(init)
	.catch(function (error) {
		console.error('注册serviceWorker出错', error);
		pushButton.disabled = true;
	});
} else {
	// 不支持的情况
	pushButton.innerHTML = "不支持";
	pushButton.disabled = true;
}

// 消息初始化使用
function init (registration) {
	console.log(registration);
	// 注册者对象上的pushManger负责解析返回当前的订阅者
	registration.pushManager
	// 获取订阅者
	.getSubscription()
	.then(function (subscription) {
		console.log(subscription);
		console.dir(JSON.stringify(subscription));
		console.log(subscription.toJSON());
		// 如果没有订阅，这里subscription为null
		var isSubscription = subscription !== null;
		pushButton.innerHTML = isSubscription ? '取消订阅' : '订阅消息';
		pushButton.isSubscription = isSubscription;
	});
};

evtInit();
// 订阅按钮事件初始化
function evtInit () {
	pushButton.addEventListener('click', function () {
		if (pushButton.isSubscription) {
			unSubscribeUser();
		} else {
			subscribeUser();
		}
	});
}

// 订阅消息
function subscribeUser() {
	var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	navigator.serviceWorker.getRegistration()
	.then(function (registration) {
		registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey
		});
	})
	.then(function (subscription) {
		pushButton.innerHTML = '取消订阅';
		pushButton.isSubscription = true;
	})
	.catch(function (error) {
		pushButton.innerHTML = '订阅消息';
		pushButton.isSubscription = false;
		console.log('订阅消息出错', error);
	});
};

// 取消订阅
function unSubscribeUser () {
	navigator.serviceWorker.getRegistration()
	.then(function (registration) {
		registration.pushManager
		// 获取订阅者
		.getSubscription()	
		.then(function(subscription) {
			console.log(subscription);
			if (subscription) {
				return subscription.unsubscribe();
			}
		})
		.then(function () {
			pushButton.innerHTML = '订阅消息';
			pushButton.isSubscription = false;			
		})
		.catch(function(error) {
			console.error('取消订阅出错', error);
		});
	});
}

function urlB64ToUint8Array(base64String) {
	var padding = '='.repeat((4 - base64String.length % 4) % 4);
	var base64 = (base64String + padding)
	.replace(/\-/g, '+')
	.replace(/_/g, '/');
	var rawData = window.atob(base64);
	var outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};
