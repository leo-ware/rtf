import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mock payment processing function
async function processPayment(paymentData: {
  amount: number;
  paymentMethod: string;
  cardToken?: string;
}): Promise<{
  success: boolean;
  transactionId?: string;
  failureReason?: string;
}> {
  // Mock payment processing - simulate success/failure
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  // 90% success rate for demo purposes
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } else {
    return {
      success: false,
      failureReason: "Payment declined by bank"
    };
  }
}

// Create a new donation
export const createDonation = mutation({
  args: {
    amount: v.number(),
    currency: v.string(),
    donorName: v.string(),
    donorEmail: v.string(),
    donorPhone: v.optional(v.string()),
    isAnonymous: v.boolean(),
    isRecurring: v.boolean(),
    dedicationType: v.optional(v.union(v.literal("honor"), v.literal("memory"))),
    dedicationName: v.optional(v.string()),
    dedicationMessage: v.optional(v.string()),
    paymentMethod: v.string(),
    cardToken: v.optional(v.string()), // In real implementation, this would be from Stripe/payment processor
  },
  handler: async (ctx, args) => {
    // Create donation record with pending status
    const donationId = await ctx.db.insert("donations", {
      amount: args.amount,
      currency: args.currency,
      donorName: args.donorName,
      donorEmail: args.donorEmail,
      donorPhone: args.donorPhone,
      isAnonymous: args.isAnonymous,
      isRecurring: args.isRecurring,
      dedicationType: args.dedicationType,
      dedicationName: args.dedicationName,
      dedicationMessage: args.dedicationMessage,
      paymentMethod: args.paymentMethod,
      paymentStatus: "pending",
      createdAt: Date.now(),
    });

    // Process payment (mocked)
    try {
      const paymentResult = await processPayment({
        amount: args.amount,
        paymentMethod: args.paymentMethod,
        cardToken: args.cardToken,
      });

      if (paymentResult.success) {
        // Update donation record with success
        await ctx.db.patch(donationId, {
          paymentStatus: "completed",
          transactionId: paymentResult.transactionId,
          completedAt: Date.now(),
        });

        return {
          success: true,
          donationId,
          transactionId: paymentResult.transactionId,
        };
      } else {
        // Update donation record with failure
        await ctx.db.patch(donationId, {
          paymentStatus: "failed",
          failureReason: paymentResult.failureReason,
        });

        return {
          success: false,
          donationId,
          error: paymentResult.failureReason,
        };
      }
    } catch (error) {
      // Update donation record with processing error
      await ctx.db.patch(donationId, {
        paymentStatus: "failed",
        failureReason: "Payment processing error",
      });

      return {
        success: false,
        donationId,
        error: "Payment processing failed",
      };
    }
  },
});

// Get donation by ID
export const getDonation = query({
  args: { donationId: v.id("donations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.donationId);
  },
});

// Get donations by donor email
export const getDonationsByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("donations")
      .withIndex("by_donor_email", (q) => q.eq("donorEmail", args.email))
      .order("desc")
      .collect();
  },
});

// Get all donations (admin function)
export const getAllDonations = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    )),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      const query = ctx.db
        .query("donations")
        .withIndex("by_status", (q) => q.eq("paymentStatus", args.status!))
        .order("desc");
        
      if (args.limit) {
        return await query.take(args.limit);
      }
      
      return await query.collect();
    } else {
      const query = ctx.db
        .query("donations")
        .order("desc");
        
      if (args.limit) {
        return await query.take(args.limit);
      }
      
      return await query.collect();
    }
  },
});

// Get donation statistics
export const getDonationStats = query({
  args: {},
  handler: async (ctx) => {
    const donations = await ctx.db.query("donations").collect();
    
    const completed = donations.filter(d => d.paymentStatus === "completed");
    const totalAmount = completed.reduce((sum, d) => sum + d.amount, 0);
    const totalCount = completed.length;
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;
    
    const recurring = completed.filter(d => d.isRecurring).length;
    const oneTime = totalCount - recurring;
    
    return {
      totalAmount,
      totalCount,
      averageAmount,
      recurringCount: recurring,
      oneTimeCount: oneTime,
    };
  },
});
