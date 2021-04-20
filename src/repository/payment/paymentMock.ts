import Payment from "../payment";

export default class PaymentMock implements Payment {
    public async cancelIntent(INTENT_ID: string) {
        return INTENT_ID ? true : false
    }
    public async intentIsPaid(INTENT_ID: string) {
        return INTENT_ID ? true : false;
    }
    public async createIntent(AMOUNT: number, USERNAME: string) {
        // TODO
        return AMOUNT && USERNAME ? {"id": "INTENT-ID-123456-ABCDEF"} : null;
    }
    public async refundIntent(INTENT_ID: string): Promise<any> {
        return INTENT_ID ? true : false
    }
}