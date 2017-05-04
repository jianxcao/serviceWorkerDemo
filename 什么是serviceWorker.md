# 什么是serviceWorker



本质上来讲serviceWorker是一个独立的运行于浏览器后台的线程，它继承自[Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker)类


即是一个`Worker`类,则具备Worker类得特性，它不能够直接访问window上的一些属性,也不能操作dom，是一个独立的单元，可以与页面通过`postMessage`通讯


## 具体功能
- 离线缓存 (实现项目在脱离网络的状态下依旧可以使用部分功能)
- 消息推送 (可以像app一样给用户推送一些消息，并通过[Notification](https://developer.mozilla.org/zh-CN/docs/Web/API/notification/Using_Web_Notifications)提示给用户)