'use client'

import CarSearch from "@/components/car-form/CarSearch";



const page = () => {

 
   
    return (
        <div className={`mx-w-full flex justify-center relative mt-2 `}>
            
         
            <div className={`xl:w-2/3 w-full relative overflow-hidden`}>
                <CarSearch />
            </div>

           
           
        </div>
    );
}

export default page;
