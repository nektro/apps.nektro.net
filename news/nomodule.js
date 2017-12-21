window.addEventListener('load', function() {
    document.querySelectorAll('header')[0].style.display = "none";
    document.querySelectorAll('main')[0].style.display = "none";
    document.querySelectorAll('footer')[0].style.display = "none";
    document.body.style.margin = "1em";
    document.body.innerHTML += '<p>This browser does not support ES6 Modules</p>';
    document.body.innerHTML += '<p>Consider upgrading to Edge 16+, Chrome 61+, Safari 10.1+, or iOS Safari 11+</p>'
    document.body.innerHTML += '<p>See <a href="https://caniuse.com/#feat=es6-module">caniuse.com</a> more more info.</p>';
});
