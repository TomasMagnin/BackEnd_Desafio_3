const express = require("express");
const fs = require("fs");

class ProductManager{

    path;

    constructor(path){
        this.path = path;   // Creamos un objeto con la ruta que le pasamos.
    }

    async addProduct(newProduct) { 
        try { 
            const {title, description, price, thumbnail, code, stock} = newProduct;  // Desestructuramos las propiedaes del objeto newProduct, para asignarlas a variables separadas que le especificamos y luego asignara los valores correspondientes a las variables del objeto newProduct.
            const products = await this.getProducts();                               // usando el metodo get traemos la informacion de nuestro sistema de archivos.
            if(title && description && price && thumbnail && code && stock && this.validateCode(code)) {        // Verificamos que las varibles contengan sus valores respectivamente.
                let product = {
                    id: await this.getNewId(),
                    title,
                    description,
                    price,
                    thumbnail,
                    code, 
                    stock,
                }
                products.push(product);
                //console.log(product);
                await this.saveProduct(this.path, products);
                return `Product ID:${product.id} added !`; 
            }else{
                    return "Error, Validate fields";
                }
        } catch (error) {
            
        }    
    };

    async getProducts() {
        
        try {
            let product = [];
            if(fs.existsSync(this.path)){
                const dataFile = await fs.promises.readFile(this.path, "utf-8");
                return product = JSON.parse(dataFile);
            }else{
                return product;    
            }
        } catch (error) {
            console.log(`Error ${error}`);
        }
    };

    async getProductById(id) { 
        try {
            const products = await this.getProducts();
            const findById =  products.find(item =>item.id === id);
            return findById ? products[id-1] : console.log("Not found");
        } catch (error) {
            console.log(`Error ${error}`);
        }
        
    };
   

    async updateProduct(id, change){
        try {
            const products =await this.getProducts();
            const productIndex = products.findIndex((product) =>  product.id === id);
            if(productIndex === -1){
                return console.log("Not Product");
            }
            const productFind = products[productIndex];
            const productUpdate = {...productFind, ...change};
            products[productIndex] = {...productUpdate, id};
            await this.saveProduct(this.path, products)
        } catch (error) {
            console.log(`Error ${error}`);
        }
             
    };


    async deleteProduct(id){
        try {
            const products = await this.getProducts();
            if(products.some(item => item.id === id)){
                const newProducts = products.filter((product) => product.id !== id);
                await this.saveProduct(this.path, newProducts);
            } else {
                return " Producto no Encontrado";
            }
        } catch (error) {   
            console.log(`Error ${error}`);
        }
    };


    async saveProduct(path, dataProduct){
        try {
            let productsStrFy = JSON.stringify(dataProduct, null, 2);
            await fs.promises.writeFile(path, productsStrFy);
        }
        catch (error) {
            console.log(`Error ${error}`);
       } 
    };


    async validateCode(code) {
        try{
            const products = await this.getProducts();
            const result = products.find(item => item.code === code)
           return result ? false : true;    
        }
        catch(error){
            console.log(`Error ${error}`);
        }
    };

    async getNewId(){
        try {
            let idMax = 0;
            const products = await this.getProducts();
            products.forEach(item => {
                if(item.id > idMax){
                    idMax = item.id;
                }
             });
             return idMax + 1;
        } catch (error) {
            console.log(`Error ${error}`);
        }
    };

};

/* 
const productManager = new ProductManager("../products.json")    // Creo una nueva instancia u objeto de la clase ProductManager.
function main(productManager) {                                 // Creo una funcion main, para poder ejecutar los metodos de la clase y ademas crear la variable con los datos a registrar.

        const product1 = { 
                title: 'Pantalon Rojo', 
                description: 'Talle L', 
                price: '1000', 
                thumbnail: 'http.img1',
                code: 45, 
                stock: 10 
            };

        const product2 = {
                title: 'Pantalon Verde', 
                description: 'Talle M', 
                price: '2000', 
                thumbnail: 'http.img2',
                code: 456, 
                stock: 20,
            };

        const product3 = { 
                title: 'Pantalon Amarillo', 
                description: 'Talle S', 
                price: '3000', 
                thumbnail: 'http.img3',
                code: 456, 
                stock: 30,
            };
     */
/* ----------------------------------------------------------------------------------------------------------------- */
// 1 Leer array de productos)
  /* console.log("Ahora vamos a traer los productos");
    productManager.getProducts().then((response) =>
    console.log(response)); */

// 2 Agregar productos)
   /*  console.log("Vamos Agregar el producto 1"); 
    productManager.addProduct(product1).then((response) =>
    console.log(response)); */

    /* console.log( "Vamos Agregar el producto 2"); 
    productManager.addProduct(product2).then((response) =>
    console.log(response)); */

    /* console.log( "Vamos Agregar el producto 3"); 
    productManager.addProduct(product3).then((response) =>
    console.log(response)); */
     
// 3 Buscamos Productos por ID)    
    /* console.log("Ahora vamos a buscar Productos por ID = 2");
    productManager.getProductById(2).then((response) =>
    console.log(response)); */
   
// 4 Actulizamos contenido de productos enviando el ID y el campo actualizado)        
   /*  console.log("Ahora vamos a actualizar el precio de Producto  ID = 2 a $500");
    productManager.updateProduct(2, {price: 15000}).then((response) =>
    console.log(response)); */
   
// 5 Eliminamos el producto enviando el ID del producto)        
    /* console.log("Ahora vamos a eliminar el producto 3");
    productManager.deleteProduct(3).then((response) =>
    console.log(response)); */
// };

// main(productManager);     // Paso por parametro a la funcion main mi nueva instancia de la clase.
 
const app = expres();
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get(`/products`, async (req, res)=> {
    const productManager = new ProductManager("../products.json")    // Creo una nueva instancia u objeto de la clase ProductManager.
    const viewProducts = await productManager.getProducts();
    if(viewProducts) {
        const {limit} = req.query;
        limit ? res.status(200).send(viewProducts.filter(item => item.id <= limit)) : res.status(200).send(viewProducts);
    } else {
        res.status(400).send("NotFound");
    }
});

app.get(`/products:pid`, async (req, res) => {
    const productManager = new ProductManager("../products.json")    // Creo una nueva instancia u objeto de la clase ProductManager.
    const viewProducts = await productManager.getProducts();

})
