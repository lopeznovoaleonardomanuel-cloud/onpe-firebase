import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, where, orderBy, query} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJ4W-i5SNKnj5XqkKi91c32m3Tv5fQhuY",
    authDomain: "onpe-rodrigo.firebaseapp.com",
    projectId: "onpe-rodrigo",
    storageBucket: "onpe-rodrigo.firebasestorage.app",
    messagingSenderId: "603629458203",
    appId: "1:603629458203:web:b0f7686e50f169f78779be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funciones para obtener los datos del Firestore (Participacion)
const p_departamento = async (id) => getDocs(query(collection(db, 'participacion_departamento'),where("ID", "==", `${id}`), orderBy('DPD')))
const p_provincia = async (id) => getDocs(query(collection(db, 'participacion_provincia'),where("Departamento", "==", `${id}`), orderBy('DPD')))
const p_distrito = async (id) => getDocs(query(collection(db, 'participacion_distrito'),where("Provincia", "==", `${id}`), orderBy('DPD')))
const post_distrito = async (id) => getDocs(query(collection(db, 'participacion_distrito'),where("DPD", "==", `${id}`), orderBy('DPD')))
// Funciones (Actas)
const departamentos = async (id) => getDocs(query(collection(db, 'departamento'), where("idAmbito", "==", `${id}`), orderBy("idDepartamento")))
const provincias = async (id) => getDocs(query(collection(db, 'provincia'), where("idDepartamento", "==", `${id}`), orderBy("idProvincia")))
const distritos = async (id) => getDocs(query(collection(db, 'distrito'), where("idProvincia", "==", `${id}`), orderBy("idDistrito")))
const locales = async (id) => getDocs(query(collection(db, 'localvotacion'), where("idDistrito", "==", `${id}`), orderBy("idLocalVotacion")))
const grupos = async (id) => getDocs(query(collection(db, 'grupovotacion'), where("idLocalVotacion", "==", `${id}`), orderBy("idGrupoVotacion")))
const acta = async (id) => getDocs(query(collection(db, 'actas'), where("idGrupoVotacion", "==", `${id}`)))
// Controlador para ejecutar una funcion dependiendo del metodo que se solicite
export const OnpeController = async (metodo, id) => {
    let accion = ""; // Siguiente accion -> para saber que metodo mandar al controller<<<<<<<
    let data = null;

    switch(metodo) {
        case "participacion": data = await p_departamento(id); accion = "departamento"; break;
        case "provincia": data = await p_provincia(id); accion = "provincia"; break;
        case "distrito": data = await p_distrito(id); accion = "distrito"; break;
        case "post-distrito": data = await post_distrito(id); accion = ""; break;
        case "dpd" : data = await departamentos(id); accion = ""; break;
        case "prov" : data = await provincias(id); accion = ""; break;
        case "dist" : data = await distritos(id); accion = ""; break;
        case "localvotacion" : data = await locales(id); accion = ""; break;
        case "grupovotacion" : data = await grupos(id); accion = ""; break;
        case "actas" : data = await acta(id); accion = ""; break;
    }

    const array = []; // Arreglo que contendra la siguiente accion y la data 
    array.push(accion, data);
    return array;

}