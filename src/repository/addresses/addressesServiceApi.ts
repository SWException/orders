import fetch from "node-fetch";
import AddressesService from "../addressesService";

export default class AddressesServiceAPI implements AddressesService {
    public async getAddress(SHIPPING_ID: string, TOKEN: string): Promise<any> {
        return await fetch(process.env.SERVICES + `/addresses/${SHIPPING_ID}`,{
            method: 'GET',
            headers: {
                Authorization: TOKEN
            }
        })
        .then(async responseUser => await responseUser.json())
        .then(res => {
            if (res.status == "success")
                return res.data;
            throw new Error((res?.message)? res.message : "Addresses error");
        })
        .catch((err: Error) => {
            throw new Error("Error fetching address. Details: " + err.message);
        })
    }
}
