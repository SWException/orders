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
    return await MODEL.getOrder(TOKEN, ORDER_ID)
        .then(ORDER => {
            if (ORDER)
                return response(200, null, ORDER);
            return response(404, "Order not found");
        })
        .catch((err: Error) => {
            return response(400, err.message);
        });

}

