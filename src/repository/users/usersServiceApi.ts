import fetch from "node-fetch";
import UsersService from "src/repository/usersService";

export default class UsersServiceAPI implements UsersService {

    public async checkVendor (token: string): Promise<boolean> {
        const RES = await this.checkUser(token, "vendors")
        if (RES["status"] == "success")
            return true;
        return false;
    }
    
    public async getCustomerUsername (token: string): Promise<string> {
        const RES = await this.checkUser(token, "customers");
        if(RES["status"] == "success")
            return RES.data.username;
        throw new Error(RES.message);
    }
    
    private async checkUser (token: string, type?: string): Promise<any> {
        const TYPE = (type) ? type + '/' : null;
        return await fetch(process.env.SERVICES + `/users/${TYPE}check/${token}`)
            .then(async responseUser => await responseUser.json());
    }

}