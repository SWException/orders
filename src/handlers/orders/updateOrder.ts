import { APIGatewayProxyHandler } from 'aws-lambda';
import Model from 'src/core/model';
import response from 'src/utils/apiResponses';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    if (TOKEN == null) {
        return response(400, "missing token");
    }

    const ORDER_ID: string = event.pathParameters?.id;
    if (ORDER_ID == null) {
        return response(400, "missing id order");
    }

    const STATUS: string = event.pathParameters?.id;
    if (STATUS == null) {
        return response(400, "missing new order status");
    }

    const MODEL: Model = Model.createModel();
    return await MODEL.updateOrderStatus(TOKEN, ORDER_ID, STATUS)
        .then((result: boolean) => result ? response(200, "Order status updated") : 
            response(400, "Order status NOT updated"))
        .catch((err: Error) => response(400, err.message));
}

