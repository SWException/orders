import Payment from "../payment";
import {Stripe as STRIPE_PSP} from 'stripe';
const STRIPE = new STRIPE_PSP (
    process.env.STRIPE_TOKEN,
    {
        apiVersion: '2020-08-27'
    }
);

export default class Stripe implements Payment {
    public async createIntent(AMOUNT: number, USERNAME: string): Promise<any>  {
        const INTENT = await STRIPE.paymentIntents.create({
            amount: AMOUNT * 100,
            currency: 'eur',
            payment_method_types: ['card'],
            statement_descriptor: 'EmporioLambda', // Voce per l'estratto conto
            metadata: {
                username: USERNAME
            }
        });
        return INTENT;
    }

    public async intentIsPaid(INTENT_ID: string): Promise<boolean> {
        const INTENT = await STRIPE.paymentIntents.retrieve(INTENT_ID);
        return (INTENT.status == "succeeded")
    }

    public async cancelIntent(INTENT_ID: string): Promise<boolean> {
        const INTENT = await STRIPE.paymentIntents.cancel(INTENT_ID);
        return (INTENT.status == "canceled")
    }

    public async refundIntent(INTENT_ID: string, AMOUNT?: number): Promise<any> {
        const PARAMS = {
            payment_intent: INTENT_ID,
        }

        if(AMOUNT){
            // Nel caso di rimborso parziale
            PARAMS["amount"] = AMOUNT;
        }

        const REFOUND = await STRIPE.refunds.create(PARAMS);

        return (REFOUND.status == "succeeded"); // CAN BE PENDING
    }
}