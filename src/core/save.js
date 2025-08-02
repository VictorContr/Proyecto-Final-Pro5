import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
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
   // Nuevo: guardar nivel en Firebase solo si es mayor que el anterior
     // Nuevo: guardar nivel en Firebase solo si es mayor que el anterior
    async saveLevelToFirebase(levelName) {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, "usuarios", user.uid);
        try {
            // Obtener nivel anterior de Firestore
            const snap = await getDoc(userRef);
            const oldName = snap.exists() ? snap.data().nivelRanking : null;

            // Log del nivel actual del usuario
            console.log("Nivel actual del usuario en Firestore:", oldName);

            // Comparar niveles "levelX-Y"
            const parse = name => {
                const m = name?.match(/level(\d+)-(\d+)/i);
                return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : [0, 0];
            };
            const [newX, newY] = parse(levelName);
            const [oldX, oldY] = oldName ? parse(oldName) : [0, 0];

            // Solo actualiza si es mayor
            if (newX > oldX || (newX === oldX && newY > oldY)) {
                await updateDoc(userRef, { nivelRanking: levelName });
                console.log("NivelRanking actualizado a:", levelName);
            } else {
                console.log("No se actualiza nivelRanking (previo mayor o igual):", oldName);
            }
        } catch (error) {
            console.error("Error comparando/guardando nivelRanking:", error);
        }
    }
};

BolaAzul_vc_jc.Save = Save;
