import Services from "../services";

export default class ServicesMock implements Services {
    deleteCart(TOKEN: string) {
        return TOKEN ? true : false;
    }
    public getCart(TOKEN: string) {
        return TOKEN ? {
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
        } : null;
    }
    public getAddress(SHIPPING_ID: string, TOKEN: string) {
        return TOKEN && SHIPPING_ID ? {
            "id": "1",
            "description": "Indirizzo Casa",
            "recipientName": "Mario",
            "recipientSurname": "Rossi",
            "address": "Via Roma 12/A",
            "city": "Padova",
            "code": "35100",
            "district": "PD"
        } : null;
    }
}
