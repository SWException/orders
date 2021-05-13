export default interface ProductsService {
    updateStock(PRODUCT_ID: string, QUANTITY: number, TOKEN: string): Promise<any>;
}