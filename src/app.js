//
'use strict';
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
//
customElements.define('x-app', class extends HTMLElement {
    constructor() {
        super();
        let id = this.dataset.id;
        let name = capitalize(id);
        this.appendChild(create_element('div', [['class','card']], [
            create_element('div', [['class','card-body']], [
                create_element('div', [['class','row']], [
                    create_element('div', [['col-sm-auto']], [
                        create_element('img', [['src',`./${id}/dusk.png`],['alt',`${name} Logo`]])
                    ]),
                    create_element('div', [['class','col']], [
                        create_element('h3', [], [ dcTN(name) ]),
                        create_element('p', [], [
                            create_element('a', [['class','btn btn-primary'],['href',`./${id}/`]], [ dcTN('Go') ])
                        ])
                    ])
                ])
            ])
        ]));
    }
});
