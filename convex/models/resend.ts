import { Resend } from 'resend';

class ResendManager {
    private API_KEY: string
    client: Resend

    constructor() {
        this.API_KEY = process.env.RESEND_API_KEY!

        if (!this.API_KEY) {
            throw new Error("RESEND_API_KEY is not set")
        }

        this.client = new Resend(this.API_KEY);
    }
}

const resendManager = new ResendManager()
export default resendManager