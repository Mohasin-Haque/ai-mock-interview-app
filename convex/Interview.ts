import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const SaveInterviewQuestion = mutation({
    args: {
        questions: v.optional(v.any()),
        uid: v.id('UserTable'),
        resumeUrl: v.union(v.string(), v.null()),
        jobTitle: v.union(v.string(), v.null()),
        jobDescription: v.union(v.string(), v.null()),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('InterviewSessionTable', {
            interviewQuestions: args.questions,
            resumeUrl: args.resumeUrl,
            userId: args.uid,
            status: 'draft',
            jobTitle: args.jobTitle,
            jobDescription: args.jobDescription
        })
        return result;
    }
})

export const GetInterviewQuestions = query({
    args: {
        interviewRecordId: v.id('InterviewSessionTable'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('InterviewSessionTable')
            .filter(q => q.eq(q.field('_id'), args.interviewRecordId))
            .collect()

        return result
    }
})