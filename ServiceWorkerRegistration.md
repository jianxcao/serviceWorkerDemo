# ServiceWorkerRegistration
ServiceWorkerRegistration 主要是标记了serviceWorker的注册，每当通过[serviceWorkerContainer](./serviceWorkerContainer.md)注册一个serviceWorker

如果当一个新的 serviceworker注册进来的时候，浏览器将会保持旧得serviceWoker，新的同时也会处于等待状态，当浏览器重启的时候，旧得将会被移除，新的将取代

[MDN说明](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration)

## 属性

### `ServiceWorkerRegistration.scope `
返回唯一的一个注册的service worker的 scope，这个路径肯定是和 document url同源的

### `ServiceWorkerRegistration.installing`
返回一个正在安装得serviceWorker，如果已经安装则返回null,默认值也为null

### `ServiceWorkerRegistration.waiting `
返回一个serviceWorker的状态是等待状态，也是installed的状态, 如果没有就返回null

### `ServiceWorkerRegistration.active `
返回一个serviceWorker的状态是激活状态,如果没有就返回null

### `ServiceWorkerRegistration.pushManager `
返回一个用户消息推送的接口，用这个接口可以获得当前已经订阅的消息，及订阅新的消息，极查看消息订阅的状态权限



## 方法
### ServiceWorkerRegistration.getNotifications()
返回一个promise，promise解决后返回一个数组，数组里是 [Notification](https://developer.mozilla.org/en-US/docs/Web/API/Notification)对象,这里面的通知用户都没有点击关闭

### [notify测试demo](https://tests.peter.sh/notification-generator/)

### ServiceWorkerRegistration.showNotification(title, opt)
显示一个消息通知
#### 参数
以下参数很多在mobile上不支持，pc chrome基本上在 45以后才支持大多数属性，firefox很多现在也不支持，ie就算了吧
建议使用 titile body icon data几个有用的配置

- `opt [object]`通知的配置
- `title [string]`通知的标题
- `actions [Array]` 一个数组标记了当前通知的显示，数组中得元素应该是一个对象，包括下面几个属性,每个选项包括用户的一个选择行为
    - `action` 一个dom字符串,表示显示内容
    - `title` 一个dom字符串表示title
    - `icon` 一个url表示当前图标
- `badge [string]`一个url，当在当前通知在页面显示不下的时候，比如在android中，这个时候会显示这个图片，这个图片应该用规定的尺寸大小
- `body [string]` 要提示的文本内容
- `dir [string]` 显示通知的方向，可以是 ltr或者rtl (用手机chrome测试)
- `icon [string]` 要提示的icon小图标,不能跨协议，否则报错
- `image [string]` 要显示在通知中的图片,是一个url
- `lang [string]` 通知预设语言,设置字符串必须符合[BCP 47 language tag.
](https://tools.ietf.org/html/bcp47)
- `renotify` 是否再次提醒，这个属性在有相同tag的通知再次发生时候，控制这个通知是否有震动和声音的触发
- `requireInteraction` 在桌面版本chrome，通知出现后，如果是false，大约在20s后，通知会自动小化，如果是true则不会
- `tag String` 一个标记，标记这个notification,有了这个标记可以在getNotifications方法中找到这个通知，可以替换修改这个通知, 参数可以加tag过滤 如(registration.getNotifications({tag: 'test'}))， 过滤tag是test的通知
- `vibrate` 震动，有震动的设备可以调设备震动的频率，可以使数组或者数字，如果是数组偶数表示震动的时间长度，奇数表示停止的时间长度，单位是毫秒
- `data [any]` 可以使任意数据，与当前的通知关联,在通知被点击后会传递到event中
- `timestamp` 在android设备上，会默认在右上角显示一个通知出现的时间,这个参数可以改变这个时间

### ServiceWorkerRegistration.update()
忽略缓存更新一个 serviceWorker

### ServiceWorkerRegistration.unregister()
在当serviceWoker完成工作后，移除serviceWorker，即在调用该方法后不是马上就移除，而是serviceWorker完成处理，比如处理完消息，在去移除，返回值是一个promise，如果移除成功，则解决promise
