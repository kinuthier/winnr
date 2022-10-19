import React from 'react'
import NavButton from './NavButton'
import { Bars3BottomRightIcon } from '@heroicons/react/24/solid/'
import { useAddress, useDisconnect } from '@thirdweb-dev/react'

function Header() {
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
   <header className='grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5'>    
        <div className='flex items-center space-x-2 h-1 w-45'>   
        <img 
         className='rounded-full h-20 w-20'
         src="https://imgur.com/NgH7yUm.png" 
         alt="" 
         />
        <div>
            <h1 className='text-lg text-yellow-600 font-bold'>WINNR DRAW</h1>
            <p className='text-xs text-yellow-400 truncate'>User: {address?.substring(0,6)}...{address?.substring(address.length, address.length - 6)}</p>
        </div>
       </div>

        <div className='hidden md:flex md:col-span-3 items-center justify-center rounded-md'>
            <div className='bg-purple-600 rounded p-4 space-x-2'>
               <NavButton isActive title='Buy Tickets'/>
               <NavButton onClick={disconnect} title='LogOut'/>
            </div>
        </div>

        <div className='flex flex-col ml-auto text-right'>
          <Bars3BottomRightIcon className='h-8 w-8 mx-auto text-yellow-200 cursor-pointer' />
          <span className='md:hidden'>
           <NavButton onClick={disconnect} title='LogOut'/>
          </span>
        </div>
   </header>
  )
}

export default Header