import { ScgResponce } from "../server/html-parser";
import { debounce } from 'lodash';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'whatwg-fetch';

const url = process.env.NODE_ENV === 'production'
    ? ''
    : '//localhost:8081';

export const searchByName = debounce(async (value: string) => {
    if (!value) {
        return;
    }
    if (this.controller) {
        this.controller.abort();
    }
    this.controller = new AbortController();
    try {
        const response = await (await fetch(`${url}/api?name=${value}`, { signal: this.controller.signal })).json() as ScgResponce;
        this.controller = null;
        return response;
    } catch (e) {
        const domException = e as DOMException;
        // ignore abortError
        if (domException.code === 20) {
            return;
        }
        throw e;
    }
}, 300);
