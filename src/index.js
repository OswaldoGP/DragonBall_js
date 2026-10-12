import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './main.css';
import Swal from "sweetalert2";
import Acciones from "./Acciones.js";
import { atkBasico, atkEspecial } from "./interfaz.js";

const btn_player1 = document.getElementById("btn_player1");
const btn_player2 = document.getElementById("btn_player2");
const player1 = document.getElementById("py1");
const player2 = document.getElementById("py2");
const nombre1 = document.getElementById("player1");
const nombre2 = document.getElementById("player2");
const inicio = document.getElementById("inicio");
const batalla = document.getElementById("batalla");
const turnoTxt = document.getElementById("turno");

const username1 = document.getElementById("username1");
const personaje1 = document.getElementById("personaje1");
const img1 = document.getElementById("img1");

const username2 = document.getElementById("username2");
const personaje2 = document.getElementById("personaje2");
const img2 = document.getElementById("img2");

const botonesP1 = [...document.getElementById("btn-py1").querySelectorAll("button")];
const botonesP2 = [...document.getElementById("btn-py2").querySelectorAll("button")];


let pj1 = "", pj2 = "";
let jugador1, jugador2;
let turno = 1;


const COSTOS = {
    basico:   { ki: 10, energia: 5 },
    especial: { ki: 20, energia: 15 }
};
const cooldown = { 1: 2 , 2: 2 }; 

const puedeAtacar = (jugador, costo) =>
    jugador.getKi() >= costo.ki && jugador.getEnergia() >= costo.energia;

const puedeCurar = (jugador) =>
    jugador.getSemilla() > 0 &&
    (jugador.getVida() < 100 || jugador.getKi() < 100 || jugador.getEnergia() < 100);

const iniciar_jugador1 = () => {
    username1.innerText = nombre1.value;
    personaje1.innerText = pj1;
    img1.src = `./public/img/${pj1}/base.png`;
};

const iniciar_jugador2 = () => {
    username2.innerText = nombre2.value;
    personaje2.innerText = pj2;
    img2.src = `./public/img/${pj2}/base.png`;
};

const actualizarBarras = (jugador) => {
    const id = jugador.getId();
    document.getElementById(`vida${id}`).style.width = `${jugador.getVida()}%`;
    document.getElementById(`vida${id}-txt`).innerText = `${jugador.getVida()}%`;
    document.getElementById(`ki${id}`).style.width = `${jugador.getKi()}%`;
    document.getElementById(`ki${id}-txt`).innerText = `${jugador.getKi()}%`;
    document.getElementById(`energia${id}`).style.width = `${jugador.getEnergia()}%`;
    document.getElementById(`energia${id}-txt`).innerText = `${jugador.getEnergia()}%`;

    const botones = id === 1 ? botonesP1 : botonesP2;
    botones[3].querySelector(".badge").innerText = jugador.getSemilla();
};


const limpiarNombre = (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/g, "");
};
nombre1.addEventListener("input", limpiarNombre);
nombre2.addEventListener("input", limpiarNombre);

const remover_seleccion = (color, ...elementos) => {
    elementos.map((elemento) => {
        elemento.classList.remove("bg-warning");
        elemento.classList.add("bg-" + color);
    });
};

const msj_error = (msj) => {
    Swal.fire({ icon: "warning", title: "Error!", text: msj });
};

[...player1.querySelectorAll("img")].map((imagen) => {
    imagen.addEventListener("click", (event) => {
        remover_seleccion("danger", ...player1.querySelectorAll("img"));
        event.target.classList.remove("bg-danger");
        event.target.classList.add("bg-warning");
        pj1 = event.target.alt;
    });
});

[...player2.querySelectorAll("img")].map((imagen) => {
    imagen.addEventListener("click", (event) => {
        remover_seleccion("primary", ...player2.querySelectorAll("img"));
        event.target.classList.remove("bg-primary");
        event.target.classList.add("bg-warning");
        pj2 = event.target.alt;
    });
});


