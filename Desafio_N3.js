const fs = require('fs')                        // Llamamos al modulo file Sytem y lo agregamos a la variable

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

    getProductsById(id) {
        try {
            let find = this.products.find(item => item.id == id);
            return find ? this.products[id-1] : "Not found";
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
            console.log(findID);
            if(findID){
                const aux = file.findIndex(item => item.id == id)
                data.id = id;
                file.splice(aux, 1, data);
                await this.writeFile(this.path, data)
            }
        } catch (error) {
            console.log(`Error ${error}`);        
        }
    }
}


    let poductManager = new ProductManager('./products.json')        // Creamos la clase product manager                

    const main = async () => {
    
    // poductManager.addProduct('Titile1', 'Primer Producto', 5, 'http.img', 456, 40);
    //poductManager.addProduct('Titile2', 'Segundo Producto', '10', 'http.img', 457, 60);
    //poductManager.getProducts(); 
   // poductManager.delteProduct(1);
    poductManager.updateProduct(1,{"id": 1, "title": "Titile2", "description": "Segundo_Producto", "price": 10, "thumbnail": "http.img", code: 457, "stock": 60});
    }

    main()