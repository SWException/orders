import { APIGatewayProxyHandler } from 'aws-lambda';
import Model from 'src/core/model';
import response from 'src/utils/apiResponses';
import { checkCustomer, checkVendor } from 'src/utils/checkUsers';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    if (TOKEN == null) {
        return response(400, "missing token");
    }

    const MODEL: Model = Model.createModel();
    let orders;

    const USERNAME: string = await checkCustomer(TOKEN);
    if (!USERNAME) {
        const USERNAME: string = await checkVendor(TOKEN);
        if (!USERNAME) {
            return response(401, "Token not valid");
        }

        const STATUS: string = event.queryStringParameters?.status;
        if (STATUS == null) {
            return response(400, "missing status");
        }

        orders = await MODEL.getOrdersForVendor(STATUS);
    }
    else{
        orders = await MODEL.getOrders(USERNAME);
    }


    if (!orders) {
        return response(200, "No orders yet");
    }

    return response(200, null, orders);

}

