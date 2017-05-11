# 通过fetch事件控制请求

在sw脚本中，我们可以通过一些事件完成对页面的缓存的控制

## 首先是在安装过程中
在sw.js中
``` javascript
var CACHE_NAME  = 'first_cache';

var urlsToCache = [
	'/test.js'
];
self.addEventListener('install', function(event) {
  // 确保安装成功
  event.waitUntil(
	// 打开一个缓存
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('已经打开了', cache);
		// 增加缓存
        // 这里的缓存添加不一定非要在install事件中，如果中途想添加也是可以的
        return cache.addAll(urlsToCache);
      })
  );
}); 
```
caches是[CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)的实例,通过caches可以操作缓存
对象
- `caches.open(cacheName)` 通过open打开一个缓存，或者创建一个缓存，如果缓存已经存在就是打开，否则是创建，返回Promise，Promise解决后返回cache实例
- `caches.keys()` 返回一个Promise，Promise返回所有缓存的cache的名称
- `caches.has(cacheName)` 参数是缓存名称，返回一个Promise，如果存在这个cache就已true解决Promise
- `cache.delete(cacheName)` 参数缓存名称，根据名称删除一个缓存,还是返回一个Promise，如删除成功，Promise以true解决
- `caches.match(request,{options})` 根据给定的key返回一个查找到得cache，同样返回Promise，解决后参数是匹配的cache



一旦serviceWorker安装激活后，页面的请求将会通过serviceWorker的控制,每当有请求过来的时候，将会触发fetch事件

``` javascript

self.addEventListener('fetch', function (event) {
	// event.request一个请求对象，里面具体包括请求头，请求url等信息
	console.log('fetch', event.request);
	event.respondWith(caches.match(event.request)
	.then(function (response) {
		// 如果这个请求已经在cache中存在
		// response表示响应，通常数据都在response中得body属性中
		if (response) {
			console.log('response', response);
			// 直接返回响应的数据
			console.log(response.url + "--的数据是通过缓存获取的");
			return response;
		}
		// 直接去请求-- 这里就直接向服务器请求数据了
		// 这里的fetch直接访问真实数据，如果不出错就resolve，否则就拒绝了

		// 这里我们必须clone一些request对象，因为这里面的数据只能读取一次，类似流，而我们这里需要读取2次，一次给请求，一次是放入缓存
		cloneReq = event.request.clone();
        return fetch(event.request)
		.then(function (response) {
			// 获取response的状态必须是成功的 - 不是200得，或者basic的请求就不缓存了
			if(!response || response.status !== 200 || response.type !== 'basic') {
				return response;
			}
			// response也是需要clone的因为也要用2次，一次给页面用，一次给缓存用
			var cloneRes = response.clone();
			// 打开我们的缓存
			caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log(cloneReq.url + " 的数据被放入了缓存 " + CACHE_NAME + "下");
				cache.put(cloneReq, cloneRes);
			});
			return response;
		})
	}));
});
```

这里需要注意的是，一旦这个js或者css缓存了，一般都会从cache中取，一旦中间出了什么错，会导致js或者css无法更新，所以必须留一个门，防止js或者css出错，或者serviceWorker出现bug，无法更新js或者css

个人尝试了下，即使用户清除浏览器缓存，这里的caches还是不能被清除掉，必须我们自己去清除


## 清除已经存在的缓存

``` javascript
// 可以通过这个清除一个cacheName下地所有缓存
caches.delete(cacheName);

// 可以通过cache的delete来删除具体的某个请求的缓存
caches.open(cacheName)

.then(function (cache) {
    cache.delete(request, {option});
});

```

在真正得开发中，可以在 serviceWorker激活的时候去清除掉缓存，也可以在页面中放置一个全局的开关，一旦出问题，直接在页面中脚本清除掉所有的缓存
