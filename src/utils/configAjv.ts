import response from 'schemas/response.json';
import checkout from 'schemas/checkout.json';
import orders from 'schemas/orders.json';
import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';

export const SCHEMAS = {
    schemas: [response as JSONSchema7, orders as JSONSchema7, checkout as JSONSchema7],
    strict: false
};

export function setFormats(ajv): void {
    ajv.addFormat("float", {
        type: "number",
        validate: /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/
    });

    ajv.addFormat("int64", { type: "number", validate: /^\d+$/ });
    ajv.addFormat("uri", { type: "string" });
}

export function buildAjv(): Ajv {
    const AJV: Ajv = new Ajv(SCHEMAS);
    setFormats(AJV);
    return AJV;
}
