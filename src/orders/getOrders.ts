import { APIGatewayProxyHandler } from 'aws-lambda';
import Order from 'src/Order';
import API_RESPONSES from "src/utils/apiResponses";
import User from 'src/User';
import { getTokenFromEvent } from "src/utils/checkJWT";
import List from 'typescript.list';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN = getTokenFromEvent(event);
    if(TOKEN == null) {
        return API_RESPONSES._400(null, "error", "manca token");
    }
    const USER: User = await User.createUser(TOKEN);
    if (USER && USER.isAuthenticate()) {
        let orders: List<Order> = null;
        if(USER.isClient()){
            orders = await Order.getOrdersGuest(USER.getUsername());
        }
        else {
            orders = await Order.getOrdersSeller();
        }
        let tmp = "";
        orders.forEach((order) =>{
            tmp += JSON.stringify(order.getJson());
        });
        if(tmp == ""){
            return API_RESPONSES._200(null, "success", "nessun ordine");
        }
        return API_RESPONSES._200(null, "success", tmp);
    }
    return API_RESPONSES._400(null, "error", "utente non valido");
}