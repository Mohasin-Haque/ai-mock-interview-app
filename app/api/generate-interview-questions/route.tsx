import { aj } from "@/utils/arcjet";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { error } from "console";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_URL_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
});

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser()
        const formData = await req.formData()
        const file = formData.get('file') as File
        const jobTitle = formData.get('jobTitle') as File
        const jobDescription = formData.get('jobDescription') as File

        const decision = await aj.protect(req, { userId:user?.primaryEmailAddress?.emailAddress ?? '', requested: 5 }); // Deduct 5 tokens from the bucket
        console.log("Arcjet decision", decision);

        // @ts-ignore
        if(decision?.reason?.remaining == 0){
            return NextResponse.json({
                status: 429,
                message: 'You have reached your limit for today. Please go pro or try again after 24 hours.'
            })
        }

        if (file) {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)


            const uploadPdf = await imagekit.upload({
                file: buffer,
                fileName: `uploaded-${Date.now()}.pdf`,
                isPrivateFile: false,
                isPublished: true
            });

             //n8n workflow call
            const result = await axios.post('http://localhost:5678/webhook/generate-interview-question', {
                resumeUrl: uploadPdf?.url,
            })
            console.log(result.data)

            return NextResponse.json({
                questions: result.data?.message?.content?.questions,
                resumeUrl: uploadPdf?.url,
                status: 200
            })

        } else {
            //n8n workflow call
            const result = await axios.post('http://localhost:5678/webhook/generate-interview-question', {
                resumeUrl: null,
                jobTitle: jobTitle,
                jobDescription: jobDescription
            })
            console.log(result.data)

            return NextResponse.json({
                questions: result.data?.message?.content?.questions,
                resumeUrl: null
            })

        }
    } catch (e: any) {
        console.error('Upload Failed: ', e)
        return NextResponse.json({ e: e.message }, { status: 503 })
    }
}   