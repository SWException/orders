import Database from "src/repository/database";
import DbMock from "src/repository/database/dbMock";
import Dynamo from "src/repository/database/dynamo";
import Payment from "src/repository/payment";
import PaymentMock from "src/repository/payment/paymentMock";
import Stripe from "src/repository/payment/stripe";
import Services from "src/repository/services";
import ServicesMock from "src/repository/services/servicesMock";
import ServicesApi from "src/repository/services/servicesMock";


export default class Model {
    private readonly STATUS = {
        0: "Canceled",
        1: "Pending",
        2: "Paid",
    }
    private readonly DATABASE: Database;
    private readonly SERVICES: Services;
    private readonly PSP: Payment; // Payment Service Provider

    private constructor(db: Database, psp: Payment, services: Services) {
        this.DATABASE = db;
        this.SERVICES = services;
        this.PSP = psp;
    }

    public static createModel(): Model {
        return new Model(new Dynamo(), new Stripe(), new ServicesApi());
    }

    public static createModelMock(): Model {
        return new Model(new DbMock(), new PaymentMock(), new ServicesMock());
    }

    public async startCheckout(USERNAME: string, SHIPPING_ID: string, BILLING_ID: string, TOKEN: string) {
        //return await this.PSP.createIntent(20, "mariorossi");
        const CART = this.SERVICES.getCart(TOKEN);
        const SHIPPING = this.SERVICES.getAddress(SHIPPING_ID, TOKEN);
        const BILLING = this.SERVICES.getAddress(BILLING_ID, TOKEN);

        const INTENT = this.PSP.createIntent(CART.total, USERNAME);

        const ORDER_ID = INTENT.id;
        this.DATABASE.createOrder(ORDER_ID, USERNAME, SHIPPING, BILLING, CART, this.STATUS[1]);

        return INTENT;
    }

    public async confirmCheckout(USERNAME: string, INTENT_ID: string, TOKEN: string): Promise<boolean> {
        if (await this.PSP.intentIsPaid(INTENT_ID)) {
            const PROMISE_DB = this.DATABASE.updateCheckoutStatus(USERNAME, INTENT_ID, this.STATUS[2]);
            const PROMISE_CART = this.SERVICES.deleteCart(TOKEN);
            await Promise.all([PROMISE_DB, PROMISE_CART])
            return true;
        }
        return false;
    }

    public async cancelCheckout(USERNAME: string, INTENT_ID: string): Promise<boolean> {
        if (await this.PSP.cancelIntent(INTENT_ID)) {
            await this.DATABASE.updateCheckoutStatus(USERNAME, INTENT_ID, this.STATUS[0]);
            return true;
        }
        return false;
    }

    public async getOrders(USERNAME: string){
        return this.DATABASE.getOrdersByUsername(USERNAME);
    }

    public async getOrdersForVendor(STATUS: string) {
        return this.DATABASE.getOrdersByStatus(STATUS);
    }

    public async getOrder(USERNAME: string, ORDER_ID: string) {
        return this.DATABASE.getOrder(USERNAME, ORDER_ID);
    }

    public async getOrderForVendor(ORDER_ID: string) {
        return this.DATABASE.getOrdersById(ORDER_ID);
    }
}