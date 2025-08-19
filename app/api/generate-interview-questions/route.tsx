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
    const formData = await req.formData()
    const file = formData.get('file') as File
    const jobTitle = formData.get('jobTitle') as File
    const jobDescription = formData.get('jobDescription') as File

    if(file){
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

   
        const uploadPdf = await imagekit.upload({
            file: buffer,
            fileName: `uploaded-${Date.now()}.pdf`,
            isPrivateFile: false,
            isPublished: true
        });

    }else{
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