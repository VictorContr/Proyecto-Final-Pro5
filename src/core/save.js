import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { BolaAzul_vc_jc } from "../blueball.js";

// Firebase (debes tener `initializeApp()` en app.js)
const auth = getAuth();
const db = getFirestore();

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
    },

    // Nuevo: guardar nivel en Firebase
    async saveLevelToFirebase(levelName) {
        const user = auth.currentUser;
        if (!user) return;
        try {
            await updateDoc(doc(db, "usuarios", user.uid), {
                nivelRanking: levelName
            });
            console.log("Nivel guardado en Firebase:", levelName);
        } catch (error) {
            console.error("Error guardando nivel en Firebase:", error);
        }
    }
};

BolaAzul_vc_jc.Save = Save;
