import { DYNAMO } from "src/utils/Dynamo";
import { buildAjv } from 'src/utils/configAjv';
import Ajv from "ajv"
const AJV: Ajv = buildAjv();

export default class Category {
    private static readonly CATEGORIES_TABLE = "categories";

    // CAMPI DATI
    private readonly id: string;
    private readonly name: string;

    // INTERFACCIA PUBBLICA
    public getJson (): JSON {
        const JSON_TMP = {
            id: this.id,
            name: this.name,
        };
        return JSON.parse(JSON.stringify(JSON_TMP));
    }

    public static async buildCategory (id: string): Promise<Category> {
        const CATEGORY_JSON: JSON = await this.getCategoryFromDB(id);
        if (CATEGORY_JSON == null) {
            console.log("Category " + id + " not found");
            return null;
        }
        console.log("Category " + id + ": " + JSON.stringify(CATEGORY_JSON));
        return new Category(CATEGORY_JSON['id'], CATEGORY_JSON['name']);
    }

    public static async createNewCategory (data: JSON):
    Promise<boolean>{
        const VALID = AJV.validate("src/categories/schema.json#/insertCategory", data);
        if (VALID) {
            const CATEGORY = await DYNAMO.write(this.CATEGORIES_TABLE, data);
            return CATEGORY;
        }
        return false;

    }

    public static async updateCategory (category_id: string, data: JSON): Promise<boolean> {
        const VALID = AJV.validate("src/categories/schema.json#/editCategory", data);
        if (VALID) {
            const CATEGORY = await DYNAMO.update(this.CATEGORIES_TABLE, category_id, data);
            return CATEGORY;
        }
        return false;
    }

    // TODO: per ora ho fatto una cosa semplice,
    //poi è il caso di creare tanti Product e ritornare Array<Product>?
    public static async buildAllCategories () {
        const CATEGORY = await DYNAMO.getScan(this.CATEGORIES_TABLE);
        return CATEGORY;
    }

    // METODI PRIVATI
    private constructor (id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    private static async getCategoryFromDB (id: string): Promise<JSON> {
        const CATEGORY: AWS.DynamoDB.DocumentClient.AttributeMap =
            await DYNAMO.get(this.CATEGORIES_TABLE, id).catch(
                (err) => {
                    console.log(JSON.stringify(err));
                    return null;
                });
        return CATEGORY as JSON;
        // il tipo di Cart è AttributeMap, che è un JSON
        // quindi cambiamo il tipo
    }
}
