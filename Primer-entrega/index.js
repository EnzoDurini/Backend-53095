class ProductManager{

    constructor(){
        this.products = [];
    }
    getProducts(){
        return this.products
    }
    addProduct(title,description,price,thumbnail,code,stock){
        let product ={title,description,price,thumbnail,code,stock}
        if (this.products.length === 0){
            product["id"] = 1;
            this.products.push(product)}
            else{
                let verification = this.products.find(prod => prod['code'] === code)
                if(!verification){
                    product ["id"] = this.products[this.products.length - 1]["id"]+1
                    this.products.push(product)
                }
                else{
                    console.log ("Product already exist")
                }
            }
        }

getProductById(prodId){
        let prod =this.products.find(prod => prod['id'] === prodId)
            if(prod == null){
                console.log("Product not found");
                return null;
            }
            else{
                return prod
            }
        }
}





const chairs = new ProductManager();
console.log(chairs.getProducts());
chairs.addProduct(
    "producto prueba",
    "este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    26
)
chairs.addProduct(
    "producto prueba",
    "este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    26
)
console.log(chairs.getProducts())

chairs.getProductById(1)