# 生命周期

在使用serviceWorker的时候，可能会碰到这样一种情况，旧的serviceWorker还在运行，即使serviceWorker的文件已经发生了变化,这主要是因为serviceWorker的生命周期导致,即使一个serviceWorker发生了变化，新的serviceWorker会安装，但是并不会立即生效，而是在下次启动浏览器才生效。


下面说说它的生命周期
Service Worker 一共有6种状态

- 解析成功（parsed）
- 正在安装（installing)
- 安装成功（installed）
- 正在激活（activating）
- 激活成功（activated）
- 废弃（redundant）

## 解析成功（parsed)

第一个发生的状态，在serviceWorker首次注册的时候,满足条件，比如 协议是https，没有其他错误，就会成功解析，并返回了[ServiceWorkerRegistration](ServiceWorkerRegistration.md)对象的实例，将会包含 serviceWorker的状态和作用域，作用域由配置scope可以配置

成功注册serviceWorker并不意味着成功的安装，或者激活，只有在解析成功后，并且是在https下，并且是和document同源，才能向下一步走

## 正在安装（installing)
一旦成功解析后，会继续install并且改变state成installing，在[ServiceWorkerRegistration](ServiceWorkerRegistration.md)对象的实例中，我们可以通过installing属性查看

``` javascript
navigator.serviceWorker.register('./sw.js').then(function(registration) {  
    // 会打印出 正在安装得serviceWorker,如果安装完成，或者没有安装，这个字段的值是null
    if (registration.installing) {
    }
}) 
// 在sw.js中，即serviceWorker的client中，可以用install监听serviceWorker的installing状态
self.addEventListener('install', function(event) {  
 // 事件中得这个waitUntil方法如果被拒绝了，则会安装失败，安装的状态必须是这里是解决状态才能到下一步中去
  event.waitUntil(
   return Promise.reject(); // 失败
  );
}); 

```

## 安装成功/等待中（installed/waiting）
如果安装成功就进入installed状态,也叫waiting状态，在这个状态下serviceWorker已经可以访问，但是还不是激活状态,document还不归属这个serviceWorker管理，相当于在等待拿取当前页面的控制权，从旧的serviceWorker中
``` javascript
    navigator.serviceWorker.register('./sw.js').then(function(registration) {  
        // 会打印出 已经安装得serviceWorker,如果没有安装，或者已经激活，这个字段的值是null
        if (registration.waiting) {
        }
    }) 
```

## 正在激活（activating）
激活中状态会在以下几种情况下被触发
1. 当前没有serviceWorker在document中
2. 手动调用`self.skipWaiting()`方法(sw.js中)
3. 用户关闭所有页面，从而释放当前的serviceWorker
4. 超过规定时间，释放当前的serviceWorker

处于激活中状态的serviceWorker将会触发`activate`事件
``` javascript
/* 在sw.js中 */
self.addEventListener('activate', function(event) {  
  // 触发activate事件
  event.waitUntil();
});
```
与install事件类似，在activate中，如果waitUntil方法拒绝则serviceWorker的状态直接变成redundant,同样只有waitUntil返回的promise解决，才能进入下一个状态

## 激活成功（activated）
如果激活中状态成功就会进入active的状态,在这个状态下，serviceWorker接管document,在[ServiceWorkerRegistration](ServiceWorkerRegistration.md)对象的实例中，我们可以通过active属性查看
``` javascript
    navigator.serviceWorker.register('./sw.js').then(function(registration) {  
        // 会打印出 已经安装得serviceWorker,如果没有安装，或者没有激活，或者已经卸载，这个字段的值是null
        if (registration.active) {
        }
    }) 
```

## 废弃（redundant）
serviceWorker废弃会是以下原因导致
1. 安装失败
2. 激活过程中出错
3. 被另外一个serviceWorker替代

这些情况都可以用新版的chrome在调试工具中的application下的serviceWorkers下查看到
