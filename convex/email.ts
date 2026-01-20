import { internalAction, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import resendManager from "./models/resend"
import { internal } from "./_generated/api"

const generateMessageBody = (args: {
    topic: string | undefined
    subject: string
    userEmail: string
    body: string
}) => {
    return `
The following message was submitted to the contact portal on the Return to Freedom website (https://returntofreedom.org).

---
Topic: ${args.topic}
Subject: ${args.subject}
User Email: ${args.userEmail}
---

${args.body}

---
Both parties can reply to this email.
`
}

export const _sendEmailAction = internalAction({
    args: {
        from: v.string(),
        replyTo: v.string(),
        to: v.string(),
        subject: v.string(),
        body: v.string(),
        timeoutMs: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const timeoutMs = args.timeoutMs ?? 1000 * 60 * 5 // 5 minutes
        try {
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => {
                    resolve("TIMEOUT")
                }, timeoutMs)
            })
            const sendPromise = resendManager.client.emails.send({
                from: "noreply@returntofreedom.org",
                replyTo: args.replyTo,
                to: args.to,
                subject: args.subject,
                html: args.body,
            })

            const result = await Promise.race([sendPromise, timeoutPromise])
            if (result === "TIMEOUT") {
                throw new Error("Email sending timed out")
            }
        } catch (error) {
            throw error
        }
    },
})

export const _sendEmail = internalMutation({
    args: {
        emailOutboxId: v.id("emailOutbox"),
    },
    handler: async (ctx, args) => {
        const emailOutbox = await ctx.db.get(args.emailOutboxId)
        if (!emailOutbox) {
            throw new Error(
                `Error fetching emailoutbox with id ${args.emailOutboxId}`,
            )
        }

        await ctx.db.patch(args.emailOutboxId, {
            status: "pending",
            pendingTimestamp: Date.now(),
        })

        try {
            await ctx.scheduler.runAfter(0, internal.email._sendEmailAction, {
                from: "noreply@returntofreedom.org",
                replyTo: emailOutbox.userEmail,
                to: emailOutbox.userEmail,
                subject: emailOutbox.subject,
                body: emailOutbox.body,
            })

            await ctx.db.patch(args.emailOutboxId, {
                status: "sent",
                sentTimestamp: Date.now(),
            })
        } catch (error) {
            await ctx.db.patch(args.emailOutboxId, {
                status: "failed",
                failedTimestamp: Date.now(),
            })
            throw error
        }
    },
})

export const queueEmail = internalMutation({
    args: {
        userEmail: v.string(),
        userName: v.optional(v.string()),
        topic: v.optional(v.string()),
        email: v.string(),
        subject: v.string(),
        body: v.string(),
    },
    handler: async (ctx, args) => {
        const subject = ["RE: Contact Portal Message", args.topic, args.subject]
            .filter((x) => !!x)
            .join(" - ")

        const messageBody = generateMessageBody({
            topic: args.topic,
            subject: subject,
            userEmail: args.userEmail,
            body: args.body,
        })

        const searchText = `
            User Name: ${args.userName}
            User Email: ${args.userEmail}
            Message Topic: ${args.topic}
            Message Subject: ${args.subject}
            Message Body: ${args.body}
            `

        const emailOutboxId = await ctx.db.insert("emailOutbox", {
            userName: args.userName,
            userEmail: args.userEmail,
            internalEmail: "leobpware@gmail.com",
            subject,
            body: messageBody,
            status: "queued",
            searchText,
        })

        try {
            await ctx.runMutation(internal.email._sendEmail, {
                emailOutboxId,
            })
        } catch (error) {
            return {
                status: "failed",
                error: error,
                emailOutboxId: emailOutboxId,
            }
        } finally {
            return {
                status: "success",
                emailOutboxId: emailOutboxId,
            }
        }
    },
})
