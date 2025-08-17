import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const JobDescriptionUpload = ({onHandleInputChange}:any) => {
    return (
        <div className='border rounded-2xl p-8'>
            <div>
                <label>Job Title</label>
                <Input placeholder='Ex. Software Engineer, React Developer ...' 
                onChange={(e) => onHandleInputChange('jobTitle', e.target.value)}
                />
            </div>
            <div className='mt-4'>
                <label>Job Description</label>
                <Textarea className='min-h-[180px]' placeholder='Paste your Job Desription here ...' 
                onChange={(e) => onHandleInputChange('jobDescription', e.target.value)}
                />
            </div>
        </div>
    )
}

export default JobDescriptionUpload
