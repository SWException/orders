import Core from "src/core/model"
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";
import { SCHEMAS, setFormats } from 'src/utils/configAjv';

expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

let model = Core.createModelMock();

const ORDER_SCHEMA: JSONSchema7 = {
    $ref: "schemas/orders.json#/order"
};
const ORDERS_SCHEMA: JSONSchema7 = {
    $ref: "schemas/orders.json#/orders"
};

test('schema', () => {
    expect(ORDER_SCHEMA).toBeValidSchema();
    expect(ORDERS_SCHEMA).toBeValidSchema();
});

test('startCheckout', async () => {
    const RES = await model.startCheckout("token", "shipping", "billing");
    expect(typeof RES).toBe("object");
});

test('error startCheckout', async () => {
    expect(model.startCheckout(null, "shipping", "billing"))
    .rejects.toThrowError("The token was not valid");
    expect(model.startCheckout("token", null, null))
    .rejects.toThrowError();
    expect(model.startCheckout("token", "shipping", null))
    .rejects.toThrowError();
    expect(model.startCheckout("token", null, "billing"))
    .rejects.toThrowError();
});

test('confirmCheckout', async () => {
    const RES = await model.confirmCheckout("token", "intent");
    expect(RES).toBe(true);
});

test('error confirmCheckout', async () => {
    expect(model.confirmCheckout(null, "intent"))
    .rejects.toThrowError("The token was not valid");
    expect(model.confirmCheckout("token", null))
    .rejects.toThrowError();
});

test('cancelCheckout', async () => {
    const RES = await model.cancelCheckout("token", "intent");
    expect(RES).toBe(true);
});

test('error cancelCheckout', async () => {
    expect(model.cancelCheckout(null, "intent"))
    .rejects.toThrowError("The token was not valid");
    expect(model.cancelCheckout("token", null))
    .rejects.toThrowError();
});

test('getOrders', async () => {
    const RES = await model.getOrders("token");
    expect(RES).toMatchSchema(ORDERS_SCHEMA);
});

test('error getOrders', async () => {
    expect(model.getOrders(null))
    .rejects.toThrowError("The token was not valid");
});

test('getOrdersForVendor', async () => {
    const RES = await model.getOrders("vendor-token", "status");
    expect(RES).toMatchSchema(ORDERS_SCHEMA);
});

test('error getOrdersForVendor', async () => {
    expect(model.getOrders(null, "status"))
    .rejects.toThrowError("The token was not valid");
    expect(model.getOrders("vendor-token", null))
    .rejects.toThrowError();
});

test('getOrder', async () => {
    const RES = await model.getOrder("token", "order-id");
    expect(RES).toMatchSchema(ORDER_SCHEMA);
});

test('error getOrder', async () => {
    expect(model.getOrder(null, "order-id"))
    .rejects.toThrowError();
    expect(model.getOrder("token", null))
    .rejects.toThrowError();
});

test('getOrderForVendor', async () => {
    const RES = await model.getOrder("vendor-token", "order-id");
    expect(RES).toMatchSchema(ORDER_SCHEMA);
});

test('error getOrderForVendor', async () => {
    expect(model.getOrder(null, null))
    .rejects.toThrowError();
    expect(model.getOrder("vendor-token", null))
    .rejects.toThrowError();
});

test('updateOrderStatus', async () => {
    const RES = await model.updateOrderStatus("vendor-token", "intent", "newStatus");
    expect(RES).toBe(true);
});

test('error updateOrderStatus', async () => {
    const RES = await model.updateOrderStatus("token", "intent", "newStatus");
    expect(RES).toBe(false);
    expect(model.updateOrderStatus(null, "intent", "newStatus"))
    .rejects.toThrowError();
    expect(model.updateOrderStatus("vendor-token", null, "newStatus"))
    .rejects.toThrowError();
    expect(model.updateOrderStatus("vendor-token", "intent", null))
    .rejects.toThrowError();
});

test('refundOrder', async () => {
    const RES = await model.refundOrder("vendor-token", "intent");
    expect(RES).toBe(true);
});

test('error refundOrder', async () => {
    const RES = await model.refundOrder("token", "intent");
    expect(RES).toBe(false);
    expect(model.refundOrder(null, "intent"))
    .rejects.toThrowError();
    expect(model.refundOrder("vendor-token", null))
    .rejects.toThrowError();
});