import React from 'react'

interface Props {
    title: string;
    isActive?: boolean;
    onClick?:() => void;
}

function NavButton({title, isActive, onClick}: Props) {
  return <button onClick={onClick} className={`${isActive && 'bg-yellow-400'} hover:bg-yellow-500 text-blue-700 py-2 px-4 rounded font-bold`}>{title}</button>
}

export default NavButton