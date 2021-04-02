export default interface Services {
    deleteCart(TOKEN: string);
    getAddress(SHIPPING_ID: string, TOKEN: string);
    getCart(TOKEN: string)
}