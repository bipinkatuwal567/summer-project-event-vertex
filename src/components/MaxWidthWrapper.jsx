import React from 'react'

const MaxWidthWrapper = ({ children }) => {
    return (
        <div
            className="mx-auto w-full max-w-screen-2xl px-4 md:px-20"
        >
            {children}
        </div>
    )
}

export default MaxWidthWrapper