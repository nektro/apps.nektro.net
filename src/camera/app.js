/**
 */
//
"use strict";
//
const vid = document.getElementById("display");
const w = vid.parentElement.clientWidth;
const h = vid.parentElement.clientHeight;
const can = document.createElement("canvas"); // new OffscreenCanvas();
const con = can.getContext("2d");

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
    vid.srcObject = x;
    vid.play();

    can.setAttribute("width", w);
    can.setAttribute("height", h);

    document.getElementById("snap").addEventListener("click", () => {
        con.drawImage(vid, 0, 0, w, h);
        can.toBlob((b) => {
            // TODO: send to photos app
            // https://github.com/WICG/web-share/issues/7
            // https://github.com/WICG/web-share/issues/12
            window.open(URL.createObjectURL(b));
        });
    });
})
.catch((e) => {
    if (e.name === "NotAllowedError")
        return swal_no_close("error", "Could Not Access Camera", e.message);
    else
        return swal_no_close("error", e.name, e.message);
});

//
function x_assert(obj) {
    if (obj === undefined) {
        return Promise.reject();
    }
    return Promise.resolve();
}
function swal_no_close(type, title, text) {
    return swal({
        type,
        title,
        text,
        allowOutsideClick: false,
        showConfirmButton: false
    });
}
