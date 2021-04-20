import fetch from "node-fetch";
import ProductsService from "../productsService";

export default class ProductsServiceAPI implements ProductsService {
    public async updateStock(PRODUCT_ID: string, QUANTITY: number, TOKEN: string): Promise<boolean> {
        return await fetch(process.env.SERVICES + `/products/stock/${PRODUCT_ID}`, {
            method: 'PATCH',
            headers: {
                Authorization: TOKEN
            },
            body: JSON.stringify({
                quantity: QUANTITY
            })
        })
        .then(async responseProduct => await responseProduct.json())
        .then(res => {
            if (res.status == "success")
                return true;
            return false;
        })
        .catch((err: Error) => {
            throw new Error("Error updating product "+ PRODUCT_ID +" stock. Details: " + err.message);
        })
    }
}
