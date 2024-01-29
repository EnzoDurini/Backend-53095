import { ProductManager} from "./ProductManager.js";
import { Product } from "./Product.js";


const prod1 = new Product("salamin" , "corte fino", 1200, 20, "A123")
const prod2 = new Product("salamin" , "corte grueso", 1050, 25, "A124")
const prod3 = new Product("queso" , "cremoso", 1500, 10, "B45")
const prod4 = new Product("mortadela" , "sin tacc", 1400, 5, "C968")

const productManager1 = new ProductManager('./products.json')

//console.log(productManager1.getProducts())
console.log(productManager1.getProductsById('a82c88715d49870f8747'))
