import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDhBIgjv0rFE36zpFyoIbbu2gLLNXvyK2I",
  authDomain: "carretasapp-ea4b7.firebaseapp.com",
  databaseURL: "https://carretasapp-ea4b7-default-rtdb.firebaseio.com",
  projectId: "carretasapp-ea4b7",
  storageBucket: "carretasapp-ea4b7.firebasestorage.app",
  messagingSenderId: "968788273467",
  appId: "1:968788273467:web:f91b3063c9132955926f1e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const pdasRef = ref(db, 'pdas');

// Função para verificar login (simples, para produção usar autenticação segura)
const USERNAME = 'admin';
const PASSWORD = 'admin';

function checkCredentials(username, password) {
    return username === USERNAME && password === PASSWORD;
}

// Função para carregar PDAs
async function loadPDAs() {
    try {
        const snapshot = await get(pdasRef);
        return snapshot.exists() ? Object.values(snapshot.val()) : [];
    } catch (error) {
        console.error('Erro ao carregar PDAs:', error);
        return [];
    }
}

// Função para salvar PDA
async function savePDA(imei, setor, status) {
    try {
        const pdas = await loadPDAs();
        if (pdas.some(pda => pda.imei === imei)) {
            return false; // IMEI duplicado
        }
        await set(ref(db, `pdas/${imei}`), {
            imei,
            setor,
            status,
            addedDate: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Erro ao salvar PDA:', error);
        return false;
    }
}

// Função para atualizar PDA
async function updatePDA(imei, setor, status) {
    try {
        await update(ref(db, `pdas/${imei}`), {
            setor,
            status
        });
    } catch (error) {
        console.error('Erro ao atualizar PDA:', error);
    }
}

// Função para excluir PDA
async function deletePDA(imei) {
    try {
        await remove(ref(db, `pdas/${imei}`));
    } catch (error) {
        console.error('Erro ao excluir PDA:', error);
    }
}

// Função para ouvir mudanças em tempo real
function onPDAsChange(callback) {
    onValue(pdasRef, (snapshot) => {
        const data = snapshot.val();
        const pdas = data ? Object.values(data) : [];
        callback(pdas);
    });
}

// Exportar funções
export { checkCredentials, loadPDAs, savePDA, updatePDA, deletePDA, onPDAsChange };