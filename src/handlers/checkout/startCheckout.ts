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
    const BODY = JSON.parse(event.body);
    const SHIPPING: string = BODY?.shippingAddress;
    const BILLING: string = BODY?.billingAddress;
    if (!(SHIPPING && BILLING )) {
        return response(400, "ShippingAddress and billingAddress required!");
    }
    const MODEL: Model = Model.createModel();
    const INTENT = await MODEL.startCheckout(USERNAME, SHIPPING, BILLING, TOKEN);

    if (INTENT == null){
        return response(500, "Internal server error");
    }

    return response(200, "Waiting for Payment", INTENT);

}

