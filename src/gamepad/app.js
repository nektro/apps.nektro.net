/**
 */
//
import { create_element } from "https://rawgit.com/nektro/basalt/21fa297/src/create_element.js";
import "https://cdn.rawgit.com/nektro/basalt/21fa297/src/gamepad.js";

// @see https://stackoverflow.com/a/8179307/5203655
HTMLElement.prototype.alpha = function(a) {
    const current_color = getComputedStyle(this).getPropertyValue("color");
    const match = /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[.\d+]*)*\)/g.exec(current_color);
    a = a > 1 ? (a / 255) : a;
    this.style.color = "rgba(" + [match[1],match[2],match[3],a].join(",") +")";
};

//
window.addEventListener("gamepadconnected", function(e) {
    // add gamepad elements
    const ele = create_element("div", new Map().set("class","gamepad").set("id",`gp${e.gamepad.index}`), [
        create_element("h1", undefined, [ document.createTextNode(`${e.gamepad.index} - ${e.gamepad.id}`) ]),
        create_element("div", undefined, [
            ...e.gamepad.axes.map((v,i) => create_element("div", undefined, [
                create_element("span", undefined, [ document.createTextNode(`Axis ${i}`) ]),
                create_element("span", undefined, [ create_element("progress", new Map().set("min","0").set("max","2000").set("value","1000")) ]),
                create_element("span", undefined, [ document.createTextNode("0") ])
            ]))
        ]),
        create_element("div", undefined, [
            ...e.gamepad.buttons.map((v,i) => create_element("div", undefined, [
                create_element("span", undefined, [ document.createTextNode(`B ${i}`) ]),
                create_element("span", undefined, [ document.createTextNode("0") ])
            ]))
        ])
    ]);
    document.body.querySelector("main").appendChild(ele);
    // console.log(e.gamepad);
});

//
window.addEventListener("x-gamepad:change", function(e) {
    // update gamepad elements through custom event
    switch (e.detail.type) {
        case "axis": {
            const val = (Math.floor(e.detail.value * 1000) + 1000);
            const ax_ele = document.getElementById(`gp${e.detail.gamepad}`).children[1].children[e.detail.index];
            ax_ele.children[1].firstElementChild.setAttribute("value", val);
            const lue = (val / 1000 - 1).toFixed(3);
            ax_ele.children[2].textContent = lue;
            ax_ele.children[2].alpha(Math.abs(lue) * .6 + .4);
            break;
        }
        case "button_swivel": {
            const val = e.detail.value;
            const bt_ele = document.getElementById(`gp${e.detail.gamepad}`).children[2].children[e.detail.index];
            bt_ele.children[1].textContent = val.toFixed(3);
            bt_ele.children[1].alpha(val * .6 + .4);
            break;
        }
        case "button_press": {
            break;
        }
    }
});

//
window.addEventListener("gamepaddisconnected", function(e) {
    document.getElementById(`gp${e.gamepad.index}`).remove();
});
