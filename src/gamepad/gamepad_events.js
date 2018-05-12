/**
 */
//
window.addEventListener('gamepadconnected',    function(e) { handleGamepadEvent(e.gamepad, true);  });
window.addEventListener('gamepaddisconnected', function(e) { handleGamepadEvent(e.gamepad, false); });

//
const controllers = new Map();

//
function handleGamepadEvent(gamepad, incoming) {
    if (incoming) {
        controllers.set(gamepad.index, [0, [], [[],[]]]);
    }
    else {
        controllers.delete(gamepad.index);
    }
}

function sendEvent(pad, type, prop, index, value) {
    return window.dispatchEvent(new CustomEvent('x-gamepad:change', {
        detail: {
            gamepad: pad,
            type,
            index,
            value
        }
    }));
}

function checkForGamepadData() {
    for (const pad of navigator.getGamepads()) {
        if (pad !== null) {
            const tracker = controllers.get(pad.index);

            if (pad.timestamp !== tracker[0]) {
                tracker[0] = pad.timestamp;

                pad.axes.forEach((v,i) => {
                    if (v !== tracker[1][i]) {
                        tracker[1][i] = v;
                        sendEvent(pad.index, 'axis', 'axis', i, v);
                    }
                });
                pad.buttons.forEach((v,i) => {
                    if (v.pressed !== tracker[2][0][i]) {
                        tracker[2][0][i] = v.pressed;
                        sendEvent(pad.index, 'button_press', 'button', i, v.pressed);
                    }
                    if (v.value !== tracker[2][1][i]) {
                        tracker[2][1][i] = v.value;
                        sendEvent(pad.index, 'button_swivel', 'button', i, v.value);
                    }
                });
            }
        }
    }
    requestAnimationFrame(checkForGamepadData);
}

//
requestIdleCallback(checkForGamepadData);
