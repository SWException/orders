import Product from 'src/Product'
import { DYNAMO } from "src/utils/Dynamo";
import Address from 'src/Address'
import List from 'typescript.list';
import Cart from 'src/Cart';
import generateID from 'src/utils/generateID';

export default class Order {
    private static readonly TABLE = "orders";

    private readonly id: string;
    private readonly date: number;
    private readonly status: string;
    private readonly products: Map<Product, number>;
    private readonly shipping: Address;
    private readonly billing: Address;

    private constructor (id: string, date: number, status: string,
        products: Map<Product, number>, shipping: Address, billing: Address){

        this.id = id;
        this.date = date;
        this.status = status;
        this.products = products;
        this.shipping = shipping;
        this.billing = billing;
    }

    public static async getOrderDetails (id: string): Promise<Order>{
        const ORDER = DYNAMO.get(Order.TABLE, id);
        const DATE = Number(ORDER['date']);
        const PRODUCTS: Map<Product, number> =
            Cart.generateMapFromJson(ORDER['products']);
        const SHIPPING: Address = Address.generateFromJson(ORDER['shipping']);
        const BILLING: Address = Address.generateFromJson(ORDER['billing'])
        return new Order(ORDER['id'], DATE, ORDER['status'],
            PRODUCTS, SHIPPING, BILLING);
    }

    public static async getOrdersGuest (id: string): Promise<List<Order>>{
        console.log(id); // messo il log sennò i test danno errore che l'id non viene mai letto
        
        // TODO
        return null;
    }

    public static async getOrdersSeller (): Promise<List<Order>>{
        // TODO
        return null;
    }

    public static generateOrderFromCart (cart: Cart, shipping: Address,
        billing: Address, status: string): Order {
        const ID: string = generateID();
        const DATE = Date.now();
        return new Order(ID, DATE, status, cart.getProducts(),
            shipping, billing);
    }

    public getJson (): JSON{
        const PRODUCTS_TMP = 
            JSON.stringify(Array.from(this.products.entries()));
        const TMP = {
            id: this.id,
            date: this.date,
            status: this.status,
            products: PRODUCTS_TMP,
            shipping: this.shipping.getJson(),
            billing: this.billing.getJson()
        };
        return JSON.parse(JSON.stringify(TMP));
    }

    public async placeOrder (): Promise<boolean>{
        return DYNAMO.write(Order.TABLE, this.getJson());
    }

}