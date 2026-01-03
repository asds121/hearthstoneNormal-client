import { boot, onload } from "../noname.js";

/**
 * @type {Promise<unknown>}
 */
Promise.resolve().then(boot).then(onload);
