import Services from "../services";

export default class ServicesMock implements Services {
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
    public async getAddress(SHIPPING_ID: string, TOKEN: string) {
        if (TOKEN && SHIPPING_ID)
            return {
                "id": "1",
                "description": "Indirizzo Casa",
                "recipientName": "Mario",
                "recipientSurname": "Rossi",
                "address": "Via Roma 12/A",
                "city": "Padova",
                "code": "35100",
                "district": "PD"
            };
        else
            throw new Error("Error fetching address");
    }
}
