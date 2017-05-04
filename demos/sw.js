console.log(this, self, self === this);
this.addEventListener('fetch', function () {
    console.log('fetch');
});

this.addEventListener('message', function (evt) {
    console.log('message', evt.data);
});