import Database from "../database";
import * as AWS from "aws-sdk";

export default class Dynamo implements Database {
    private static readonly TABLE_NAME = "orders";
    private static readonly DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });

    public async createOrder(ORDER_ID: string, USERNAME: string, SHIPPING: string, BILLING: string, CART: { [key: string]: any; }, STATUS: string, SHIPPING_FEE): Promise<any> {
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            Item: {
                userid: USERNAME,
                timestamp: "" + Date.now(),
                shippingAddress: SHIPPING,
                billingAddress: BILLING,
                cart: CART,
                shippingFee: SHIPPING_FEE,
                total: SHIPPING_FEE + CART.total,
                orderid: ORDER_ID,
                orderStatus: STATUS
                
            }
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.put(PARAMS)
            .promise()
            .catch((err) => {
                console.error("createOrder", err);
                return false;
            });

        return (DATA) ? true : false;
    }

    private async updateOrderStatus (USERNAME: string, TIMESTAMP: string, STATUS: string): Promise<any> {
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            Key: {
                userid: USERNAME,
                timestamp: TIMESTAMP
            },
            UpdateExpression: "SET orderStatus = :s",
            ExpressionAttributeValues: {
                ":s": STATUS
            }
        }

        const DATA = await Dynamo.DOCUMENT_CLIENT.update(PARAMS)
            .promise()
        
        console.log("updateCheckoutStatus", DATA);
        return DATA;
    }

    public async updateOrderStatusById(ORDER_ID: string, STATUS: string): Promise<any> {
        const ORDER_TO_UPDATE = await this.getOrderById(ORDER_ID);
        return await this.updateOrderStatus(ORDER_TO_UPDATE.userid, ORDER_TO_UPDATE.timestamp, STATUS);
    }

    public async updateCheckoutStatus(USERNAME: string, ORDER_ID: string, STATUS: string): Promise<any> {
        const ORDER_TO_UPDATE = await this.getOrder(USERNAME, ORDER_ID);
        console.log("updateCheckoutStatus", ORDER_TO_UPDATE);
        
        return await this.updateOrderStatus(USERNAME, ORDER_TO_UPDATE.timestamp, STATUS);
    }

    public async getOrderById(ORDER_ID: string): Promise<any> {
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

    public async getOrder(USERNAME: string, ORDER_ID: string): Promise<any> {
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

    public async getOrdersByStatus(STATUS: string): Promise<any> {
        const PARAMS = {
            KeyConditionExpression: 'orderStatus = :s',
            ExpressionAttributeValues: {
                ":s": STATUS
            },
            TableName: Dynamo.TABLE_NAME,
            ScanIndexForward: false,
            IndexName: "status-index"
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        return DATA.Items;
    }

    public async getOrdersByUsername(USERNAME: string): Promise<any> {
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
