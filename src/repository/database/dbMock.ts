import Database from "../database";

export default class DbMock implements Database {
    public updateCheckoutStatus(USERNAME: string, ORDER_ID: string, STATUS: string) {
        throw new Error("Method not implemented.");
    }
    public updateOrderStatus(ORDER_ID: string, STATUS: string) {
        throw new Error("Method not implemented.");
    }
    public createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string) {
        throw new Error("Method not implemented.");
    }
}
