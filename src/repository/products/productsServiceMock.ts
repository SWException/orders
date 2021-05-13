import ProductsService from "../productsService";
// products/stock/{id} 
export default class ProductsServiceMock implements ProductsService {
    public async updateStock(PRODUCT_ID: string, QUANTITY: number, TOKEN: string): Promise<boolean> {
        return (PRODUCT_ID && QUANTITY && TOKEN)? true : false;
    }
}
