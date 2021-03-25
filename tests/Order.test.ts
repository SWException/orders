import Order from "src/Order"
import Cart from "src/Cart";
import Address from "src/Address";
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";
import { SCHEMAS, setFormats } from 'src/utils/configAjv';
import { mock } from "jest-mock-extended";

expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const ORDER_SCHEMA: JSONSchema7 = {
    $ref: "src/orders/schema.json#/order"
};
const ORDERS_SCHEMA: JSONSchema7 = {
    $ref: "src/orders/schema.json#/orders"
};

test('schema', () => {
    expect(ORDER_SCHEMA).toBeValidSchema();
    expect(ORDERS_SCHEMA).toBeValidSchema();
});

test('getOrderDetails', async () => {
    const RES = (await Order.getOrderDetails("1")).getJson();
    expect(RES).toMatchSchema(ORDER_SCHEMA);
});

test('getOrdersGuest', async () => {
    const RES = (await Order.getOrdersGuest("1"));
    expect(RES).toMatchSchema(ORDERS_SCHEMA);
});

test('getOrdersSeller', async () => {
    const RES = (await Order.getOrdersSeller());
    expect(RES).toMatchSchema(ORDERS_SCHEMA);
});

test('generateOrderFromCart', () => {
    const CART: Cart = mock<Cart>();
    const RES = Order.generateOrderFromCart(CART, {} as Address, {} as Address, "").getJson();
    expect(RES).toBe(true);
});

test('placeOrder', async () => {
    expect(false).toBe(true);
});
