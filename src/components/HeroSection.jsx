import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'

const HeroSection = () => {
    return (
        <MaxWidthWrapper>
            <div className='flex mx-auto flex-col max-w-3xl justify-center items-center'>
                <h2 className='text-center text-5xl md:text-7xl font-marcellus'>Experience Events Like Never Before.</h2>
                <p className='text-center max-w-xl text-lg'>Lorem ipsum dolor sit amet consectetur. Ac enim tristique blandit fringilla enim consequat. Odio pellentesque aliquam scelerisque elit leo.</p>
                <button className='bg-primary text-white py-2 px-6 rounded-full'>Get Started</button>
            </div>
        </MaxWidthWrapper>
    )
}

export default HeroSection