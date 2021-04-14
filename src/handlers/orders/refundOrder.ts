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
        .then(IS_REFUNDED => {
            if (IS_REFUNDED)
                return response(200, "Order refunded");
            return response(400, "Order NOT refunded");
        })
        .catch((err: Error) => {
            return response(400, err.message);
        });

}

