export default interface Database {
    createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string);
    updateCheckoutStatus(USERNAME: string, ORDER_ID: string, STATUS: string);
    updateOrderStatus(ORDER_ID: string, STATUS: string);
}