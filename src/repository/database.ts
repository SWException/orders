export default interface Database {
    getOrderById(ORDER_ID: string): Promise<any>;
    getOrder(USERNAME: string, ORDER_ID: string): Promise<any>;
    deleteOrder(USERNAME: string, ORDER_ID: string): Promise<any>;
    getOrdersByStatus(STATUS: string, SEARCH?: string): Promise<any>;
    getOrdersByUsername(USERNAME: string, STATUS?: string): Promise<any>;
    createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string, SHIPPING_FEE: number): Promise<void>;
    updateCheckoutStatus(USERNAME: string, ORDER_ID: string, STATUS: string): Promise<void>;
    updateOrderStatusById(ORDER_ID: string, STATUS: string): Promise<void>;
}