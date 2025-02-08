import React from 'react'
import { ArrowRight } from 'lucide-react';

const Button = ({ title, icon = false }) => {
    return (

        <button className={`bg-primary text-white ${icon ? "py-1 px-1 pl-3" : "py-2 px-6"} rounded-full shadow-md hover:bg-white border-2 border-black hover:text-black transition-all duration-300 flex items-center gap-4`}>
            {title}
            {
                icon ? <ArrowRight className="bg-white p-0.5 w-8 h-8 text-black rounded-full border-2 border-black" /> : null
            }
        </button>
    )
}

export default Button