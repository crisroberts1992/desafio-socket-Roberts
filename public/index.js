const serverSocket = io('http://localhost:8080/')

const cargarBTN = document.getElementById('botonCargar')

const eliminarBTN = document.getElementById('botonEliminar')

const eliminarID = document.getElementById('eliminarID')

const titulo = document.getElementById('titulo')

const descripcion = document.getElementById('descripcion')

const precio = document.getElementById('precio')

const urlIMG = document.getElementById('urlIMG')

const stock = document.getElementById('stock')

const codigo = document.getElementById('codigo')

const categoria = document.getElementById('categoria')

// funcionalidad al boton de eliminar producto "ELIMINAR"
eliminarBTN?.addEventListener("click", ()=>{

    const idEliminar = eliminarID?.value

    serverSocket.emit('eliminarProducto', idEliminar)

} )

//funcionalidad al boton de agregar productos "CARGAR"

cargarBTN?.addEventListener("click", (e)=>{
    
    const valorTitulo= titulo?.value
    
    const valorDescripcion= descripcion?.value
    
    const valorPrecio= precio?.value
    
    const valorUrlIMG= urlIMG?.value
    
    const valorStock= stock?.value
    
    const valorCodigo= codigo?.value
    
    const valorCategoria= categoria?.value

    const productoAgregar = {"title":valorTitulo,"description":valorDescripcion,"price":valorPrecio,"thumbnail":valorUrlIMG,"stock":valorStock,"code":valorCodigo,"category":valorCategoria}


serverSocket.emit('nuevoProducto', productoAgregar)



} )



//Intento de actualizacion automatica al agregar un nuevo producto    
const plantillaMensajes = `
    {{#if hayProductos}}
    <h4>PRODUCTOS</h4>
    <ul>
        {{#each productos}}
        <li>{{this}}</li>
        {{/each}}
    </ul>
    {{else}}
    <p class="text-danger">sin productos...</p>
    {{/if}}
    
    `
const armarHtmlMensajes = Handlebars.compile(plantillaMensajes)
    
serverSocket.on('actualizarProductos', productosStorage => {
        
    const divProductos = document.getElementById('productos')
       
    if (divProductos) {
        const productos = []

        productosStorage.forEach(element => {productos.push(JSON.stringify(element))  })
           
        divProductos.innerHTML = armarHtmlMensajes({ productos, hayProductos: productos.length > 0 })
            
    }
})

