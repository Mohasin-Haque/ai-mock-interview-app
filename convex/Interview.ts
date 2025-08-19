import { v } from "convex/values";
import { mutation } from "./_generated/server";

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