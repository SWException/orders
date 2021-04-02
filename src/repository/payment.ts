export default interface Payment {
    intentIsPaid(INTENT_ID: string);
    createIntent(AMOUNT: number, USERNAME: string);
    cancelIntent(INTENT_ID: string);
}