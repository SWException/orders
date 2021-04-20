export default interface UsersService {
    checkVendor(token: string): Promise<boolean>;
    getCustomerUsername(token: string): Promise<string>;
}