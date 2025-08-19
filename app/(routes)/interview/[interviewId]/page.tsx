import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Send } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Interview = () => {
  return (
    <div className='flex flex-col justify-center items-center mt-2'>
      <Image src={'/intervie3d.png'} alt='interview'
      width={400}
      height={160}
      />
      <div className='p-3 flex flex-col items-center space-y-2'>
        <h2 className='font-bold text-3xl text-center'> Ready to start Interview?</h2>
        <p className='text-grey-500 text-center'>
            Please read all instructions carefully.
        </p>
        <Button> Start Interview <ArrowRight /> </Button>

        <hr />

        <h2 className='font-semibold text-2xl'>Want to invite someone for interview?</h2>
        <div className='flex gap-5 w-full items-center max-w-xl'>
            <Input className='w-full' placeholder='Enter email address'/>
            <Button> <Send /> </Button>
        </div>
      </div>
    </div>
  )
}

export default Interview
