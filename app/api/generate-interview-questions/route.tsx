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
    const formData = await req.formData()
    const file = formData.get('file') as File

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    try {
        const uploadPdf = await imagekit.upload({
            file: buffer,
            fileName: `uploaded-${Date.now()}.pdf`,
            isPrivateFile: false,
            isPublished: true
        });

        //n8n workflow call
        const result = await axios.post('http://localhost:5678/webhook/generate-interview-question', {
            resumeUrl: uploadPdf?.url
        })
        console.log(result.data)

        return NextResponse.json({
            questions: result.data?.message?.content?.interview_questions,
            resumeUrl: uploadPdf?.url
        })
    } catch (e: any) {
        console.error('Upload Failed: ', e)
        return NextResponse.json({ e: e.message }, { status: 503 })
    }
}   