//
import * as _0 from "https://cdn.rawgit.com/Nektro/js-polyfills/b611f13/src/HTMLCollection.prototype.forEach.js";
import * as _1 from "https://cdn.rawgit.com/Nektro/js-polyfills/b611f13/src/HTMLCollection.prototype.indexOf.js";
//
import Dexie              from "https://unpkg.com/dexie@2.0.1/dist/dexie.es.js";
import { read }           from "https://cdn.rawgit.com/Nektro/modules.js/48ac8f5/src/read.js";
import { create_element } from "https://cdn.rawgit.com/Nektro/modules.js/48ac8f5/src/create_element.js";

//
const db = new Dexie('app_music');
db.version(1).stores({
    library: 'id,dateAdded,title,file,artist,album,trackID,releaseYear,genre,time'
});
const audioCtx = new AudioContext();
const mlist = document.getElementById('music_list');
const sprog = document.getElementById('song_progress');
const dcTN  = s => document.createTextNode(s);

//
const songState = {
    ele: null, // HTMLElement
    source: audioCtx.createBufferSource(),
    iid: null, // setInterval ID
    dbid: null, // Number
    loading: false,
    running: false,
    shuffle: false,
    repeat: false
};
songState.source.start(0);

//
function createSongObj(id, title, data) {
    return {
        id: id,
        dateAdded: Date.now(),
        title: title,
        file: data,
        artist: '',
        album: '',
        trackID: '',
        releaseYear: '',
        genre: ''
    };
}
async function updateSongList() {
    await mlist.children.forEach(v => {
        v.remove();
    });
    await db.library.each(song => mlist.appendChild(create_element(
        'tr',
        undefined,
        [
            create_element('td', new Map().set('class','material-icons'), [dcTN('play_circle_outline')]),
            ...['id','title','artist','album','trackID','releaseYear','genre'].map(v => create_element('td', undefined, [dcTN(song[v])]))
        ],
        new Map().set('click', function (e) {
            return playSong(this);
        })
    )));
    return Promise.resolve();
}
async function fixCurrentSongAttrs() {
    if (songState.dbid === null) return;
    songState.ele = Array.from(mlist.children).find(v => {
        return parseInt(v.children[1].innerText) === songState.dbid;
    });
    songState.ele.firstElementChild.innerText = 'pause_circle_filled';
    songState.ele.setAttribute('class','active');
    return Promise.resolve();
}
async function updateSongProgress() {
    if (songState.running) {
        const elapsed = parseInt(sprog.getAttribute('value')) + 1;
        sprog.setAttribute('value', elapsed);
        const a = mlist.children.indexOf(songState.ele);
        if (parseInt(sprog.getAttribute('max')) < elapsed) {
            let next = 0;
            if (songState.repeat) {
                next = a;
            }
            else
            if (songState.shuffle) {
                next = parseInt(Math.random() * mlist.children.length);
            }
            else {
                next = a + 1;
            }
            const b = mlist.children[next];
            if (next === mlist.children.length) {
                clearInterval(songState.iid);
                toggleSong();
                songState.ele.setAttribute('class','');
                songState.ele.firstElementChild.innerText = 'play_circle_outline';
                songState.ele = null;
                sprog.setAttribute('value', '0');
            }
            else {
                await playSong(b);
            }
        }
    }
}
async function gotoSong(tr) {
    songState.loading = true;

    if (songState.ele === null) songState.ele = tr;
    const a = tr.children[1].innerText;
    const b = parseInt(a);
    tr.firstElementChild.innerText = 'hourglass_empty';
    const c = await db.library.where('id').equals(b).toArray();
    const d = await audioCtx.decodeAudioData(c[0].file);
    sprog.setAttribute('max', Math.ceil(d.duration));
    songState.ele.firstElementChild.innerText = 'play_circle_outline';
    songState.ele.setAttribute('class','');
    songState.source.stop();
    songState.source = audioCtx.createBufferSource();
    songState.source.buffer = d;
    songState.source.connect(audioCtx.destination);
    songState.source.start(0);
    audioCtx.suspend();
    songState.running = false;
    sprog.setAttribute('value', '0');
    if (songState.iid !== null) clearInterval(songState.iid);
    songState.iid = setInterval(updateSongProgress, 1000);
    tr.firstElementChild.innerText = 'pause_circle_outline';
    tr.setAttribute('class','active');
    songState.ele = tr;

    songState.loading = false;
}
async function playSong(tr) {
   await gotoSong(tr);
   await toggleSong();
}
async function toggleSong() {
    if (songState.running) {
        audioCtx.suspend();
        songState.ele.firstElementChild.innerText = 'pause_circle_outline';
        document.querySelector('footer').children[1].children[1].children[0].innerText = 'play_arrow';
        songState.running = false;
    }
    else {
        audioCtx.resume();
        songState.ele.firstElementChild.innerText = 'pause_circle_filled';
        document.querySelector('footer').children[1].children[1].children[0].innerText = 'pause';
        songState.running = true;
    }
}

//
document.getElementById('filein').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const name = file.name.substring(0, file.name.lastIndexOf('.'));

    read(e.target.files[0])
    .then(x => Promise.all([ x.arrayBuffer(), db.library.count() ]))
    .then(x => db.library.put(createSongObj(x[1], name, x[0])))
    .then(x => updateSongList())
    .then(x => fixCurrentSongAttrs())
    .then(x => swal('Success!', `Added ${name} to your library.`, 'success'));
});

//
(function() {
    // add footer elements with button controls
    const m_icon_m = new Map().set('class', 'material-icons');
    document.querySelector('footer').appendChild(create_element('div', undefined, [
        create_element('div', undefined, [create_element('span', m_icon_m, [dcTN('fast_rewind')], new Map().set('click', async function(e) {
            if (songState.loading === false) {
                if (songState.ele !== null) {
                    playSong(mlist.children[mlist.children.indexOf(songState.ele) - 1]);
                }
            }
        }))]),
        create_element('div', undefined, [create_element('span', m_icon_m, [dcTN('play_arrow')], new Map().set('click', async function(e) {
            if (songState.loading === false) {
                if (songState.ele !== null) {
                    toggleSong();
                }
            }
        }))]),
        create_element('div', undefined, [create_element('span', m_icon_m, [dcTN('fast_forward')], new Map().set('click', async function(e) {
            if (songState.loading === false) {
                let ind = 0;
                if (songState.ele !== null) ind = mlist.children.indexOf(songState.ele) + 1;
                if (ind === mlist.children.length) ind = 0;
                if (songState.shuffle) ind = parseInt(Math.random() * mlist.children.length);
                playSong(mlist.children[ind]);
            }
        }))]),
        create_element('div', undefined, [create_element('span', m_icon_m, [dcTN('repeat')], new Map().set('click', async function(e) {
            if (songState.loading === false) {
                if (songState.shuffle) {
                    songState.shuffle = false;
                    this.classList.remove('active');
                }
                else {
                    songState.shuffle = true;
                    this.classList.add('active');
                }
            }
        }))]),
        create_element('div', undefined, [create_element('span', m_icon_m, [dcTN('replay')], new Map().set('click', async function(e) {
            if (songState.loading === false) {
                if (songState.repeat) {
                    songState.repeat = false;
                    this.classList.remove('active');
                }
                else {
                    songState.repeat = true;
                    this.classList.add('active');
                }
            }
        }))])
    ]));
    // add songs to list from IDB
    updateSongList();
})();
