export default interface CartsService {
    deleteCart(TOKEN: string): Promise<any>;
    getCart(TOKEN: string): Promise<any>;
}