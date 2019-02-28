/**
 */
//
import * as luxon from "https://moment.github.io/luxon/es6/luxon.js";

//
const e_time = document.getElementById("time");
const e_date = document.getElementById("date");
const e_sec = document.getElementById("c_sec");
const e_min = document.getElementById("c_min");
const e_hou = document.getElementById("c_hou");
const e_day = document.getElementById("c_day");
const e_mon = document.getElementById("c_mon");

//
function t(n) {
    return n.toFixed(0).padStart(2, "0");
}
function updateTime() {
    let { second, minute, hour, day, month, year, daysInMonth, monthLong } = luxon.DateTime.local();

    e_time.textContent = `${t(hour)}:${t(minute)}:${t(second)}`;
    e_date.textContent = `${t(year)}/${t(month)}/${t(day)}`;

    e_sec.setAttribute("p", `${parseInt(second / 60 * 60)}`);
    e_min.setAttribute("p", `${parseInt(minute / 60 * 60)}`);
    e_hou.setAttribute("p", `${parseInt(hour / 24 * 60)}`);
    e_day.setAttribute("p", `${parseInt(day / daysInMonth * 60)}`);
    e_mon.setAttribute("p", `${parseInt(month / 12 * 60)}`);

    e_sec.setAttribute("title", `Second: ${second}`);
    e_min.setAttribute("title", `Minute: ${minute}`);
    e_hou.setAttribute("title", `Hour: ${hour}`);
    e_day.setAttribute("title", `Day: ${day}`);
    e_mon.setAttribute("title", `Month: ${month}/${monthLong}`);

    setTimeout(updateTime, 1000);
}

//
updateTime();
