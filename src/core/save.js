import { BolaAzul_vc_jc } from "../blueball.js";
export let Save = {
    saveData(key, data) {
        localStorage.setItem(key, data);
    },

    loadData(key) {
        return localStorage.getItem(key);
    },

    deleteData(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

BolaAzul_vc_jc.Save = Save;