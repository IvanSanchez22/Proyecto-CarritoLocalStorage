// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    //Cuando se agrega un curso al pulsar en "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso)

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Mostrar datos de local storage 
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || []; //En caso de que sea vacío asignamos array vacío
        carritoHtml();
    })

    //Vacía el carrito entero
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; //Vaciamos el array
        limpiarHtml(); //Eliminamos todo el html

    });

}


//Funciones

function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);

    }
}

//Elimina un cursos del carrito
function eliminarCurso(e) {
    let actualizado = false;
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id')
        //Eliminar del array si la cantidad comprada es mayor que 1
        articulosCarrito.forEach((curso, indice) => {
            if (curso.id === cursoId && curso.cantidad > 1) {
                curso.cantidad -= 1;
                articulosCarrito[indice] = curso;
                actualizado = true;
                carritoHtml();
            }
        })
        //Eliminar curso del array si la cantidad comprada es 1
        if (!actualizado) {
            articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
            carritoHtml(); //Vuelve a iterar sobre el carrito actualizado y muestra el html
        }
    }
}



// Lee informacion del html al que pulsa el usuario y extrae la informacion
function leerDatosCurso(curso) {
    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    // Revisar si el elementos ya se encuentra en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id)

    if (existe) {
        //Actualizamos cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad += 1;
                return curso; //Devuelve objeto actualizado
            } else {
                return curso; //Devuelve los que no son actualizados
            }
        })
        articulosCarrito = [...cursos];
    } else {
        //Agrega elementos al array del carrito
        articulosCarrito = [...articulosCarrito, infoCurso] //Uso del spread operator para ir concatenando al array los productos

    }
    carritoHtml();
}

//Muestra el carrito de compras en el HTML
function carritoHtml() {

    //Limpiar el html
    limpiarHtml();

    //Recorre el carrito y genera el html
    articulosCarrito.forEach(curso => {
        const { imagen, titulo, precio, cantidad, id } = curso
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>
           <img src="${imagen}" width="100" >
        </td>
        <td> ${titulo} </td>
        <td> ${precio} </td>
        <td> ${cantidad}</td>
        <td> 
        <a href="#" class="borrar-curso" data-id= "${curso.id}" > x </a>
        </td>
        `
        //Agrega el html del carrito en el tbody
        contenedorCarrito.appendChild(row);
    })
    // Añadiendo informacion del carrito a local storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del tbody
function limpiarHtml() {
    // Poco eficiente
    // contenedorCarrito.innerHTML = ''

    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}
