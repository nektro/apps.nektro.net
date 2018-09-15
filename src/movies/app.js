/**
 */
//
"use strict";
//
import { pipe }     from "https://cdn.rawgit.com/nektro/basalt/4b37e8c/src/pipe.js";
import Router       from "https://cdn.rawgit.com/nektro/basalt/4b37e8c/src/router.js";
import corgi        from "https://cdn.rawgit.com/nektro/basalt/4b37e8c/src/language/corgi.js";
import Switch       from "https://cdn.rawgit.com/nektro/basalt/4b37e8c/src/switch.js";

//
const dcTN = (string) => document.createTextNode(string);
const fetch_api = (endpoint, params) => fetch(`https://yts.am/api/v2/${endpoint}.json?${make_params(params)}`).then(x => x.json());
const make_params = (params) => params.map(x => `${x[0]}=${encodeURIComponent(x[1])}`).join("&");
const add_movies = (parent, list) => list.forEach(m => parent.appendChild(make_movie_card(m.id, m.slug, m.title, m.medium_cover_image, m.year)));
const s_reverse = (string) => string.split("").reverse().join("");
const s_substring = (start) => (string) => string.substring(start);

//
function update_list (ele, sort, page) {
    return fetch_api("list_movies", [ ["sort_by",sort],["page",page] ])
    .then(x => add_movies(ele, x.data.movies))
    .then(() => ele.setAttribute("data-page", page));
}
function make_movie_card(id, slug, title, image, year) {
    return create_element("x-movie", [
        ["data-id", id],
        ["data-slug", slug],
        ["data-title", title],
        ["data-image", pipe(image, s_substring(36), s_reverse, s_substring(17), s_reverse)],
        ["data-year", year],
    ]);
}
function create_element(name, attrs, children) {
    var ele = document.createElement(name);
    (attrs || []).forEach(function(v) { ele.setAttribute(v[0], v[1]); });
    (children || []).forEach(function(v) { ele.appendChild(v); });
    return ele;
}

//
customElements.define("x-movie", class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        let { id, slug, title, image, year } = this.dataset;
        console.log(slug);
        this.appendChild(create_element("a", [["class","movie"],["href",`#/movie/${id}`]], [
            create_element("img", [["src",`https://yts.am/assets/images/movies/${image}/medium-cover.jpg`]]),
            create_element("div", [], [ dcTN(title) ]),
            create_element("div", [], [ dcTN(year) ])
        ]));
        this.setAttribute("title", title);
    }
});

//
const regex_movie = new RegExp("/movie/([0-9]+)");

//
const router = new (class extends Router {
    constructor() {
        super("pages", { extension:".corgi" });
    }
    async getFileName(pn) {
        if (regex_movie.test(pn)) return (["/movie"]);
        return super.getFileName(pn);
    }
    async processFile(src) {
        return await corgi.parse(src);
    }
    async gotoPage(pn) {
        console.clear();
        await super.gotoPage(pn)
        .then(() => {
            const pns = pn.split("/");
            console.log(pn);
            console.log(pns);

            const sw = new Switch();
            sw.case([2], () => {
                setTimeout(() => {
                    let section = document.querySelector("section");
                    update_list(section, "download_count", 1);
                    //
                    document.getElementById("sort").addEventListener("change", function(e) {
                        while (section.hasChildNodes()) {
                            section.removeChild(section.lastChild);
                        }
                        update_list(section, e.target.value, 1);
                    });
                    document.getElementById("more").addEventListener("click", function() {
                        console.dir(section);
                        Promise.resolve()
                        .then(() => this.setAttribute("disabled", ""))
                        .then(() => update_list(
                            section,
                            section.previousElementSibling.previousElementSibling.children[1].value,
                            parseInt(section.dataset.page) + 1)
                        )
                        .then(() => this.removeAttribute("disabled"));
                    });
                }, 10);
            });
            sw.case([3], () => {
                console.log("movie");
                fetch_api("movie_details", [ ["movie_id",pns[2]] ])
                .then(x => x.data.movie)
                .then(x => {
                    document.getElementById("image").setAttribute("src", x.large_cover_image);
                    document.getElementById("title").textContent = x.title_long;
                    document.getElementById("runtime").textContent = `${x.runtime} minutes`;
                    document.getElementById("genre").textContent = x.genres.map(v => v.toLowerCase()).join(" / ");
                    document.getElementById("rating").textContent = `${x.rating}/10`;
                    document.getElementById("mpa").textContent = x.mpa_rating;
                    document.getElementById("imdb").setAttribute("href", `https://www.imdb.com/title/${x.imdb_code}/`);
                    document.getElementById("yt").setAttribute("href", `https://www.youtube.com/watch?v=${x.yt_trailer_code}`);
                });
            });

            sw.run(pns.length);
        });
    }
})();

router.start(document.body.querySelector("main"));
