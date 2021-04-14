import { APIGatewayProxyHandler } from 'aws-lambda';
import Model from 'src/core/model';
import response from 'src/utils/apiResponses';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    if (TOKEN == null) {
        return response(400, "missing token");
    }

    const BODY = JSON.parse(event.body);
    const SHIPPING: string = BODY?.shippingAddress;
    const BILLING: string = BODY?.billingAddress;

    if (!(SHIPPING && BILLING )) {
        return response(400, "ShippingAddress and billingAddress required!");
    }

    const MODEL: Model = Model.createModel();
    return await MODEL.startCheckout(TOKEN, SHIPPING, BILLING)
        .then(INTENT => {
            if (INTENT)
                return response(200, "Waiting for Payment", INTENT);
            return response(500, "Internal server error");

        })
        .catch((err: Error) => {
            return response(400, err.message);
        });
}

