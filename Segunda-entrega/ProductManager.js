import { promises as fs } from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(newProduct) {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    if (
      newProduct.code &&
      newProduct.id &&
      newProduct.title &&
      newProduct.description &&
      newProduct.price &&
      newProduct.thumbnail &&
      newProduct.code &&
      newProduct.stock
    ) {
      const indice = prods.findIndex((prod) => prod.code === newProduct.code);
      if (indice === -1) {
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

  async getProducts() {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    console.log(prods);
  }

  async getProductsById(id) {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const prod = prods.find((prod) => prod.id === id);
    if (prod) {
      console.log(prod);
    } else {
      console.log(`No product with the id: ${id}`);
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
      console.log("Product updated");
    } else {
      console.log(`No product with the id: ${id}`);
    }
  }

  async deleteProduct(id) {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const idProduct = prods.findIndex((prod) => prod.id === id);
    if (idProduct != -1) {
      const prodsfilter = prods.filter((prod) => prod.id != id);
      await fs.writeFile(this.path, JSON.stringify(prods));
      console.log("Product deleted");
    } else {
      console.log(`No product with the id: ${id}`);
    }
  }
}
