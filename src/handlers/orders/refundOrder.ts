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

    const MODEL: Model = Model.createModel();
    return await MODEL.refundOrder(TOKEN, ORDER_ID)
        .then((result: boolean) => result ? response(200, "Order refunded") :
            response(400, "Order NOT refunded"))
        .catch((err: Error) =>  response(400, err.message));

}

