const express = require('express');
const fs = require('fs');                        // Llamamos al modulo file Sytem y lo agregamos a la variable

class ProductManager {

    products 
    
    constructor(path) {
        this.path = path;
        this.id = 1
    }


    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            if(title && description && price && thumbnail && code && stock ) {
                let producto = {
                    id: this.id++,          
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                } 
                const existingProduct = this.products.find(product => product.code === code);
                  if (existingProduct)
                {
                   console.error('Code already exists');
                   return;
                  }
                const file = await this.getProducts();
                file.push(producto);
                await this.writeFile(this.path, file);
                console.log(`Producto agregado con exito ${this.id}`);

            }else {
                console.log('Validar Campos');
            }
        }  
        catch (error) {
            console.log(`Error ${error}`);
        }
    }

    async getProducts() {
        try { 
            let productsG = await fs.promises.readFile(this.path, 'utf-8');
            let objProducts = JSON.parse(productsG);
            //console.log(objProducts); 
            return objProducts
        } catch (error) {
            console.log(`Error ${error}`);        
        }
    }

   async getProductsById(id) {
        try {
            const file = await this.getProducts(); 
            let find = file.find(item => item.id == id);
            return find ? file[id-1] : "Not found";
        } catch (error) {
            console.log(`Error ${error}`);        
        }
    }

    async delteProduct(id){
        try {
            //await fs.promises.writeFile(this.path, '[]');
            const file = await this.getProducts();
            //console.log(file);
            const fileFilter = file.filter(item => item.id !== id) || null;     // Creamos un array con todos los procudctos que no coincidan con el id
            //console.log(fileFilter);
            await this.writeFile(this.path, fileFilter);
        } catch (error) {
            console.log(`Error ${error}`);        
        }    
    }  

    
    
    async writeFile(path, dataWrite){
        try {
            const writeData = JSON.stringify(dataWrite);
            await fs.promises.writeFile(this.path, writeData);
        } catch (error) {
            console.log(`Error ${error}`);        
        }    
    }



    async updateProduct(id, data){
        try {
            const file = await this.getProducts();
            const findID = file.find(item => item.id == id);
            //console.log(findID);
            if(findID){
                data.id = id;
                file[file.findIndex(item => item.id == id)] = data;
                
                await this.writeFile(this.path, data)
            }
        } catch (error) {
            console.log(`Error ${error}`);        
        }
    }
}



/* http://localhost:8080/products */
/* http://localhost:8080/products/2 */



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.get('/products', async(req, res) => {                               // Creamos el endpoint con la ruta productos, solo para consultas con el metodo get.
    const poductManager = new ProductManager('./products.json');        // Creamos la clase product manager  
    const getProduct = await poductManager.getProducts();
    if(getProduct) {
        const { limit } = req.query;
        limit ? res.status(200).send(getProduct.filter(item => item.id <= limit)) : res.status(200).send(getProduct);
    }
    else {
        res.status(404).send('Not Found');
    }

});



    app.get('/products/:pid', async (req, res) => {                          // Creamos el endpoint con la ruta productos/ y enviar por params el PID, solo para consultas con el metodo get.
        const poductManager = new ProductManager('./products.json');        // Creamos la clase product manager  
        const getProduct = await poductManager.getProducts();
        const { pid } = req.params;
        find = getProduct.find(item => item.id == pid );
        find ? res.status(200).send(find) : res.status(404).send("Not Found");
    });


    const server = app.listen(8080, () => console.log("Server listen in port 8080"));
    server.on("error", error => console.error(error));



        








   