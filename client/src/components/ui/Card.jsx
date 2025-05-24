import React, { useState } from 'react'
import { motion } from "motion/react"

const Card = ({ image, id }) => {

    return (
        <motion.div
            className={`relative overflow-hidden h-64 w-64 md:h-[320px] md:w-[320px] bg-slate-400 ${id % 2 === 0 ? "rounded-xl" : "rounded-[3.5rem]"} flex justify-center items-center shadow-2xl`}
            key={image}
        >
            <img src={`/assets/${image}`} alt={"image"} className='w-full h-full object-cover' />
        </motion.div>
    )
}

export default Card