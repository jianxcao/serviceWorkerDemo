# 如何创建一个serviceWorker

serviceWorker通过[ServiceWorkerContainer](./ServiceWorkerContainer.md)接口创建

`navigator.serviceWorker`是`ServiceWorkerContainer `的一个实例

通过`navigator.serviceWorker.register`去注册一个serviceWorker,将返回一个promise，promise参数[ServiceWorkerRegistration](./ServiceWorkerRegistration.md)

如:

``` javascript
    // 通过register方法注册一个 serviceWorker
    // scope是指在哪些url下该serviceWorker生效
    // 注册后返回promise对象
    // promise 对象参数是 ServiceWorkerRegistration的一个实例
    // 通过ServiceWorkerRegistration的实例，获取serviceWorker实例
    navigator.serviceWorker.register('service-worker.js', {
        scope: './'
    }).then(function (registration) {
        var serviceWorker;
        if (registration.installing) {
            serviceWorker = registration.installing;
            document.querySelector('#kind').textContent = 'installing';
        } else if (registration.waiting) {
            serviceWorker = registration.waiting;
            document.querySelector('#kind').textContent = 'waiting';
        } else if (registration.active) {
            serviceWorker = registration.active;
            document.querySelector('#kind').textContent = 'active';
        }
    }).catch (function (error) {
        // 注册出现错误，可能是serviceWorker中有语法错误，或者其他一些不可捕获的错误
    });
```

注意 serviceWorker需要https协议才能运行，在本地测试可以用localhost，上线必须是https协议才可以
