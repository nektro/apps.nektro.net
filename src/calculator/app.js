/* jshint esversion:6 */
//
const output = document.getElementById('out').firstElementChild;
const ops = document.querySelectorAll('.op');
const op_history = [[3,'0']];

//
let res = '0';
let mem = '0';
let mop = -1;

//
function update(f) {
    f();
    const v = mop < 0 ? res : mem;
    let val = parseFloat(v).toString();
    console.debug(mop, res, mem);
    if (v.includes('.') && !val.includes('.')) val += '.';
    output.innerText = val;
}

//
function setOperation(n) {
    if (mop > -1) {
        ops[n].classList.remove('active');
    }
    mop = n;
    ops[n].classList.add('active');
}

//
function do_math(a, o, b) {
    switch (o) {
        case 0: return a / b;
        case 1: return a * b;
        case 2: return a - b;
        case 3: return a + b;
    }
}

//
for (const btn of document.body.children[2].children) {
    if (btn.nodeName === 'DIV') {
        btn.addEventListener('click', (e) => {
            const btx = btn.firstElementChild.innerText;
            switch (btx.charCodeAt(0)) {
                case 48: case 49:
                case 50: case 51:
                case 52: case 53:
                case 54: case 55:
                case 56: case 57: return update(() => { // 0-9
                    if (mop < 0) {
                        res += btx;
                    }
                    else {
                        mem += btx;
                    }
                });
                case 43: return update(() => { // add
                    setOperation(3);
                });
                case 8722: return update(() => { // subtract
                    setOperation(2);
                });
                case 215: return update(() => { // multiply
                    setOperation(1);
                });
                case 247: return update(() => { // divide
                    setOperation(0);
                });
                case 61: return update(() => { // equals
                    if (res.length > 0 && mem.length > 0 && mop > -1) {
                        res = do_math(parseFloat(res), mop, parseFloat(mem)).toString();
                        op_history.unshift([mop,parseFloat(mem)]);
                        ops[mop].classList.remove('active');
                        mop = -1;
                        mem = '0';
                    }
                    else {
                        res = do_math(parseFloat(res), ...op_history[0]).toString();
                    }
                });
                case 46: return update(() => { // decimal
                    if (mop < 0) {
                        res = (res + '.').toString();
                    }
                    else {
                        mem = (mem + '.').toString();
                    }
                });
                case 177: return update(() => { // negate
                    if (mop < 0) {
                        res = (-parseFloat(res)).toString();
                    }
                    else {
                        mem = (-parseFloat(mem)).toString();
                    }
                });
                case 185: return update(() => { // reciprocal
                    if (mop < 0) {
                        res = (1 / parseFloat(res)).toString();
                    }
                    else {
                        mem = (1 / parseFloat(res)).toString();
                    }
                });
                case 55349: return update(() => { // square
                    if (mop < 0) {
                        res = Math.pow(res, 2).toString();
                    }
                    else {
                        mem = Math.pow(mem, 2).toString();
                    }
                });
                case 8730: return update(() => { // square root
                    if (mop < 0) {
                        res = Math.sqrt(res).toString();
                    }
                    else {
                        mem = Math.sqrt(mem).toString();
                    }
                });
                case 37: return update(() => { // percent (x / 100)
                    if (mop < 0) {
                        res = (parseFloat(res) / 100).toString();
                    }
                    else {
                        mem = (parseFloat(mem) / 100).toString();
                    }
                });
                case 67: return update(() => { // clear
                    if (mop < 0) {
                        res = '0';
                    }
                    else {
                        mem = '0';
                    }
                });
                case 65: return update(() => { // all clear
                    res = '0';
                    mop = -1;
                    mem = '0';
                });
                case 55358: return update(() => { // backspace
                    if (mop < 0) {
                        res = res.substring(0, res.length - 1);
                        if (res.length === 0) res = '0';
                    }
                    else {
                        mem = mem.substring(0, mem.length - 1);
                        if (mem.length === 0) mem = '0';
                    }
                });
            }
        });
    }
}

//
update(() => {});
