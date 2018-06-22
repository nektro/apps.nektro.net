/**
 */
//
"use strict";
//
const ls_key_ip = "compass_ip";
const ls_key_ipdata = "compass_ip_data";
const degtorad = Math.PI / 180;
const ele_deg = document.getElementById("deg");
const ele_face = document.getElementById("face");

// functions
function fetchLocationData() {
    const ip = localStorage.getItem(ls_key_ip);
    console.log(`fetching data for: ${ip}`);
    fetch(`https://freegeoip.net/json/${ip}`)
    .then((x) => x.json())
    .then((x) => {
        localStorage.setItem(ls_key_ipdata, JSON.stringify(x));
        setLocationData();
    });
}
function setLocationData() {
    const data = JSON.parse(localStorage.getItem(ls_key_ipdata));
    console.log(data);
    document.getElementById('loc').innerHTML = `${data.city}<br>${data.region_name}<br>${data.country_name}`;
    document.getElementById("pos").innerText = `${data.latitude}°, ${data.longitude}°`;
}
function compassHeading( alpha, beta, gamma ) {
    // compass heading in degress based on absolute values from "on deviceorientation"
    // via https://w3c.github.io/deviceorientation/spec-source-orientation.html#worked-example
    const _x = beta  ? beta  * degtorad : 0; // beta value
    const _y = gamma ? gamma * degtorad : 0; // gamma value
    const _z = alpha ? alpha * degtorad : 0; // alpha value
    const cX = Math.cos( _x );
    const cY = Math.cos( _y );
    const cZ = Math.cos( _z );
    const sX = Math.sin( _x );
    const sY = Math.sin( _y );
    const sZ = Math.sin( _z );
    const Vx = - cZ * sY - sZ * sX * cY;
    const Vy = - sZ * sY + cZ * sX * cY;
    let heading = Math.atan( Vx / Vy );
    if( Vy < 0 ) {
        heading += Math.PI;
    } else if( Vx < 0 ) {
        heading += 2 * Math.PI;
    }
    return heading * ( 180 / Math.PI );
}

// fetch info for compass head
    const deg = navigator.userAgent.indexOf('Mac OS X') > -1
              ? e.webkitCompassHeading
              : compassHeading(e.alpha, e.beta, e.gamma);
window.addEventListener("deviceorientation", function(e) {
    ele_deg.innerHTML = `${parseInt(deg)}°`;
    ele_face.style.transform = `rotate(${parseInt(deg)}deg)`;
    Array.from(ele_face.children).forEach(v => v.style.transform = `rotate(${-parseInt(deg)}deg)`);
});

// fetch info for details below
fetch("https://oneapi.nektro.net/ip")
.then((x) => x.text())
.then((x) => {
    if (localStorage.getItem(ls_key_ip) != x) {
        localStorage.setItem(ls_key_ip, x);
        fetchLocationData();
    }
    else {
        if (localStorage.getItem(ls_key_ipdata) !== null) {
            setLocationData();
        }
        else {
            fetchLocationData();
        }
    }
});
