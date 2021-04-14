import fetch from "node-fetch";
import Services from "../services";

export default class ServicesApi implements Services {
    public async deleteCart(TOKEN: string): Promise<void> {
        return await fetch(process.env.SERVICES + `/cart/`,{
            method: 'DELETE',
            headers: {
                Authorization: TOKEN
            }
        })
        .then(async responseUser => await responseUser.json())
        .then(res => {
            if (res.status == "success")
                return;
            throw new Error((res?.message)? res.message : "Cart error");
        })
        .catch((err: Error) => {
            throw new Error("Error deleting cart. Details: " + err.message);
        })
    }
    
    public async getCart(TOKEN: string): Promise<any> {
        return await fetch(process.env.SERVICES + `/cart/`,{
            method: 'GET',
            headers: {
                Authorization: TOKEN
            }
        })
        .then(async responseUser => await responseUser.json())
        .then(res => {
            if (res.status == "success")
                return res.data;
            throw new Error((res?.message)? res.message : "Cart error");
        })
        .catch((err: Error) => {
            throw new Error("Error fetching cart. Details: " + err.message);
        })
    }

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
