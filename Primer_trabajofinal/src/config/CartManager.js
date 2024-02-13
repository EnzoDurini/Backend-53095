import {promises as fs} from 'fs'

export class CartManager {
    constructor(path) {
    this.products = path
    }

    async getCart(){
        const cart = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return cart
    }

    async addProductByCart(idProduct, quantity){
        const cart = JSON.parse(await fs.readFile(this.products, 'utf-8'));
        const indice = cart.findIndex(product => product.id == idProduct)

        if(indice != -1){
            cart[indice].quantity += quantity;
            
        } else{
            const product = {id: idProduct, quantity:quantity}
            cart.push(product);
            }
        await fs.writeFile(this.products, JSON.stringify(cart))  
        return "Producto agregado al carrito"
    }



}