import fetch from 'node-fetch';

export async function checkVendor (token: string): Promise<string> {
    return await checkUser(token, "vendors");
}

export async function checkCustomer (token: string): Promise<string> {
    return await checkUser(token, "customers");
}

export default async function checkUser (token: string, type?: string): Promise<string> {
    return await fetch(process.env.SERVICES + `/users/${(type) ? type + '/' : null}check/${token}`)
        .then(async responseUser => await responseUser.json())
        .then(res => {
            if (res["status"] == "success")
                return res.data.username;
            return null;
        })
        .catch(() => {
            return null;
        })
}