/* jshint esversion:6 */
//
import { x_assert } from "../_resources/x_assert.js";

//
const vid = document.getElementById('display');
const w = vid.parentElement.clientWidth;
const h = vid.parentElement.clientHeight;
const can = document.createElement('canvas'); // new OffscreenCanvas();
const con = can.getContext('2d');

//
Promise.resolve()
.then(() => x_assert(navigator.mediaDevices))
.then(() => x_assert(navigator.mediaDevices.getUserMedia))
.then(() => navigator.mediaDevices.getUserMedia({
    video: {
        width: { ideal: w },
        height: { ideal: h }
    }
}))
.then((x) => {
    vid.src = URL.createObjectURL(x);
    vid.play();

    can.setAttribute('width', w);
    can.setAttribute('height', h);

    document.getElementById('snap').addEventListener('click', (e) => {
        con.drawImage(vid, 0, 0, w, h);
        can.toBlob((b) => {
            // TODO: send to photos app
            window.open(URL.createObjectURL(b));
        });
    });
})
.catch((e) => {
    switch (e.name) {
        case 'NotAllowedError': return (function() {
            swal('Could Not Access Camera', e.message, 'error');
        })();
        default: return (function() {
            swal({
                type: 'error',
                title: e.name,
                text: e.message,
                allowOutsideClick: false,
                showConfirmButton: false
            });
        })();
    }
});
