import AddressesService from "../addressesService";

export default class AddressesServiceMock implements AddressesService {
    public async getAddress(SHIPPING_ID: string, TOKEN: string) {
        if (TOKEN && SHIPPING_ID)
            return {
                "id": "1",
                "description": "Indirizzo Casa",
                "recipientName": "Mario",
                "recipientSurname": "Rossi",
                "address": "Via Roma 12/A",
                "city": "Padova",
                "code": "35100",
                "district": "PD"
            };
        else
            throw new Error("Error fetching address");
    }
}
