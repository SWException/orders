import Address from "src/Address"
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";

import { SCHEMAS, setFormats } from 'src/utils/configAjv';
expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const ADDRESS_SCHEMA: JSONSchema7 = {
    $ref: "src/addresses/schema.json#/address"
};
const ADDRESSES_SCHEMA: JSONSchema7 = {
    $ref: "src/addresses/schema.json#/addresses"
};

test('schema', () => {
    expect(ADDRESS_SCHEMA).toBeValidSchema();
    expect(ADDRESSES_SCHEMA).toBeValidSchema();
});

test('buildAddress', async () => {
    const RES = (await Address.buildAddress("1")).getJson();
    expect(RES).toMatchSchema(ADDRESS_SCHEMA);
});

test('Bad request createNewAddress', async () => {
    const RES = await Address.createNewAddress({});
    expect(RES).toBe(false);
});

test('createNewAddress', async () => {
    const RES = await Address.createNewAddress({
        description: "Indirizzo Bar",
        recipientName: "Andrea",
        recipientSurname: "Giallo",
        address: "Via Luzzati 12/A",
        city: "Verona",
        code: "35130",
        district: "VR",
    });
    expect(RES).toBe(true);
});

test('Bad request updateAddress', async () => {
    const INPUT = {
        dfasfdsf: "sadf"
    }
    const RES = await Address.updateAddress("1", JSON.parse(JSON.stringify(INPUT)));
    expect(RES).toBe(false);
});

test('Null request updateAddress', async () => {
    const RES = await Address.updateAddress("1", null);
    expect(RES).toBe(false);
});

test('updateAddress', async () => {
    const INPUT = {
        id: 3, 
        description: "Indirizzo casa la mare"
    }
    const RES = await Address.updateAddress("1", JSON.parse(JSON.stringify(INPUT)));
    expect(RES).toBe(true);
});

test('getAllAddresses', async () => {
    const RES = await Address.getAllAddresses("1");
    expect(RES).toMatchSchema(ADDRESSES_SCHEMA);
});

test('generateFromJson', () => {
    const ADDRESS = { 
        id: "sdaf", 
        description: "Indirizzo Bar", 
        recipientName: "Andrea", 
        recipientSurname: "Giallo", 
        address: "Via Luzzati 12/A", 
        city: "Verona", 
        code: 35130, 
        district: "VR" 
    };
    const RES = Address.generateFromJson(JSON.parse(JSON.stringify(ADDRESS))).getJson();

    expect(RES).toMatchSchema(ADDRESS_SCHEMA);
    expect(RES.stringify).toBe(ADDRESS);
});