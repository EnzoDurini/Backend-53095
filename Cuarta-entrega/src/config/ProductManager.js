import { promises as fs } from "fs";
import crypto from 'crypto';


export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    return prods
  }

  async addProduct(newProduct) {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    if (
      newProduct.title &&
      newProduct.description &&
      newProduct.price &&
      newProduct.thumbnail &&
      newProduct.code &&
      newProduct.stock
    ) {
      const indice = prods.findIndex((prod) => prod.code === newProduct.code);
      if (indice === -1) {
        newProduct.id = crypto.randomBytes(10).toString('hex')
        newProduct.status = true
        prods.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(prods));
        console.log("Product created");
      }else {
        console.log("Product already exist");
      }
    } else {
      console.log("Please enter all product properties");
    }
  }

  

  async getProductsById(id) {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const prod = prods.find((prod) => prod.id === id);
    if (prod) {
      return prod;
    } else {
      return `No product with the id: ${id}`;
    }
  }

  async updateProduct(id, uProduct) {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const idProduct = prods.findIndex((prod) => prod.id === id);
    if (idProduct != -1) {
      prods[idProduct].stock = uProduct.stock;
      prods[idProduct].price = uProduct.price;
      prods[idProduct].title = uProduct.title;
      prods[idProduct].thumbnail = uProduct.thumbnail;
      prods[idProduct].description = uProduct.description;
      prods[idProduct].code = uProduct.code;
      await fs.writeFile(this.path, JSON.stringify(prods));
      return "Product updated"
    } else {
      return `No product with the id: ${id}`
    }
  }

  async deleteProduct(id) {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const idProduct = prods.findIndex((prod) => prod.id === id);
    if (idProduct != -1) {
      const prodsfilter = prods.filter((prod) => prod.id != id);
      await fs.writeFile(this.path, JSON.stringify(prods));
      return "Product deleted"
    } else {
      return `No product with the id: ${id}`
    }
  }
}
