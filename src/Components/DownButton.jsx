import React from 'react'

const DownButton = ({id, onClick }) => {
    return (
        <button className='bg-[#384b60] rounded-lg w-11 h-11 flex justify-center items-center cursor-pointer shadow-md/50 scale-85 md:scale-100' id={id} onClick={onClick}>
            <lord-icon
                src="https://cdn.lordicon.com/gqfozvrp.json"
                trigger="hover"
                colors="primary:#ffffff"
                stroke="bold">
            </lord-icon>
        </button>
    )
}

export default DownButton
