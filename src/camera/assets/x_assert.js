/**
 */
//
export function x_assert(obj) {
    if (obj === undefined) {
        return Promise.reject();
    }
    return Promise.resolve();
}
