# ServiceWorkerContainer
ServiceWorkerContainer 接口主要是提供ServiceWorker Api的管理，针对ServiceWorker提供一整套系统的管理方法和创建方法，状态查询方法, 其中包括ServiceWorker 的注册，更新 和访问 状态，一起他们得注册者

## 属性
`ServiceWorkerContainer.controller`

返回一个 ServiceWorker对象，并且该 ServiceWorker是激活状态,在强制 刷新下或者没有激活的 ServiceWorker，这个属性返回空

`ServiceWorkerContainer.ready`

返回一个promise，在有serviceWorker准备好的时候，即serviceWorker状态为active得时候，该promise为解决，否则一直是pending状态

## 事件

`ServiceWorkerContainer.oncontrollerchange`

`oncontrollerchange` 事件主要是在当前ServiceWorkerRegistration.active，即当前状态是active的serviceWorker发生变化的时候触发，多是一个网站有过个serviceWorker切换的时候触发

``` javascript
 navigator.serviceWorker.addEventListener('oncontrollerchange', function (evt) {
    console.log(evt);
 });
```

`ServiceWorkerContainer.onmessage`

## 方法

ServiceWorkerContainer.register() 
Creates or updates a ServiceWorkerRegistration for the given scriptURL.
ServiceWorkerContainer.getRegistration()
Gets a ServiceWorkerRegistration object whose scope URL matches the provided document URL.  If the method can't return a ServiceWorkerRegistration, it returns a Promise. 
ServiceWorkerContainer.getRegistrations()
Returns all ServiceWorkerRegistrations associated with a ServiceWorkerContainer in an array.  If the method can't return ServiceWorkerRegistrations, it returns a Promise. 
