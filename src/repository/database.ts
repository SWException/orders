export default interface Database {
    getOrderById(ORDER_ID: string);
    getOrder(USERNAME: string, ORDER_ID: string);
    getOrdersByStatus(STATUS: string);
    getOrdersByUsername(USERNAME: string);
    createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string);
    updateCheckoutStatus(USERNAME: string, ORDER_ID: string, STATUS: string);
    updateOrderStatus(ORDER_ID: string, STATUS: string);
}