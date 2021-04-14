import Database from "../database";

export default class DbMock implements Database {
    public async updateCheckoutStatus(USERNAME: string, ORDER_ID: string, STATUS: string) {
        if(USERNAME && ORDER_ID && STATUS)
            return;
        throw new Error("Missing some parameters");
    }
    public async updateOrderStatusById(ORDER_ID: string, STATUS: string) {
        if(ORDER_ID && STATUS)
            return;
        throw new Error("Missing some parameters");
    }
    public async createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string) {
        if(ORDER_ID && USERNAME && SHIPPING && BILLING && CART && STATUS)
            return;
        throw new Error("Missing some parameters");
    }

    public async getOrderById(ORDER_ID: string) {
        if(ORDER_ID)
            return true;
        throw new Error("Missing some parameters");
    }

    public async getOrder(USERNAME: string, ORDER_ID: string) {
        if(USERNAME && ORDER_ID)
            return true;
        throw new Error("Missing some parameters");
    }

    public async getOrdersByStatus(STATUS: string) {
        if(STATUS)
            return true;
        throw new Error("Missing some parameters");
    }

    public async getOrdersByUsername(USERNAME: string) {
        if(USERNAME)
            return true;
        throw new Error("Missing some parameters");
    }
}
