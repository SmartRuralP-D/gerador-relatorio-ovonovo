import React from 'react'

const Spinner = () => {
    return (
        <div className="flex justify-center items-center pr-1">
            <div className="animate-spin border-2 rounded-full h-3"></div>
        </div>
    )
}
Spinner.displayName = "Spinner"

export { Spinner }
