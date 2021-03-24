import { APIGatewayProxyHandler } from 'aws-lambda';
import Order from 'src/Order';
import API_RESPONSES from "src/utils/apiResponses";
import Cart from "src/Cart";
import Address from "src/Address";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const CART: Cart = Cart.buildFromJson(event.body['products']);
    const SHIPPING: Address = Address.generateFromJson(event.body['shipping']);
    const BILLING: Address = Address.generateFromJson(event.body['billing']);
    const ORDER: Order = Order.generateOrderFromCart(CART, SHIPPING,
        BILLING, event.body['status']);
    const RES: boolean = await ORDER.placeOrder();

    return RES == true ?
        API_RESPONSES._200(null, "success", "order placed"):
        API_RESPONSES._400(null, "error", "order not placed");
}