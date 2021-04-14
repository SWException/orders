import UsersService from "src/repository/usersService";

export default class UsersServiceMock implements UsersService {

    public async checkVendor (token: string): Promise<boolean> {
        if (token == "vendor-token"){
            return true;
        }
        return false;
    }
    
    public async getCustomerUsername (token: string): Promise<string> {
        if (token){
            return "username-mock-example-abc123";
        }
        throw new Error(`The token was not valid`);
    }
    
}