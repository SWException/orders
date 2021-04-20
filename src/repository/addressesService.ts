export default interface AddressesService {
    getAddress(SHIPPING_ID: string, TOKEN: string): Promise<any>;
}