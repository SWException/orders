import { APIGatewayProxyHandler } from 'aws-lambda';
import Model from 'src/core/model';
import response from 'src/utils/apiResponses';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    if (TOKEN == null) {
        return response(400, "missing token");
    }

    const STATUS: string = event.queryStringParameters?.status;

    const MODEL: Model = Model.createModel();
    return await MODEL.getOrders(TOKEN, STATUS)
        .then(ORDERS => {
            if (ORDERS)
                return response(200, null, ORDERS);
            return response(200, "No orders yet");
        })
        .catch((err: Error) => {
            return response(400, err.message);
        });
}

