import Database from "../database";
import * as AWS from "aws-sdk";

export default class Dynamo implements Database {
    private static readonly TABLE_NAME = "orders";
    private static readonly DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });

    public async createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string) {
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            Key: {
                userid: USERNAME,
                timestamp: Date.now()
            },
            Item: {
                shippingAddress: SHIPPING,
                billingAddress: BILLING,
                cart: CART,
                orderid: ORDER_ID,
                status: STATUS
            }
        };

        const DATA = Dynamo.DOCUMENT_CLIENT.put(PARAMS)
            .promise()
            .catch(() => {
                return false;
            });

        return (DATA) ? true : false;
    }

    public async updateOrderStatus(ORDER_ID: string, STATUS: string) {
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            Key: {
                orderid: ORDER_ID
            },
            UpdateExpression: "SET status = :s",
            ExpressionAttributeValues: {
                ":s": STATUS
            },
            IndexName: "id-index"
        }

        const DATA = await Dynamo.DOCUMENT_CLIENT.update(PARAMS)
            .promise()
            .catch((err) => err);
        return DATA;
    }

    public async updateCheckoutStatus(USERNAME: string, ORDER_ID: string, STATUS: string) {
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            Key: {
                userid: USERNAME,
                orderid: ORDER_ID
            },
            UpdateExpression: "SET status = :s",
            ExpressionAttributeValues: {
                ":s": STATUS
            }
        }

        const DATA = await Dynamo.DOCUMENT_CLIENT.update(PARAMS)
            .promise()
            .catch((err) => err);
        return DATA;
    }

    public async getOrderById(ORDER_ID: string) {
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            IndexName: "id-index",
            KeyConditionExpression: "orderid = :order",
            ExpressionAttributeValues: {
                ":order": ORDER_ID
            },
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        return DATA.Items.pop();
    }

    public async getOrder(USERNAME: string, ORDER_ID: string) {
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            IndexName: "user-index",
            KeyConditionExpression: "userid = :user and orderid = :order",
            ExpressionAttributeValues: {
                ":user": USERNAME,
                ":order": ORDER_ID
            },
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        return DATA.Items.pop();
    }

    public async getOrdersByStatus(STATUS: string) {
        const PARAMS = {
            KeyConditionExpression: 'status = :status',
            ExpressionAttributeValues: {
                ":status": STATUS
            },
            TableName: Dynamo.TABLE_NAME,
            ScanIndexForward: false,
            IndexName: "status-index"
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        return DATA.Items;
    }

    public async getOrdersByUsername(USERNAME: string) {
        const PARAMS = {
            KeyConditionExpression: 'userid = :username',
            ExpressionAttributeValues: {
                ":username": USERNAME
            },
            TableName: Dynamo.TABLE_NAME,
            ScanIndexForward: false
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        
        return DATA.Items;
    }
}
