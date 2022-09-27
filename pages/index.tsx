import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import {
  useContract,
  useAddress,
  useContractRead,
  useContractWrite,
} from '@thirdweb-dev/react'
import Login from '../components/Login'
import Loading from './Loading'
import { useState } from 'react'
import { ethers } from 'ethers'
import { currency } from '../Constant'
import CountdownTimer from '../components/CountdownTimer'
import toast from 'react-hot-toast'

const Home: NextPage = () => {
  const address = useAddress();
  const [ quantity, setQuantity] = useState<number>(1);
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );

  const { data: remainingTickets } = useContractRead(
    contract, 
    "RemainingTickets"
  );

  const { data: currentWinningReward } = useContractRead(
    contract, 
    "CurrentWinningReward"
  );

  const { data: ticketPrice } = useContractRead(
    contract, 
    "ticketPrice"
  )
  
  const { data: ticketCommission } = useContractRead(
    contract, 
    "ticketCommission"
  )

  const { data:expiration } = useContractRead(
    contract,
    "expiration"
  )

  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")

  const handleClick = async () => {
    if(!ticketPrice) return;

    const notification = toast.loading('Buying your Tickets...')

    try {
      const data = await BuyTickets ([  {
        value:ethers.utils.parseEther(
          (Number(ethers.utils.formatEther(ticketPrice)) * quantity). toString()
        ),
       }  ]);

      toast.success("Tickets Purchased Successfully!", {
        id: notification,
      });
        
      console.info("contract call success", data)
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
   
      console.error("Contract call failure", err); 
    }
  }

  if (isLoading) return <Loading/>
  if (!address) return <Login />;

  return (
    <div className='bg-gradient-to-r from-pink-900 to-purple-900 min-h-screen flex flex-col'>
      <Head>
        <title>Winnr</title>
      </Head>

      <div className='flex-1'>
      <Header/>
      <div className='space-y-5 md:space-y-0 md:flex md:flex-row items-start justify-center max-w-screen-6xl md:space-x-5'>
        <div className='stats-container'>
          <h1 className='text-5xl text-white font-semibold text-center'>
            The Next Draw
          </h1>
        <div className='flex justify-between p-2 space-x-2'>
          <div className='stats'>
            <h2 className='text-sm'>Total Pool</h2>
            <p className='text-xl'>
              {currentWinningReward && ethers.utils.formatEther(
                currentWinningReward.toString()
              )} {""} {currency}
            </p>
          </div>
          <div className="stats">
            <h2 className='text-sm'>Tickets Remaining</h2>
            <p className='text-xl'>{remainingTickets?.toNumber()}</p>
          </div>
        </div>
        {/*Countdown Timer */}
        <div className='mt-5 mb-3 '>
          <CountdownTimer/>
        </div>
       </div>
       <div className="stats-container space-y-2">
        <div className="stats-container">
          <div className='flex justify-between items-center text-white pb-2'>
            <h2>Price per Ticket</h2>
            <p>
              {ticketPrice &&
              ethers.utils.formatEther(ticketPrice.toString())}{" "}
              {currency}
            </p>
          </div>

          <div className='text-white flex items-center space-x-2 bg-transparent border-yellow-300 border p-4'>
            <p>TICKETS</p>
            <input 
             className='flex w-full bg-transparent text-right outline-none'
             type='number'
             min={1}
             max={10}
             value={quantity}
             onChange={(e) => setQuantity(Number(e.target.value))} 
            />
          </div>

          <div className='space-y-2 mt-5'>
            <div className='flex items-center justify-between text-indigo-300 text-sm italic font-extrabold'>
             <p>Total Cost Of Tickets</p>
             <p>
              {ticketPrice &&
                Number(
                  ethers.utils.formatEther(ticketPrice.toString())
                ) * quantity}{""}
                {currency}
             </p>
            </div>

            <div className='flex items-center justify-between text-indigo-300 text-xs italic'>
              <p>Service Fees</p>
              <p>
              {ticketCommission &&
              ethers.utils.formatEther(ticketCommission.toString())}{" "}
              {currency}
              </p>
            </div>

            <div className='flex items-center justify-between text-indigo-300 text-xs italic'>
              <p>+ Network Fees</p>
              <p>TBC</p>
            </div>
          </div>

          <button disabled={expiration?.toString < Date.now().toString() || remainingTickets?. toNumber() === 0}
          onClick={handleClick}
          className='mt-5 w-full bg-gradient-to-br from-yellow-500 
          to-yellow-300 px-10 py-5 rounded-md text-white shadow-xl 
          disabled: from-gray-600 disabled: text-gray-100
          disabled: to-gray-500 disabled: cursor-not-allowed'>
            Buy Tickets
          </button>
        </div>
      </div>
      </div>
      </div>

      <div>
        //
      </div>
    </div>
  )
}

export default Home
