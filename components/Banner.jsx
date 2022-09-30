import Image from "next/image"
import React from 'react'

const Banner = ({classes = []}) => {
  console.log(classes)
  return (
    <div className={classes}>
        <div className="h-full flex justify-between items-center">
            <h2 className="text-lg font-medium">
                Find a roommate or room for free.
                Roomies has no listing or communication fees.
            </h2>
            <Image src="/banner-image.svg" layout="intrinsic" width={250} height={250}/>
        </div>

    </div>
  )
}

export default Banner