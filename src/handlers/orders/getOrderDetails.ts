import { APIGatewayProxyHandler } from 'aws-lambda';
import Order from 'src/Order';
import API_RESPONSES from "src/utils/apiResponses";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const ORDER_ID = event.pathParameters?.id;
    if(ORDER_ID == null){
        return API_RESPONSES._400(null, "error", "manca TOKEN");
    }
    const ORDER = await Order.getOrderDetails(ORDER_ID);
    if(ORDER == null){
        return API_RESPONSES._400(null, "error", "ordine non esistente");
    }
    return API_RESPONSES._200(null,"success",JSON.stringify(ORDER.getJson()));
}
