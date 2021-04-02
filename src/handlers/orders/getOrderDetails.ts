import { APIGatewayProxyHandler } from 'aws-lambda';
import Model from 'src/core/model';
import response from 'src/utils/apiResponses';
import { checkCustomer, checkVendor } from 'src/utils/checkUsers';

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
    let order;

    const USERNAME: string = await checkCustomer(TOKEN);
    if (!USERNAME) {
        const USERNAME: string = await checkVendor(TOKEN);
        if (!USERNAME) {
            return response(401, "Token not valid");
        }
        order = await MODEL.getOrderForVendor(ORDER_ID);
    }else{
        order = await MODEL.getOrder(USERNAME, ORDER_ID);
    }
    
    if (!order){
        return response(404, "Order not found");
    }

    return response(200, null, order);

}

