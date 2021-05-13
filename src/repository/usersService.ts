export default interface UsersService {
    checkVendor(token: string): Promise<boolean>;
    getCustomerUsername(token: string): Promise<string>;
    getCustomerInfo(token: string, username: string): Promise<any>;
}