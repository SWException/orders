import { APIGatewayProxyHandler } from 'aws-lambda';
import Model from 'src/core/model';
import response from 'src/utils/apiResponses';
import { checkCustomer } from 'src/utils/checkUsers';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    if (TOKEN == null) {
        return response(400, "missing token");
    }

    const USERNAME: string = await checkCustomer(TOKEN);
    if (!USERNAME) {
        return response(401, "Token not valid");
    }
    const INTENT_ID = event.pathParameters?.intent;
    if (!(INTENT_ID)) {
        return response(400, "Intent id required!");
    }
    const MODEL: Model = Model.createModel();
    const CANCELED: boolean = await MODEL.cancelCheckout(USERNAME, INTENT_ID);

    if (!CANCELED){
        return response(400, "Waiting for Payment");
    }

    return response(200, "Checkout aborted");

}

