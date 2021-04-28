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
    await expect(model.startCheckout(null, "shipping", "billing"))
    .rejects.toThrowError("The token was not valid");
    await expect(model.startCheckout("token", null, null))
    .rejects.toThrowError();
    await expect(model.startCheckout("token", "shipping", null))
    .rejects.toThrowError();
    await expect(model.startCheckout("token", null, "billing"))
    .rejects.toThrowError();
});

test('confirmCheckout', async () => {
    const RES = await model.confirmCheckout("token", "intent");
    expect(RES).toBe(true);
});

test('error confirmCheckout', async () => {
    const RES = await model.confirmCheckout("token", null);
    expect(RES).toBe(false);
    await expect(model.confirmCheckout(null, "intent"))
    .rejects.toThrowError("The token was not valid");
});

test('cancelCheckout', async () => {
    const RES = await model.cancelCheckout("token", "intent");
    expect(RES).toBe(true);
});

test('error cancelCheckout', async () => {
    const RES = await model.cancelCheckout("token", null);
    expect(RES).toBe(false);
    await expect(model.cancelCheckout(null, "intent"))
    .rejects.toThrowError("The token was not valid");
});

test('getOrders', async () => {
    const RES = await model.getOrders("token");
    expect(RES).toMatchSchema(ORDERS_SCHEMA);
});

test('error getOrders', async () => {
    await expect(model.getOrders(null))
    .rejects.toThrowError("The token was not valid");
});

test('getOrdersForVendor', async () => {
    const RES = await model.getOrders("vendor-token", "status");
    expect(RES).toMatchSchema(ORDERS_SCHEMA);
});

test('error getOrdersForVendor', async () => {
    await expect(model.getOrders(null, "status"))
    .rejects.toThrowError("The token was not valid");
    await expect(model.getOrders("vendor-token", null))
    .rejects.toThrowError();
});

test('getOrder', async () => {
    const RES = await model.getOrder("token", "orderId");
    expect(RES).toMatchSchema(ORDER_SCHEMA);
});

test('error getOrder', async () => {
    await expect(model.getOrder(null, "orderId"))
    .rejects.toThrowError();
    await expect(model.getOrder("token", null))
    .rejects.toThrowError();
});

test('getOrderForVendor', async () => {
    const RES = await model.getOrder("vendor-token", "orderId");
    expect(RES).toMatchSchema(ORDER_SCHEMA);
});

test('error getOrderForVendor', async () => {
    await expect(model.getOrder(null, null))
    .rejects.toThrowError();
    await expect(model.getOrder("vendor-token", null))
    .rejects.toThrowError();
});

test('updateOrderStatus', async () => {
    const RES = await model.updateOrderStatus("vendor-token", "orderId", "newStatus");
    expect(RES).toBe(true);
});

test('error updateOrderStatus', async () => {
    const RES = await model.updateOrderStatus("token", "orderId", "newStatus");
    expect(RES).toBe(false);
    const RES_1 = await model.updateOrderStatus(null, "orderId", "newStatus");
    expect(RES_1).toBe(false);
    await expect(model.updateOrderStatus("vendor-token", null, "newStatus"))
    .rejects.toThrowError();
    await expect(model.updateOrderStatus("vendor-token", "orderId", null))
    .rejects.toThrowError();
});

test('refundOrder', async () => {
    const RES = await model.refundOrder("vendor-token", "orderId");
    expect(RES).toBe(true);
});

test('error refundOrder', async () => {
    const RES = await model.refundOrder("token", "orderId");
    expect(RES).toBe(false);
    const RES_1 = await model.refundOrder("vendor-token", null);
    expect(RES_1).toBe(false);
    const RES_2 = await model.refundOrder(null, "orderId");
    expect(RES_2).toBe(false);
});