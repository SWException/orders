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
    public async createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string) {
        if(ORDER_ID && USERNAME && SHIPPING && BILLING && CART && STATUS)
            return;
        throw new Error("Missing some parameters");
    }

    public async getOrderById(ORDER_ID: string) {
        if(ORDER_ID)
            return {
                "id": "1",
                "date": "2021-03-17",
                "state": "pending",
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
                "id": "1",
                "date": "2021-03-17",
                "state": "pending",
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

    public async getOrdersByStatus(STATUS: string) {
        if(STATUS)
            return [
                {
                  "orderId": "1",
                  "customerName": "Mario Rossi",
                  "date": "2021-03-17",
                  "total": 10.99,
                  "articleCount": 3,
                  "status": "payed"
                },
                {
                  "orderId": "2",
                  "customerName": "Mario Rossi",
                  "date": "2021-03-16",
                  "total": 20.5,
                  "articleCount": 5,
                  "status": "payed"
                },
                {
                  "orderId": "3",
                  "customerName": "Mario Rossi",
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
                  "customerName": "Mario Rossi",
                  "date": "2021-03-17",
                  "total": 10.99,
                  "articleCount": 3,
                  "status": "payed"
                },
                {
                  "orderId": "2",
                  "customerName": "Mario Rossi",
                  "date": "2021-03-16",
                  "total": 20.5,
                  "articleCount": 5,
                  "status": "shipped"
                },
                {
                  "orderId": "3",
                  "customerName": "Mario Rossi",
                  "date": "2021-03-15",
                  "total": 10,
                  "articleCount": 2,
                  "status": "cancelled"
                }
              ];
        throw new Error("Missing some parameters");
    }
}
