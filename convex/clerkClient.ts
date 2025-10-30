import { createClerkClient as createClerkClientSDK } from '@clerk/backend'


export const createClerkClient = () => (
    createClerkClientSDK({ secretKey: process.env.CLERK_SECRET_KEY })
)