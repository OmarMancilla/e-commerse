// variables    (tbody = tablebody)

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');  
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];


// listener para agragar los productos al carrito
cargarEventListeners();
function cargarEventListeners() {
    //cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito 
    carrito.addEventListener('click', eliminarCurso);

    //Muestra los cursos de local Storage. esto es para que cuando se recargue la pagina no se borren del carrito.
    document.addEventListener('DOMContentLoaded', ()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    })

    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // Reseteamos el arreglo

        limpiarHTML(); // Eliminamos todo el HTML
    
    });
}

// Funciones 
function agregarCurso(e){
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement
        leerDatosCurso(cursoSeleccionado);
    }
}

// Elimina un curso del carrito
function eliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');

        //Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        carritoHTML(); // iterar sobre el carrito y mostrar su HTML
    }
}


// lee el contenido del HTML al que le dimos click y extrae la informacion del curso
function leerDatosCurso(curso){
    //console.log(curso);

    // crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id );
        if(existe){
            //actualizamos la cantidad
            const cursos = articulosCarrito.map(curso =>{
                if(curso.id === infoCurso.id){
                    curso.cantidad++;
                    return curso;  // retorna el objeto actualizado
                } else{
                    return curso; // retorna los objetos que no son duplicados
                }
            });
            articulosCarrito = [...cursos];
        } else{
            // Agregamos al carrito
            //Agrega elementos al arreglo de carrito
    articulosCarrito = [...articulosCarrito, infoCurso];            
        }


    //Agrega elementos al arreglo de carrito. "se hizo este codigo primero antes que el if anterior"
    //articulosCarrito = [...articulosCarrito, infoCurso];
   
    console.log(articulosCarrito);

    carritoHTML();

}


// Muestra el Carrito de compras en el HTML
function carritoHTML(){  

    //limpiar el HTML 
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso =>{
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        // con el innerHTML es una forma de acceder al HTML
        //<td> ${curso.precio} </td> para que quede como se muestra en el inner hay que aplicar destructuring en const dentro de la funcion 
        row.innerHTML = ` 
        <td>
            <img src="${imagen}" width="100">
        </td>
        <td> ${titulo} </td>
        <td> ${precio} </td>
        <td> ${cantidad} </td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}" > X </a>
        </td>
        `;

        //Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    } );

    //Agregar el carrito de compras al localStorage
    sincronizarStorage();

}
// funcion encargada de ligar a localStorage
function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//Elimina los cursos del tbody
function limpiarHTML(){
    // Forma lenta de limpiar HTML
    //contenedorCarrito.innerHTML = '';


    //forma rapida de lipiar
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}