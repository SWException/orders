import Payment from "../payment";

export default class PaymentMock implements Payment {
    cancelIntent(INTENT_ID: string) {
        // TODO
        return INTENT_ID ? true : false
    }
    intentIsPaid(INTENT_ID: string) {
        // TODO
        return INTENT_ID ? true : false;
    }
    createIntent(AMOUNT: number, USERNAME: string) {
        // TODO
        return AMOUNT && USERNAME ? null : null;
    }
}