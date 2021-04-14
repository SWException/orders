export default interface Services {
    deleteCart(TOKEN: string): Promise<any>;
    getAddress(SHIPPING_ID: string, TOKEN: string): Promise<any>;
    getCart(TOKEN: string): Promise<any>
}