import Swal from "sweetalert2";

const atributosPersonaje = {
    "Goku": {
        atk_basico: "toma esto ¡¡¡",
        atk_especial: "¡¡¡Mueree, Kamehameha!!!",
        fondo: "rgba(234, 238, 7, 0.7)"
    },
    "Vegitto": {
        atk_basico: "toma esto ¡¡¡",
        atk_especial: "¡¡Este es tu fin",
        fondo: "rgba(126, 238, 7, 0.62)"
    },
    "Veguetta": {
        atk_basico: "toma¡¡",
        atk_especial: "resplandor final¡¡¡",
        fondo: "rgba(132, 106, 224, 0.44)"
    },
    "Gohan": {
        atk_basico: "toma esto ¡¡¡",
        atk_especial: "este es tu fin maldito",
        fondo: "rgba(61, 232, 45, 0.7)"
    },
    "Trunks": {
        atk_basico: "toma esto ¡¡¡",
        atk_especial: "mueree¡¡",
        fondo: "rgba(238, 7, 7, 0.94)"
    },
    "Pikoro": {
        atk_basico: "toma esto ¡¡¡",
        atk_especial: "makankosappo¡¡¡",
        fondo: "rgba(201, 28, 244, 0.7)"
    },
    "Cell": {
        atk_basico: "toma esto ¡¡¡ ",
        atk_especial: "este es tu fin HAHAH ¡¡",
        fondo: "rgba(223, 66, 192, 0.7)"
    },
    "Gogeta": {
        atk_basico: "toma esto ¡¡¡",
        atk_especial: "mueree¡¡¡",
        fondo: "rgba(201, 44, 175, 0.7)"
    }
};

const atkBasico = (j1, j2) => {
    j1.atkBasico(j2);
    j2.setVida(j2.getVida() - 10 < 1 ? 0 : j2.getVida() - 10);
    j2.mostrarEstadisticas();

    Swal.fire({
        text: atributosPersonaje[j1.getPersonaje()]?.atk_basico,
        imageUrl: `./public/img/${j1.getPersonaje()}/basico.png`,
        imageWidth: 400,
        imageHeight: 400,
        position: 'center',
        width: 600,
        color: '#fff',
        background: 'none',
        imageAlt: 'Ataque basico',
        backdrop: atributosPersonaje[j1.getPersonaje()]?.fondo,
        showConfirmButton: false,
        timer: 1500
    });
}



const atkEspecial = (j1, j2) => {
    j1.atkEspecial(j2);
    j2.setVida(j2.getVida() - 20 < 1 ? 0 : j2.getVida() - 20);
    j2.mostrarEstadisticas();

    Swal.fire({
        text: atributosPersonaje[j1.getPersonaje()]?.atk_especial,
        imageUrl: `./public/img/${j1.getPersonaje()}/especial.png`,
        imageWidth: 400,
        imageHeight: 400,
        position: 'center',
        width: 600,
        color: '#fff',
        background: 'none',
        imageAlt: 'Ataque especial',
        backdrop: atributosPersonaje[j1.getPersonaje()]?.fondo,
        showConfirmButton: false,
        timer: 1500
    });
}

export { atkBasico, atkEspecial };