import React, { useContext, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeUpload from './ResumeUpload'
import JobDescriptionUpload from './JobDescriptionUpload'
import { DialogClose } from '@radix-ui/react-dialog'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUserDetailCOntext } from '@/app/Provider'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const CreateInterviewDialog = () => {

    const [file, setFile] = useState<File | null>()
    const [formData, setFormData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const saveInterviewQuestion = useMutation(api.Interview.SaveInterviewQuestion)
    const router = useRouter()
    const onHandleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }))
    }

    const onSubmit = async () => {
        setLoading(true)
        const formData_ = new FormData();
        formData_.append('file', file ?? '');
        formData_.append('jobTitle', formData?.jobTitle)
        formData_.append('jobDescription', formData?.jobDescription);
        try {
            const res = await axios.post('/api/generate-interview-questions', formData_)
            console.log(res.data)

            if (res?.data?.status == 429) {
                toast.warning(res?.data?.result)
                return;
            }
            //savind in database
            // @ts-ignore
            const interviewId = await saveInterviewQuestion({
                questions: res?.data?.questions,
                resumeUrl: res?.data?.resumeUrl ?? '',
                uid: userDetail?._id,
                jobTitle: formData?.jobTitle ?? '',
                jobDescription: formData?.jobDescription ?? ''
            })

            router.push('/interview/' + interviewId)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button>+ Create Interview</Button>
            </DialogTrigger>
            <DialogContent className='min-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Please submit following details</DialogTitle>
                    <DialogDescription>
                        <Tabs defaultValue="resume-upload" className="w-full mt-4">
                            <TabsList>
                                <TabsTrigger value="resume-upload">Resume Upload</TabsTrigger>
                                <TabsTrigger value="job-description">Job Description</TabsTrigger>
                            </TabsList>
                            <TabsContent value="resume-upload"><ResumeUpload setFiles={(file: File) => setFile(file)} /></TabsContent>
                            <TabsContent value="job-description"><JobDescriptionUpload onHandleInputChange={onHandleInputChange} /></TabsContent>
                        </Tabs>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex gap-5'>
                    <DialogClose>
                        <Button variant={'ghost'}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={onSubmit} disabled={loading}>
                        {/* disabled={loading || !file || !formData?.jobTitle?.trim() || !formData?.jobDescription?.trim()} */}
                        {loading && <Loader2Icon className='animate-spin' />}Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateInterviewDialog
