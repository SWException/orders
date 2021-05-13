export default interface Payment {
    intentIsPaid(INTENT_ID: string): Promise<any>;
    createIntent(AMOUNT: number, USERNAME: string): Promise<any>;
    cancelIntent(INTENT_ID: string): Promise<any>;
    refundIntent(INTENT_ID: string): Promise<boolean>;
}