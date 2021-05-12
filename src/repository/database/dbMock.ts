import Database from "../database";

export default class DbMock implements Database {
    public async updateCheckoutStatus(USERNAME: string, ORDER_ID: string, STATUS: string) {
        if(USERNAME && ORDER_ID && STATUS)
            return;
        throw new Error("Missing some parameters");
    }
    public async updateOrderStatusById(ORDER_ID: string, STATUS: string) {
        if(ORDER_ID && STATUS)
            return;
        throw new Error("Missing some parameters");
    }
    public async createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string, SHIPPING_FEE: number) {
        if(ORDER_ID && USERNAME && SHIPPING && BILLING && CART && STATUS && SHIPPING_FEE)
            return;
        throw new Error("Missing some parameters");
    }

    public async getOrderById(ORDER_ID: string) {
        if(ORDER_ID)
            return {
                "id": "1",
                "date": "2021-03-17",
                "state": "pending",
                "userid": "91096bfe-f693-48b9-9efc-eca4de38868d",
                "customer": {
                    "name": "Mario Rossi",
                    "email": "mario.rossi@email.it",
                    "phone": "0491234567"
                },
                "products": [
                    {
                        "id": "prodotto1",
                        "name": "product 1",
                        "price": 50,
                        "quantity": 10
                    },
                    {
                        "id": "prodotto2",
                        "name": "product 2",
                        "price": 20,
                        "quantity": 5
                    }
                ],
                "total": 600,
                "shippingAddress": {
                    "recipientName": "Mario",
                    "recipientSurname": "Rossi",
                    "address": "Via Roma 12/A",
                    "city": "Padova",
                    "code": "35100",
                    "district": "PD"
                },
                "billingAddress": {
                    "recipientName": "Mario",
                    "recipientSurname": "Rossi",
                    "address": "Via Paolotti 12/A",
                    "city": "Treviso",
                    "code": "35101",
                    "district": "TV"
                }
            };
        throw new Error("Missing some parameters");
    }

    public async getOrder(USERNAME: string, ORDER_ID: string) {
        if(USERNAME && ORDER_ID)
            return {
                "billingAddress": {
                    "address": "ViaPadova 11",
                    "city": "Santa Lucia di Piave",
                    "code": "31025",
                    "description": "House",
                    "district": "TV",
                    "id": "7b20c54b-c93a-45d0-b70c-e7543063b0ff",
                    "recipientName": "Gianmarco",
                    "recipientSurname": "Guazzo",
                    "user": "91096bfe-f693-48b9-9efc-eca4de38868d"
                },
                "cart": {
                    "id": "91096bfe-f693-48b9-9efc-eca4de38868d",
                    "itemCount": 3,
                    "products": [
                        {
                            "name": "Peperino comics",
                            "price": 3.36,
                            "primaryPhoto": "https://imagebucket-products-dev.s3.eu-central-1.amazonaws.com/paperino.jpg",
                            "id": "4",
                            "quantity": 1,
                            "tax": 20,
                            "total": 3.36
                        },
                        {
                            "name": "Ball",
                            "price": 60,
                            "primaryPhoto": "https://imagebucket-products-dev.s3.eu-central-1.amazonaws.com/ball.jpg",
                            "id": "10",
                            "quantity": 1,
                            "tax": 20,
                            "total": 60
                        },
                        {
                            "name": "Stereo",
                            "price": 138.72,
                            "primaryPhoto": "https://imagebucket-products-dev.s3.eu-central-1.amazonaws.com/stereo.jpg",
                            "id": "14",
                            "quantity": 1,
                            "tax": 20,
                            "total": 138.72
                        }
                    ],
                    "tax": 40.416,
                    "total": 202.07999999999998
                },
                "orderid": "pi_1IjNrsKnuuioxVCy5XZwSuA7",
                "orderStatus": "Pending",
                "shippingAddress": {
                    "address": "ViaPadova 20",
                    "city": "Treviso",
                    "code": "35010",
                    "description": "House Address",
                    "district": "TV",
                    "id": "aa733f72-6d7b-4e17-ba33-64e30a4cf019",
                    "recipientName": "Gianmarco",
                    "recipientSurname": "Guazzo",
                    "user": "91096bfe-f693-48b9-9efc-eca4de38868d"
                },
                "timestamp": "1619179940787",
                "userid": "91096bfe-f693-48b9-9efc-eca4de38868d"
            };
        throw new Error("Missing some parameters");
    }

    public async getOrdersByStatus(STATUS: string, _SEARCH?: string) {
        if(STATUS)
            return [
                {
                    "orderid": "1",
                    "userid": "91096bfe-f693-48b9-9efc-eca4de38868d",
                    "date": "2021-03-17",
                    "total": 10.99,
                    "articleCount": 3,
                    "status": "payed"
                },
                {
                    "orderid": "2",
                    "userid": "91096bfe-f693-48b9-9efc-eca4de38868d",
                    "date": "2021-03-16",
                    "total": 20.5,
                    "articleCount": 5,
                    "status": "payed"
                },
                {
                    "orderid": "3",
                    "userid": "91096bfe-f693-48b9-9efc-eca4de38868d",
                    "date": "2021-03-15",
                    "total": 10,
                    "articleCount": 2,
                    "status": "payed"
                }
            ];
        throw new Error("Missing some parameters");
    }

    public async getOrdersByUsername(USERNAME: string) {
        if(USERNAME)
            return [
                {
                    "orderId": "1",
                    "userid": "91096bfe-f693-48b9-9efc-eca4de38868d",
                    "date": "2021-03-17",
                    "total": 10.99,
                    "articleCount": 3,
                    "status": "payed"
                },
                {
                    "orderId": "2",
                    "userid": "91096bfe-f693-48b9-9efc-eca4de38868d",
                    "date": "2021-03-16",
                    "total": 20.5,
                    "articleCount": 5,
                    "status": "shipped"
                },
                {
                    "orderId": "3",
                    "userid": "91096bfe-f693-48b9-9efc-eca4de38868d",
                    "date": "2021-03-15",
                    "total": 10,
                    "articleCount": 2,
                    "status": "cancelled"
                }
            ];
        throw new Error("Missing some parameters");
    }
}
