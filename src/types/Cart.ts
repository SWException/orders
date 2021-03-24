import Product from 'src/Product'
import { DYNAMO } from "src/utils/Dynamo";
import generateID from "src/utils/generateID";

export default class Cart {

    // CAMPI DATI
    private static readonly TABLE = "carts";
    private static readonly PARAM_PRODUCTS = "products";

    private readonly id: string;
    
    // Map of Product and quantity
    private readonly products: Map<Product, number>; 
    private readonly total: number;
    private readonly totalTax: number;

    // INTERFACCIA PUBBLICA
    public getJson (): JSON {
        const JSON_TMP = {
            id: this.id,
            products: [],
            total: this.total,
            tax: this.totalTax
        };
        this.products?.forEach((quantity, product) => {
            const P = product.getJson();
            P['quantity'] = quantity;
            JSON_TMP.products.push(P)
        });
        return JSON.parse(JSON.stringify(JSON_TMP));
    }

    public static async buildCart (id: string): Promise<Cart> {
        const CART_JSON = await DYNAMO.get(Cart.TABLE, id);
        if (CART_JSON == null) {
            console.log("Cart " + id + " not found");
            return new Cart(id, null);
        }

        const PRODUCTS: Map<Product, number> = new Map();

        // Crea tutti i prodotti presenti nel carrello
        // e aspetta che siano creati tutti
        await Promise.all(
            CART_JSON['products'].map(
                async (product: { [key: string]: any }) => {
                    console.log("Building product: " + JSON.stringify(product));
                    const PRODUCT: Product = 
                        await Product.buildProduct(product['id']);

                    console.log("Product build: " + JSON.stringify(PRODUCT));
                    if(PRODUCT)
                        PRODUCTS.set(PRODUCT, product['quantity']);
                }
            )
        );

        return new Cart(CART_JSON['id'], PRODUCTS);
    }

    // sta succedendo qualcosa che non mi piace
    public static buildFromJson (json: any[]): Cart {
        const PRODUCTS: Map<Product, number> = this.generateMapFromJson(json);
        return new Cart(generateID(), PRODUCTS);
    }

    public static async addProduct
    (idCart: string, data: { [key: string]: any}): Promise<boolean> {
        await DYNAMO.append(this.TABLE, 
            this.PARAM_PRODUCTS, idCart, data).catch(
            (err) => {
                console.log(JSON.stringify(err));
                return false;
            });
        return true;
    }

    public static generateMapFromJson (json: any[]): 
    Map<Product, number> {
        const PRODUCTS: Map<Product, number> = new Map<Product, number>();
        json.forEach(async (item) => {
            const PRODUCT: Product = await Product.buildProduct(item['id']);
            PRODUCTS.set(PRODUCT, item['quantity']);
        });
        return PRODUCTS;
    }

    public getProducts (): Map<Product, number> {
        return this.products;
    }

    // METODI PRIVATI
    private constructor (id: string, products: Map<Product, number>) {
        this.id = id;
        this.products = products;
        this.total = this.calculateTotal();
        this.totalTax = this.calculateTax();
        this.total += this.totalTax;
    }

    private calculateTotal (): number {
        let total = 0;
        this.products?.forEach((quantity, product) => {
            total += product["price"] * quantity;
        });
        return total;
    }

    private calculateTax (): number {
        let totalTax = 0;
        this.products?.forEach((quantity, product) => {
            totalTax +=
                ((product["netPrice"] * product["tax"]) / 100) * quantity; 
        });
        return totalTax;
    }
}
