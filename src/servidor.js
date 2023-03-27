import express from 'express'
import { engine } from 'express-handlebars'
import { Server as SocketIOServer } from 'socket.io'
import { ProductManager } from './productManager.js'

const productosManager = new ProductManager('./localStorage/products.json')

const app = express()

app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('./public'))

const httpServer = app.listen(8080)


const io = new SocketIOServer(httpServer)

app.get('/', async (req, res) => {
    res.json({"message":"bienvenido al servidor"})
 })

 app.get('/home', async (req, res) => {
    const listado = await productosManager.getProducts()
    const producto = []
    listado.forEach(element => {producto.push(JSON.stringify(element))
        
    });
    
        res.render('home.handlebars', {
            titulo: 'Products',
            encabezado: 'Lista de productos en base de datos',
            producto,
            hayProductos: producto.length > 0
        })
})

app.get('/realtimeproducts', async (req, res, next) => {
 
     const listado1 = await productosManager.getProducts()
 

     io.on('connection', async clientSocket => {
 
     const productosStorage = await productosManager.getProducts()
 
     clientSocket.on('nuevoProducto',  productoAgregar => {
         productosManager.addProduct(productoAgregar.title,productoAgregar.description,productoAgregar.price,productoAgregar.thumbnail,productoAgregar.stock,productoAgregar.code,productoAgregar.category)
     })
 
 
     clientSocket.on('eliminarProducto',  productoEliminar => {
         productosManager.deleteProduct(productoEliminar)
     })
 
     const listado = await productosManager.getProducts()
     io.sockets.emit('actualizarProductos', listado) 
     })
 
     const listado = [];
     listado1.forEach(element => {listado.push(JSON.stringify(element))});
 
 res.render('realTimeProducts.handlebars', {
         titulo: 'Products',
         encabezado: 'Lista de productos en base de datos',
         listado,
         hayListado: listado.length > 0
    })
 })

