# 什么是serviceWorker

本质上来讲serviceWorker是一个独立的运行于浏览器后台的线程，它继承[Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker)类的属性


## 具体功能
- 离线缓存 (实现项目在脱离网络的状态下依旧可以使用部分功能)
- 消息推送 (可以像app一样给用户推送一些消息，并通过[Notification](https://developer.mozilla.org/zh-CN/docs/Web/API/notification/Using_Web_Notifications)提示给用户)


## 其他

在一个serviceWorker线程中不能够访问window对象, 当前的this是一个[ServiceWorkerGlobalScope](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope)， 只能访问 [ServiceWorkerGlobalScope](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope)上的api

如 fetch indexedDB console postmessage 等
