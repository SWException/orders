import Database from "../database";

export default class DbMock implements Database {
    public updateCheckoutStatus(USERNAME: string, ORDER_ID: string, STATUS: string) {
        // TODO
        throw new Error("Method not implemented.");
    }
    public updateOrderStatus(ORDER_ID: string, STATUS: string) {
        // TODO
        throw new Error("Method not implemented.");
    }
    public createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string) {
        // TODO
        throw new Error("Method not implemented.");
    }

    public getOrdersById(ORDER_ID: string) {
        // TODO
        throw new Error("Method not implemented.");
    }

    public getOrder(USERNAME: string, ORDER_ID: string) {
        // TODO
        throw new Error("Method not implemented.");
    }

    public getOrdersByStatus(STATUS: string) {
        // TODO
        throw new Error("Method not implemented.");
    }

    public getOrdersByUsername(USERNAME: string) {
        // TODO
        throw new Error("Method not implemented.");
    }
}
