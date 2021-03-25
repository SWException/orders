import Product from "src/Product"
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";

import { SCHEMAS, setFormats } from 'src/utils/configAjv';
expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const PRODUCT_SCHEMA: JSONSchema7 = {
    $ref: "src/products/schema.json#/product"
};
const PRODUCTS_SCHEMA: JSONSchema7 = {
    $ref: "src/products/schema.json#/products"
};

test('schema', () => {
    expect(PRODUCT_SCHEMA).toBeValidSchema();
    expect(PRODUCTS_SCHEMA).toBeValidSchema();
});

test('buildProduct', async () => {
    const RES = (await Product.buildProduct("1")).getJson();
    expect(RES).toMatchSchema(PRODUCT_SCHEMA);
});

test('Bad request createNewProduct', async () => {
    const RES = await Product.createNewProduct({});
    expect(RES).toBe(false);
});

test('createNewProduct', async () => {
    const RES = await Product.createNewProduct({
        name: "scarpe",
        category: "blabla",
        description: "queste sono delle bellissime scarpe",
        price: 50.00,
        tax: 22,
        stock: 5,
      });
    expect(RES).toBe(true);
});

test('Bad request updateProduct', async () => {
    const INPUT = {
        dfasfdsf: "sadf"
    }
    const RES = await Product.updateProduct("1", JSON.parse(JSON.stringify(INPUT)));
    expect(RES).toBe(false);
});

test('Null request updateProduct', async () => {
    const RES = await Product.updateProduct("1", null);
    expect(RES).toBe(false);
});

test('updateProduct', async () => {
    const INPUT = { id: "123VF", price: 8.00 }
    const RES = await Product.updateProduct("1", JSON.parse(JSON.stringify(INPUT)));
    expect(RES).toBe(true);
});

test('buildAllProduct', async () => {
    const RES = await Product.buildAllProduct(null);
    expect(RES).toMatchSchema(PRODUCTS_SCHEMA);
});