const setTurno = (n) => {
    turno = n;
    const yo = n === 1 ? jugador1 : jugador2;
    const mios = n === 1 ? botonesP1 : botonesP2;
    const rivales = n === 1 ? botonesP2 : botonesP1;

    
    if (cooldown[n] > 0) cooldown[n]--;

    rivales.forEach((b) => (b.disabled = true));

    mios[0].disabled = !puedeAtacar(yo, COSTOS.basico);
    mios[1].disabled = cooldown[n] > 0 || !puedeAtacar(yo, COSTOS.especial);
    mios[2].disabled = false;
    mios[3].disabled = !puedeCurar(yo);

    mios[1].innerText = cooldown[n] > 0 ? `ATK Especial (${cooldown[n]})` : "ATK Especial";

    turnoTxt.innerText = `Turno de ${yo.getNombre()} (${yo.getPersonaje()})`;
};

const finDelJuego = (ganador) => {
    botonesP1.forEach((b) => (b.disabled = true));
    botonesP2.forEach((b) => (b.disabled = true));
    turnoTxt.innerText = "¡Fin de la pelea!";

    
    setTimeout(() => {
        Swal.fire({
            icon: "success",
            title: "¡Tenemos un ganador!",
            text: `${ganador.getNombre()} (${ganador.getPersonaje()}) ha ganado la pelea`,
            confirmButtonText: "Jugar de nuevo",
            allowOutsideClick: false
        }).then(() => location.reload());
    }, 1600);
};


const ejecutarAccion = (id, accion) => {
    const yo = id === 1 ? jugador1 : jugador2;
    const rival = id === 1 ? jugador2 : jugador1;


    if (accion === 0 && !puedeAtacar(yo, COSTOS.basico)) return;
    if (accion === 1) {
        if (cooldown[id] > 0 || !puedeAtacar(yo, COSTOS.especial)) return;
    }
    if (accion === 3 && !puedeCurar(yo)) return;

    if (accion === 0) atkBasico(yo, rival);
    else if (accion === 1) {
        atkEspecial(yo, rival);
        cooldown[id] = 2;
    }
    else if (accion === 2) yo.cargaEnergia();
    else if (accion === 3) yo.curacion();

    actualizarBarras(jugador1);
    actualizarBarras(jugador2);

    if (rival.getVida() <= 0) {
        finDelJuego(yo);
    } else {
        setTurno(id === 1 ? 2 : 1);
    }
};

botonesP1.forEach((btn, i) => btn.addEventListener("click", () => ejecutarAccion(1, i)));
botonesP2.forEach((btn, i) => btn.addEventListener("click", () => ejecutarAccion(2, i)));


const cuentaRegresiva = async () => {
    for (let i = 3; i >= 1; i--) {
        await Swal.fire({
            title: i,
            text: "¡La pelea comienza!",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1000
        });
    }
};

const comenzarPelea = async () => {
    inicio.classList.add("d-none");
    await cuentaRegresiva();
    batalla.classList.remove("d-none");
    actualizarBarras(jugador1);
    actualizarBarras(jugador2);
    setTurno(1);
};

const verificarListos = () => {
    if (jugador1 && jugador2) comenzarPelea();
};

btn_player1.addEventListener("click", () => {
    if (nombre1.value == "") {
        return msj_error("El jugador 1 no ha ingresado un nombre de usuario!");
    } else if (pj1 == "") {
        return msj_error("El jugador 1 debe seleccionar un personaje!");
    }
    jugador1 = new Acciones(nombre1.value, pj1, 1);
    nombre1.disabled = true;
    player1.classList.add("d-none");
    iniciar_jugador1();
    verificarListos();
});

btn_player2.addEventListener("click", () => {
    if (nombre2.value == "") {
        return msj_error("El jugador 2 no ha ingresado un nombre de usuario!");
    } else if (pj2 == "") {
        return msj_error("El jugador 2 debe seleccionar un personaje!");
    }
    jugador2 = new Acciones(nombre2.value, pj2, 2);
    nombre2.disabled = true;
    player2.classList.add("d-none");
    iniciar_jugador2();
    verificarListos();
});