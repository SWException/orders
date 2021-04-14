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
    return await MODEL.cancelCheckout(TOKEN, INTENT_ID)
        .then(IS_CANCELED => {
            if (IS_CANCELED)
                return response(200, "Checkout aborted");
            return response(400, "Checkout NOT aborted. Still waiting for Payment");

        })
        .catch((err: Error) => {
            return response(400, err.message);
        });

}

