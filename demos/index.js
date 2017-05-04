if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('sw.js', {
        scope: './'
    }).then(function (registration) {
        console.log(registration);
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
        if (serviceWorker) {
            serviceWorker.addEventListener('statechange', function (e) {
                console.log(e.target.state);
            });
        }
    }).catch (function (error) {

    });
    //  ready是一个promise，如果  navigator状态为  active则解决
    navigator.serviceWorker.ready.then(function () {
        console.log('ready');
    })    
} else {
    alert('浏览器不支持 serviceworker');
}

