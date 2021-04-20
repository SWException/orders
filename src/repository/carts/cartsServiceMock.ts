import CartsService from "../cartsService";

export default class CartsServiceMock implements CartsService {
    public async deleteCart(TOKEN: string) {
        if (TOKEN)
            return;
        else
            throw new Error("Error deleting cart");
    }
    public async getCart(TOKEN: string) {
        if (TOKEN) {
            return {
                "id": "1",
                "products": [
                    {
                        "id": "152",
                        "name": "ball",
                        "primaryPhoto": "/image.jpg",
                        "price": 5.95,
                        "quantity": 10
                    }
                ],
                "total": 59.5,
                "tax": 10.73
            };
        } 
        else 
            throw new Error("Error fetching cart");
    }
}
