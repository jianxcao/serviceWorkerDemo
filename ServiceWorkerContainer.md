# ServiceWorkerContainer
ServiceWorkerContainer 接口主要是提供ServiceWorker Api的管理，针对ServiceWorker提供注册方法，移除注册，状态查询方法, 其中包括ServiceWorker的注册，更新，访问状态，以及它们的注册者[ServiceWorkerRegistration](ServiceWorkerRegistration.md)

`navigator.serviceWorker`是ServiceWorkerContainer的一个实例,可以使用这个实例去注册使用serviceWorker。


## 属性
`ServiceWorkerContainer.controller`

返回一个 ServiceWorker对象，并且该 ServiceWorker是激活状态,在强制 刷新下或者没有激活的 ServiceWorker，这个属性返回null

`ServiceWorkerContainer.ready`

返回一个promise，在有serviceWorker准备好的时候，即serviceWorker状态为active得时候，该promise为解决，否则一直是pending状态

## 事件

`ServiceWorkerContainer.oncontrollerchange`

`controllerchange` 事件主要是在当前ServiceWorkerRegistration.active发生变化的时候，即当前状态是active的serviceWorker发生变化的时候触发。

``` javascript
 navigator.serviceWorker.addEventListener('controllerchange', function (evt) {
     // evt.target即 ServiceWorkerContainer的实例
    console.log(evt.target);
 });
```

`ServiceWorkerContainer.onmessage`

`message`事件在serviceWorker的client端postMessage的时候触发

``` javascript
 navigator.serviceWorker.addEventListener('message', function (evt) {
     // evt.data 即使数据，可以使对象
    console.log(evt.data);
 });
```


## 方法

### `ServiceWorkerContainer.register(scriptUrl, opt) `

注册方法，注册一个serviceworker
 
 #### 参数
 - scriptUrl [string] 表示当前serviceWorker的js的路径
 - opt [object] 表示配置，配置中scope表示当前serviceWorker的生效路径, 比如如果你当前serviceworker注册路径在/demo下，则只有在/demo下才会生效


### `ServiceWorkerContainer.getRegistration()`

根据当前网页的URL与当前service worker的scope Url的匹配，返回一个 [ServiceWorkerRegistration](./ServiceWorkerRegistration.md)对象,如果不能返回一个 [ServiceWorkerRegistration](./ServiceWorkerRegistration.md),则返回一个Promise。

### `ServiceWorkerContainer.getRegistrations()`

返回所有的[ServiceWorkerRegistration](./ServiceWorkerRegistration.md)对象，如果不能返回一个 [ServiceWorkerRegistration](./ServiceWorkerRegistration.md),则返回一个Promise。
