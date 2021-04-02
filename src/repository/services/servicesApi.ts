import fetch from "node-fetch";
import Services from "../services";

export default class ServicesApi implements Services {
    
    public async getCart(TOKEN: string) {
        return await fetch(process.env.SERVICES + `/carts/`,{
            method: 'GET',
            headers: {
                Authorization: TOKEN
            }
        })
        .then(async responseUser => await responseUser.json())
        .then(res => {
            if (res.status == "success")
                return res.data;
            return null;
        })
        .catch(() => {
            return null;
        })
    }

    public async getAddress(SHIPPING_ID: string, TOKEN: string) {
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
            return null;
        })
        .catch(() => {
            return null;
        })
    }
}
