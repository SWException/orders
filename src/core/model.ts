import Database from "src/repository/database";
import DbMock from "src/repository/database/dbMock";
import Dynamo from "src/repository/database/dynamo";
import Payment from "src/repository/payment";
import PaymentMock from "src/repository/payment/paymentMock";
import Stripe from "src/repository/payment/stripe";
import Services from "src/repository/services";
import ServicesMock from "src/repository/services/servicesMock";
import ServicesApi from "src/repository/services/servicesApi";
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
    private readonly SERVICES: Services;

    private constructor(db: Database, psp: Payment, users: UsersService, services: Services) {
        this.DATABASE = db;
        this.PSP = psp;
        this.USERS = users;
        this.SERVICES = services;
    }

    public static Builder = class ModelBuilder{
        private db: Database;
        private psp: Payment; 
        private users: UsersService;
        private services: Services;

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

        public withServices (services: Services): ModelBuilder{
            this.services = services;
            return this;
        }

        public build (): Model {
            if(this.db && this.psp && this.users && this.services)
                return new Model(this.db, this.psp, this.users, this.services);
            throw new Error("ModelBuilder: Missing some property");
        }
    };

    public static createModel(): Model {
        return new Model
            .Builder()
            .withDatabase(new Dynamo())
            .withPayment(new Stripe())
            .withUsersService(new UsersServiceAPI())
            .withServices(new ServicesApi())
            .build();
    }

    public static createModelMock(): Model {
        return new Model
            .Builder()
            .withDatabase(new DbMock())
            .withPayment(new PaymentMock())
            .withUsersService(new UsersServiceMock())
            .withServices(new ServicesMock())
            .build();
    }

    public async startCheckout(TOKEN: string, SHIPPING_ID: string, BILLING_ID: string): Promise<any> {
        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);

        const CART_PROMISE = this.SERVICES.getCart(TOKEN);
        const CART = await CART_PROMISE;

        const SHIPPING_PROMISE = this.SERVICES.getAddress(SHIPPING_ID, TOKEN);
        const BILLING_PROMISE = this.SERVICES.getAddress(BILLING_ID, TOKEN);
        const INTENT_PROMISE = this.PSP.createIntent(CART["total"], USERNAME);

        const [INTENT, SHIPPING, BILLING] = await Promise.all([INTENT_PROMISE, SHIPPING_PROMISE, BILLING_PROMISE])

        const ORDER_ID = INTENT.id;
        this.DATABASE.createOrder(ORDER_ID, USERNAME, SHIPPING, BILLING, CART, this.STATUS[1]);

        return INTENT;
    }

    public async confirmCheckout(TOKEN: string, INTENT_ID: string): Promise<boolean> {
        const USERNAME = await this.USERS.getCustomerUsername(TOKEN);
        const IS_PAID = await this.PSP.intentIsPaid(INTENT_ID)
        if (USERNAME && IS_PAID) {
            const PROMISE_DB = this.DATABASE.updateCheckoutStatus(USERNAME, INTENT_ID, this.STATUS[2]);
            const PROMISE_CART = this.SERVICES.deleteCart(TOKEN);
            await Promise.all([PROMISE_DB, PROMISE_CART])
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
        // TOKEN già controllato dal metodo chiamante
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
        // TOKEN già controllato dal metodo chiamante
        return await this.DATABASE.getOrderById(ORDER_ID);
    }

    public async refundOrder (TOKEN: string, ORDER_ID: string) {
        const IS_VENDOR = await this.USERS.checkVendor(TOKEN);
        if (IS_VENDOR) {
            await this.PSP.refundIntent(ORDER_ID);
            await this.DATABASE.updateOrderStatusById(ORDER_ID, this.STATUS[3]);
            return true;
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