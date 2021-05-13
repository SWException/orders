import Database from "src/repository/database";
import DbMock from "src/repository/database/dbMock";
import Dynamo from "src/repository/database/dynamo";
import Payment from "src/repository/payment";
import PaymentMock from "src/repository/payment/paymentMock";
import StripeService from "src/repository/payment/stripe";
import CartsService from "src/repository/cartsService";
import CartsServiceMock from "src/repository/carts/cartsServiceMock";
import CartsServiceAPI from "src/repository/carts/cartsServiceApi";
import AddressesService from "src/repository/addressesService";
import AddressesServiceMock from "src/repository/addresses/addressesServiceMock";
import AddressesServiceAPI from "src/repository/addresses/addressesServiceApi";
import ProductsService from "src/repository/productsService";
import ProductsServiceMock from "src/repository/products/productsServiceMock";
import ProductsServiceAPI from "src/repository/products/productsServiceApi";
import UsersService from "src/repository/usersService";
import UsersServiceAPI from "src/repository/users/usersServiceApi";
import UsersServiceMock from "src/repository/users/usersServiceMock";


export default class Model {
    private readonly STATUS = {
        0: "Canceled",
        1: "Pending",
        2: "Paid",
        3: "Refunded",
    }
    private readonly DATABASE: Database;
    private readonly PSP: Payment; // Payment Service Provider
    private readonly USERS: UsersService;
    private readonly CARTS: CartsService;
    private readonly ADDRESSES: AddressesService;
    private readonly PRODUCTS: ProductsService;

    private constructor (db: Database, psp: Payment, users: UsersService, carts: CartsService, 
        addresses: AddressesService, products: ProductsService) {
        this.DATABASE = db;
        this.PSP = psp;
        this.USERS = users;
        this.CARTS = carts;
        this.ADDRESSES = addresses;
        this.PRODUCTS = products;
    }

    public static Builder = class ModelBuilder{
        private db: Database;
        private psp: Payment; 
        private users: UsersService;
        private carts: CartsService;
        private addresses: AddressesService;
        private products: ProductsService;

        public withDatabase (db: Database): ModelBuilder{
            this.db = db;
            return this;
        }

        public withPayment (psp: Payment): ModelBuilder{
            this.psp = psp;
            return this;
        }

        public withUsersService (users: UsersService): ModelBuilder{
            this.users = users;
            return this;
        }

        public withCartsService (carts: CartsService): ModelBuilder{
            this.carts = carts;
            return this;
        }

        public withAddressesService (addresses: AddressesService): ModelBuilder{
            this.addresses = addresses;
            return this;
        }

        public withProductsService (products: ProductsService): ModelBuilder{
            this.products = products;
            return this;
        }

        public build (): Model {
            if(this.db && this.psp && this.users && this.carts && this.addresses && this.products)
                return new Model(this.db, this.psp, this.users,
                    this.carts, this.addresses, this.products);
            throw new Error("ModelBuilder: Missing some property");
        }
    };

    public static createModel (): Model {
        return new Model
            .Builder()
            .withDatabase(new Dynamo())
            .withPayment(new StripeService())
            .withUsersService(new UsersServiceAPI())
            .withCartsService(new CartsServiceAPI())
            .withAddressesService(new AddressesServiceAPI())
            .withProductsService(new ProductsServiceAPI())
            .build();
    }

    public static createModelMock (): Model {
        return new Model
            .Builder()
            .withDatabase(new DbMock())
            .withPayment(new PaymentMock())
            .withUsersService(new UsersServiceMock())
            .withCartsService(new CartsServiceMock())
            .withAddressesService(new AddressesServiceMock())
            .withProductsService(new ProductsServiceMock())
            .build();
    }

    public async startCheckout (TOKEN: string, SHIPPING_ID: string, BILLING_ID: string): 
    Promise<any> {
        await this.deletePendingCheckoutIfPresent(TOKEN).catch();

        const SHIPPING_FEE = 5;
        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        const CART_PROMISE = this.CARTS.getCart(TOKEN);
        const CART = await CART_PROMISE;

        const SHIPPING_PROMISE = this.ADDRESSES.getAddress(SHIPPING_ID, TOKEN);
        const BILLING_PROMISE = this.ADDRESSES.getAddress(BILLING_ID, TOKEN);
        const INTENT_PROMISE = this.PSP.createIntent(CART.total+SHIPPING_FEE, USERNAME);
       

        const [INTENT, SHIPPING, BILLING] = 
            await Promise.all([INTENT_PROMISE, SHIPPING_PROMISE, BILLING_PROMISE])

        const ORDER_ID = INTENT.id;
        await this.DATABASE.createOrder(ORDER_ID,
            USERNAME, SHIPPING, BILLING, CART, this.STATUS[1], SHIPPING_FEE);

        return {
            id: ORDER_ID,
            secret: INTENT['client_secret'],
            cartTotal: CART?.total,
            tax: CART?.tax,
            shippingFee: SHIPPING_FEE,
            total: (CART?.total + SHIPPING_FEE),
        };
    }

    public async deletePendingCheckoutIfPresent(TOKEN: string): Promise<void> {
        const ORDERS = await this.getOrders(TOKEN, this.STATUS[1]);
        for await (const ORDER of ORDERS) {
            await this.cancelCheckout(TOKEN, ORDER.orderid).catch(() => false);
        }
    }

