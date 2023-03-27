import { randomUUID } from "crypto";
import fs from "fs";

export class Product {
  constructor({title, description, price, thumbnail, code, stock,category}) {
      this.title = title;
      this.description = description;
      this.price = price;
      this.thumbnail = thumbnail;
      this.code = code;
      this.stock = stock;
      this.category = category;
      this.id = randomUUID();
  }
}



export class ProductManager {

  constructor(path) {
      this.path =path;
       fs.existsSync(this.path)
      ? (this.products = JSON.parse( fs.readFileSync(this.path, "utf-8")))
      : (this.products = []);
  }
     

  
  async getProducts() {
      
      console.log("productos :", this.products)
       return await this.products;
    }



  async addProduct(title, description, price, thumbnail, stock, code,category) {
      try {
          await this.getProducts()
          const productFind = this.products.find((product) => product.title === title)
          if (productFind) {
              console.log('Ya existe un producto con ese titulo');
          }
          if (title !== undefined && description !== undefined && price !== undefined && thumbnail!== undefined && stock !== undefined && code !== undefined && category !== undefined ) {
              const product = new Product({
                  title : title,
                  description : description,
                  price : price,
                  thumbnail : thumbnail,
                  stock : stock,
                  code : code,
                  category : category
                                    
              })
  
              this.products.push(product)
              const jsonProducts = JSON.stringify(this.products, null, 2)
              await fs.writeFileSync(this.path, jsonProducts)
              
            }
              } catch (error) {
            throw new Error ("Los campos no pueden estar vacios")
      }  
  }


  async getProductById(id) { 
        const productFind = this.products.find((product) => product.id === id)
        if (productFind ) {
            return await productFind
            
        } else {
          throw new Error("producto no encontrado - ID invalido")
            
        }
    
  }

async updateProduct(id, prodModificado) {
  
      const product = this.products.find((prod) => prod.id === id);
      const indice = this.products.findIndex(p => p.id === id)
      
      if (!product) {
        throw new Error("El id no existe");
      }
      
      const nuevoProducto = new Product({ ...product, ...prodModificado})
      nuevoProducto.id=id
      this.products[indice] = nuevoProducto
      
      const jsonProductsModif = JSON.stringify(this.products, null, 2)
      
      console.log("El producto se actualizo con exito", nuevoProducto);
       await fs.writeFileSync(this.path, jsonProductsModif)
}



  async deleteProduct(id) {
      const productFindIndex = this.products.findIndex((product) => product.id === id)

      if (productFindIndex === -1) {
          throw new Error("Product Not found");
      } else {
          this.products.splice(productFindIndex, 1)
          console.log('Product deleted');

          const jsonProducts = JSON.stringify(this.products, null, 2)
          await fs.writeFileSync(this.path, jsonProducts)
      }

  }
}