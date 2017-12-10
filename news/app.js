/**
 * Copyright (c) 2017 Sean Denny
 */
//
import { __makeElement } from "https://cdn.rawgit.com/Nektro/fluent_design.js/cc2f256/src/FluentElement.js";
//
document.getElementById('pivot').addEventListener('fl-pivot.select', function(e) {
    const piv_item = (this.querySelector(`${this.selector_nav}.active`));
    const i = Array.from(piv_item.parentElement.children).indexOf(piv_item);
    const piv_content = this.querySelectorAll(this.selector_content)[i];
    const cat = piv_item.getAttribute('data-cat');
    const fetched = piv_item.getAttribute('data-fed') !== null;
    const API_KEY = 'b74dfab7ae05467db9bea1fbf4693138';
    //
    if (piv_item.getAttribute('data-fed') === null) {
        fetch(`https://newsapi.org/v2/top-headlines`
            +`?category=${cat}`
            +`&language=en`
            +`&country=us`
            +`&sortBy=publishedAt`
            +`&apiKey=${API_KEY}`)
        .then(r => r.json())
        .then(r => {
            console.log(`Loaded category: ${cat}`);
            let tbl = __makeElement('table');
            tbl.appendChild(__makeElement('tbody'));
            if (r.status === 'ok') {
                r.articles.forEach(a => {
                    let row = __makeElement('tr');
                    row.appendChild(__makeElement('td', [], a.source.name));
                    let title = __makeElement('td');
                    title.appendChild(__makeElement('a', [['target','_blank'],['href',a.url]], a.title));
                    row.appendChild(title);
                    tbl.children[0].appendChild(row);
                });
            }
            piv_content.appendChild(tbl);
            piv_item.setAttribute('data-fed', 'true');
        });
    }
});
