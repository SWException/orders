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

    private constructor(db: Database, psp: Payment, users: UsersService, carts: CartsService, addresses: AddressesService, products: ProductsService) {
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
                return new Model(this.db, this.psp, this.users, this.carts, this.addresses, this.products);
            throw new Error("ModelBuilder: Missing some property");
        }
    };

    public static createModel(): Model {
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

    public static createModelMock(): Model {
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

    public async startCheckout(TOKEN: string, SHIPPING_ID: string, BILLING_ID: string): Promise<any> {
        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);

        const CART_PROMISE = this.CARTS.getCart(TOKEN);
        const CART = await CART_PROMISE;

        const SHIPPING_PROMISE = this.ADDRESSES.getAddress(SHIPPING_ID, TOKEN);
        const BILLING_PROMISE = this.ADDRESSES.getAddress(BILLING_ID, TOKEN);
        const INTENT_PROMISE = this.PSP.createIntent(CART.total, USERNAME);
       

        const [INTENT, SHIPPING, BILLING] = await Promise.all([INTENT_PROMISE, SHIPPING_PROMISE, BILLING_PROMISE])

        const ORDER_ID = INTENT.id;
        await this.DATABASE.createOrder(ORDER_ID, USERNAME, SHIPPING, BILLING, CART, this.STATUS[1]);

        return ORDER_ID;
    }

    public async confirmCheckout(TOKEN: string, INTENT_ID: string): Promise<boolean> {
        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        const IS_PAID = await this.PSP.intentIsPaid(INTENT_ID)
        if (USERNAME && IS_PAID) {
            const PROMISE_DB = this.DATABASE.updateCheckoutStatus(USERNAME, INTENT_ID, this.STATUS[2]);
            const PROMISE_CART = this.CARTS.deleteCart(TOKEN);
            const PROMISE_PRODUCTS_UPDATE_STOCK = await this.DATABASE.getOrder(USERNAME, INTENT_ID)
                .then((ORDER) => {
                    const PRODUCTS: Array<any> = ORDER.cart.products;
                    return PRODUCTS.map((PRODUCT) => this.PRODUCTS.updateStock(PRODUCT["id"], PRODUCT["quantity"], TOKEN));
                })
            await Promise.all([PROMISE_DB, PROMISE_CART, ...PROMISE_PRODUCTS_UPDATE_STOCK]);

            return true;
        }
        return false;
    }

    public async cancelCheckout(TOKEN: string, INTENT_ID: string): Promise<boolean> {
        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        const IS_CANCELLED = await this.PSP.cancelIntent(INTENT_ID)
        if (USERNAME && IS_CANCELLED) {
            await this.DATABASE.updateCheckoutStatus(USERNAME, INTENT_ID, this.STATUS[0]);
            return true;
        }
        return false;
    }

    public async getOrders (TOKEN: string, STATUS?: string): Promise<any> {
        const IS_VENDOR = await this.USERS.checkVendor(TOKEN);
        if (IS_VENDOR){
            if(STATUS)
                return this.getOrdersForVendor(STATUS);
            throw new Error("Order status not defined!");
        }

        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        return await this.DATABASE.getOrdersByUsername(USERNAME);
    }

    private async getOrdersForVendor (STATUS: string): Promise<any> {
        // TOKEN già controllato dal metodo chiamante. NB: questo è un metodo privato
        return await this.DATABASE.getOrdersByStatus(STATUS);
    }

    public async getOrder (TOKEN: string, ORDER_ID: string): Promise<any> {
        const IS_VENDOR = await this.USERS.checkVendor(TOKEN);
        if (IS_VENDOR)
            return await this.getOrderForVendor(ORDER_ID);

        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        return await this.DATABASE.getOrder(USERNAME, ORDER_ID);
    }

    private async getOrderForVendor (ORDER_ID: string): Promise<any> {
        // TOKEN già controllato dal metodo chiamante NB: questo è un metodo privato
        return await this.DATABASE.getOrderById(ORDER_ID);
    }

    public async refundOrder (TOKEN: string, ORDER_ID: string) {
        const IS_VENDOR = await this.USERS.checkVendor(TOKEN);
        if (IS_VENDOR) {
            const IS_REFOUND = await this.PSP.refundIntent(ORDER_ID);
            if(IS_REFOUND){
                await this.DATABASE.updateOrderStatusById(ORDER_ID, this.STATUS[3]);
                return true;
            }
        }
        return false;
    }

    public async updateOrderStatus(TOKEN: string, ORDER_ID: string, STATUS: string): Promise<boolean>  {
        const IS_VENDOR = await this.USERS.checkVendor(TOKEN);
        if (IS_VENDOR) {
            await this.DATABASE.updateOrderStatusById(ORDER_ID, STATUS);
            return true;
        }
        return false;
    }
}