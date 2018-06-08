//
"use strict";
//
function create_element(name, attrs, children) {
    var ele = document.createElement(name);
    (attrs || []).forEach(function(v) { ele.setAttribute(v[0], v[1]); });
    (children || []).forEach(function(v) { ele.appendChild(v); });
    return ele;
}
function dcTN(string) {
    return document.createTextNode(string);
}
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function idTOname(string) {
    return string.split('_').map(v => capitalize(v), '').join(' ');
}
//
customElements.define("x-app", class extends HTMLElement {
    constructor() {
        super();
        let id = this.dataset.id;
        let name = idTOname(id);
        this.appendChild(create_element("a", [["class","card"],["href",`./${id}/`]], [
            create_element("img", [["src",`./${id}/dusk.png`],["alt","Logo"]]),
            create_element("h3", undefined, [ dcTN(name) ])
        ]));
    }
});
