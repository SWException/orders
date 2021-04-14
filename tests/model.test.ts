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

test('getOrders', async () => {
    const RES = await model.getOrders("token");
    expect(RES).toMatchSchema(ORDERS_SCHEMA);
});

test('getOrdersForVendor', async () => {
    const RES = await model.getOrders("vendor-token", "status");
    expect(RES).toMatchSchema(ORDERS_SCHEMA);
});

test('getOrder', async () => {
    const RES = await model.getOrders("token", "order-id");
    expect(RES).toMatchSchema(ORDER_SCHEMA);
});

test('getOrderForVendor', async () => {
    const RES = await model.getOrders("vendor-token", "order-id");
    expect(RES).toMatchSchema(ORDER_SCHEMA);
});