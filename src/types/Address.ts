import { DYNAMO } from "src/utils/Dynamo";

export default class Address {
    private static readonly TABLE = "addresses";

    private readonly id: string;
    private readonly description: string;
    private readonly recipientName: string;
    private readonly recipientSurname: string;
    private readonly address: string;
    private readonly city: string;
    private readonly code: number;
    private readonly district: string;

    public static async buildAddress (id: string): Promise<Address> {
        const ADDRESS_JSON =
            await DYNAMO.get(Address.TABLE, id);
        if(ADDRESS_JSON == null) {
            console.log("Product " + id + " not found");
            return null;
        }
        console.log("Address " + id + ": " + JSON.stringify(ADDRESS_JSON));
        return new Address(ADDRESS_JSON['id'], ADDRESS_JSON['description'],
            ADDRESS_JSON['recipientName'], ADDRESS_JSON['recipientSurname'],
            ADDRESS_JSON['address'], ADDRESS_JSON['city'],
            ADDRESS_JSON['code'], ADDRESS_JSON['district']);
    }

    public static async createNewAddress (data: { [key: string]: any }):
    Promise<boolean> {
        const ADDRESS = await DYNAMO.write(Address.TABLE, data);
        return ADDRESS;
    }

    public static async updateAddress (id: string, data: JSON):
    Promise<boolean> {
        const ADDRESS = await DYNAMO.update(Address.TABLE, id, data);
        return ADDRESS;
    }

    public static async getAllAddresses (user: string): Promise<JSON> {
        console.log(user); // messo questo log sennò i test non compilano perché dice che user non viene mai letto
        
        // TODO chiamata a funzione dynamo che prende tutti i valori con una
        // certa partition key
        
        return null;
    }

    public static generateFromJson (json: JSON): Address {
        return new Address(json['id'], json['description'],
            json['recipientName'], json['recipientSurname'],
            json['address'], json['city'], json['code'], json['district']);
    }

    public getJson (): JSON {
        const TMP = {
            id: this.id,
            description: this.description,
            recipientName: this.recipientName,
            recipientSurname: this.recipientSurname,
            address: this.address,
            city: this.city,
            code: this.code,
            district: this.district
        };
        return JSON.parse(JSON.stringify(TMP));
    }

    private constructor (id: string, description: string,
        recipientName: string, recipientSurname: string,
        address:string, city: string,
        code: number, district: string) {

        this.id = id;
        this.description = description;
        this.recipientName = recipientName;
        this.recipientSurname = recipientSurname;
        this.address = address;
        this.city = city;
        this.code = code;
        this.district = district;
    }

    
}