    public async confirmCheckout (TOKEN: string, INTENT_ID: string): Promise<boolean> {
        console.log("confirmCheckout - INTENT_ID: ", INTENT_ID);
        
        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        const IS_PAID = await this.PSP.intentIsPaid(INTENT_ID)
        if (USERNAME && IS_PAID) {
            console.log("confirmCheckout - Order paid: ", USERNAME, IS_PAID);

            console.log("calling updateCheckoutStatus");
            const PROMISE_DB = this.DATABASE.updateCheckoutStatus(USERNAME, 
                INTENT_ID, this.STATUS[2]);

            console.log("calling deleteCart");
            const PROMISE_CART = this.CARTS.deleteCart(TOKEN);

            console.log("calling getOrder");
            const PROMISE_PRODUCTS_UPDATE_STOCK = await this.DATABASE.getOrder(USERNAME, INTENT_ID)
                .then((ORDER) => {
                    console.log("response of getOrder: ", ORDER);
                    const PRODUCTS: Array<any> = ORDER.cart.products;
                    return PRODUCTS.map((PRODUCT) => this.PRODUCTS.updateStock(PRODUCT["id"],
                        PRODUCT["quantity"], TOKEN));
                })

            console.log("Aspetto le chiamate a: updateCheckoutStatus, deleteCart e updateStock di " 
                + PROMISE_PRODUCTS_UPDATE_STOCK.length + "prodotti");
            
            await Promise.all([PROMISE_DB, PROMISE_CART, ...PROMISE_PRODUCTS_UPDATE_STOCK]);

            return true;
        }
        console.log("confirmCheckout - Not paid: ", USERNAME, IS_PAID);
        
        return false;
    }

    public async cancelCheckout (TOKEN: string, INTENT_ID: string): Promise<boolean> {
        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        const IS_CANCELLED = await this.PSP.cancelIntent(INTENT_ID)
        if (USERNAME && IS_CANCELLED) {
            await this.DATABASE.updateCheckoutStatus(USERNAME, INTENT_ID, this.STATUS[0])
                .catch(()=>null);
            await this.DATABASE.deleteOrder(USERNAME, INTENT_ID);
            return true;
        }
        return false;
    }

    public async getOrders (TOKEN: string, STATUS?: string, SEARCH?: string): Promise<any> {
        const IS_VENDOR = await this.USERS.checkVendor(TOKEN);
        if(STATUS == "undefined"){
            STATUS = undefined;
        }
        if (IS_VENDOR){
            if(STATUS){
                const ORDERS: Array<any> = await this.getOrdersForVendor(STATUS, SEARCH);
                const PROMISES: Array<Promise<any>> = [];
                let promisesResult: Array<any> = [];
                try {
                    ORDERS.forEach((order, key) => {
                        PROMISES[key] = this.USERS.getCustomerInfo(TOKEN, order?.userid)
                            .catch(() => null);
                    });
                }
                catch(e){
                    console.log(e);
                }
                promisesResult = await Promise.all(PROMISES);
                promisesResult?.forEach((customer, key) => {
                    ORDERS[key]["customer"] = customer;
                });
                return ORDERS;
            }
            throw new Error("Order status not defined!");
        }

        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        return await this.DATABASE.getOrdersByUsername(USERNAME, STATUS);
    }

    private async getOrdersForVendor (STATUS: string, SEARCH?: string): Promise<any> {
        // TOKEN già controllato dal metodo chiamante. NB: questo è un metodo privato
        return await this.DATABASE.getOrdersByStatus(STATUS, SEARCH);
    }

    public async getOrder (TOKEN: string, ORDER_ID: string): Promise<any> {
        const IS_VENDOR = await this.USERS.checkVendor(TOKEN);
        if (IS_VENDOR){
            const ORDER = await this.getOrderForVendor(ORDER_ID);
            ORDER["customer"] = await this.USERS.getCustomerInfo(TOKEN, ORDER?.userid)
                .catch(() => null);
            return ORDER;
        }

        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        const ORDER = await this.DATABASE.getOrder(USERNAME, ORDER_ID);

        if(ORDER.orderStatus == this.STATUS[1]){
            const RES = await this.confirmCheckout(TOKEN, ORDER_ID);
            if(RES){
                ORDER.orderStatus = this.STATUS[2];
            }
        }

        return ORDER;
    }

    private async getOrderForVendor (ORDER_ID: string): Promise<any> {
        // TOKEN già controllato dal metodo chiamante NB: questo è un metodo privato
        return await this.DATABASE.getOrderById(ORDER_ID);
    }

    public async refundOrder (TOKEN: string, ORDER_ID: string): Promise<boolean> {
        const IS_VENDOR: boolean = await this.USERS.checkVendor(TOKEN);
        if (IS_VENDOR) {
            const IS_REFUND: boolean = await this.PSP.refundIntent(ORDER_ID);
            if(IS_REFUND){
                await this.DATABASE.updateOrderStatusById(ORDER_ID, this.STATUS[3]);
                return true;
            }
        }
        return false;
    }

    public async updateOrderStatus (TOKEN: string, ORDER_ID: string, STATUS: string): 
    Promise<boolean>  {
        const IS_VENDOR = await this.USERS.checkVendor(TOKEN);
        if (IS_VENDOR) {
            await this.DATABASE.updateOrderStatusById(ORDER_ID, STATUS);
            return true;
        }
        return false;
    }
}