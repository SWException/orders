import { APIGatewayProxyHandler } from 'aws-lambda';
import Model from 'src/core/model';
import response from 'src/utils/apiResponses';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    if (TOKEN == null) {
        return response(400, "missing token");
    }

    const INTENT_ID = event.pathParameters?.intent;
    if (!(INTENT_ID)) {
        return response(400, "Intent id required!");
    }

    const MODEL: Model = Model.createModel();
    return await MODEL.confirmCheckout(TOKEN, INTENT_ID)
        .then((result: boolean) => result ? response(200, "Order confirmed"):
            response(402, "Payment not confirmed"))
        .catch((err: Error) => response(400, err.message));
}

