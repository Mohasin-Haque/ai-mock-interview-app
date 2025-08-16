import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const MenuOption =[
    {
        name:'Dashboard',
        path:'/dashboard'
    },
    {
        name:'Upgrade',
        path:'/upgrade'
    },
    {
        name:'How it works',
        path:'/how-it-works'
    }
]

const AppHeader = () => {
  return (
    <div>
      <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Image src={'/logo.svg'} alt='logo' width={30} height={30} />
        {/* <h1 className="text-base font-bold md:text-2xl">Brain Sharp</h1> */}
      </div>
      <div>
        <ul className='flex gap-5'>
            {MenuOption.map((option, index) => (
                <li key={index} className='text-lg hover:scale-105 transition-all cursor-pointer'>{option.name}</li>
            ))}
        </ul>
      </div>
      <UserButton />
    </nav>
    </div>
  )
}

export default AppHeader
