"use client";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import CalenderC from "./Calenderc";
import TimeC from "./TimeC";
import { useDispatch, useSelector } from "react-redux";
import { getAllRentCars, setIsLoading, setRentalDetails, setTotalPrice } from "../../../feature/reducers/carRentSlice";
import Tilt from "react-parallax-tilt";
import CarCard from "./CarCard";
import { RootState } from "../../../feature/store/store";
import { calculateRentalDays } from "@/utils/rentalUtils";





const CarSearch = () => {



  const dispatch = useDispatch()
  const rentCars = useSelector(getAllRentCars);
  const [availableCars, setAvailableCars] = useState(rentCars);
  const [showCalender, setIsShowCalender] = useState<boolean>(false);
  const [showTime, setIsShowTime] = useState<boolean>(false);

  const [showCalenderReturn, setIsShowCalenderReturn] =
    useState<boolean>(false);
  const [showTimeReturn, setIsShowTimeReturn] = useState<boolean>(false);
 




 

 
  const {
    age,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    loading
   
  } = useSelector((state: RootState) => state.carRent);
  const handleAgeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setRentalDetails({age:Number(event.target.value)}));
  };
  const [isSearchComplete, setIsSearchComplete] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  useEffect(() => {
    if (pickupDate) localStorage.setItem("pickupDate", pickupDate);
    if (pickupTime) localStorage.setItem("pickupTime", pickupTime);
    if (returnDate) localStorage.setItem("returnDate", returnDate);
    if (returnTime) localStorage.setItem("returnTime", returnTime);

  }, [pickupDate, pickupTime, returnDate, returnTime]);

  const handleDateSelect = (date: Date | null) => {
    
    dispatch(setRentalDetails({pickupDate:date?.toISOString()}))
    setIsShowCalender(false);
  };

  const handleTimeSelect = (time: string | null) => {
  
    dispatch(setRentalDetails({pickupTime:time?.toString()}))
    setIsShowTime(false);
  };

  const handleDateSelectReturn = (date: Date | null) => {
 
    dispatch(setRentalDetails({returnDate:date?.toISOString()}))
    setIsShowCalenderReturn(false);
  };

  const handleTimeSelectReturn = (time: string | null) => {
   
    dispatch(setRentalDetails({returnTime:time?.toString()}))
    setIsShowTimeReturn(false);
  };
  
  const checkAvailability = () => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
      alert(
        "Bitte wählen Sie sowohl Abhol- als auch Rückgabedatum und -uhrzeit aus."
      );
      return;
    }
    setIsSearchComplete(true);
    dispatch(setIsLoading(true));
    setShowPrice(true)
  
    setTimeout(() => {
      const pickupDateTime = new Date(pickupDate);
      pickupDateTime.setHours(
        Number(pickupTime.split(":")[0]),
        Number(pickupTime.split(":")[1])
      );
  
      const returnDateTime = new Date(returnDate);
      returnDateTime.setHours(
        Number(returnTime.split(":")[0]),
        Number(returnTime.split(":")[1])
      );
  
      const rentalDays = pickupTime && returnTime && pickupDate && returnDate
      ? calculateRentalDays(pickupDate, pickupTime, returnDate, returnTime)
      : 0;
     

      const filteredCars = rentCars.filter((car) => {
        return (
          !car.isBooked &&
          (!car.bookedSlots ||
            !car.bookedSlots.some((slot) => {
              const slotStart = new Date(slot.start);
              const slotEnd = new Date(slot.end);
              return pickupDateTime < slotEnd && returnDateTime > slotStart;
            }))
        );
      });
  
     
      const updatedCars = filteredCars.map((car) => ({
        ...car,
        totalPrice: Number(car.carPrice) * rentalDays, 
      }));
  
     
      setAvailableCars(updatedCars);
      dispatch(setTotalPrice(updatedCars[0]?.totalPrice || 0));
      dispatch(setIsLoading(false));
    }, 2000);
  };
  


  return (
    <div className=" p-4  border-2 w-full rounded-md mb-4 mt-4  ">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-100 rounded-lg py-4 px-1">
        <div className="">
          <p className="pb-2">
            Abhol-& Rückgabeort
          </p>
          <div className="py-2 flex gap-2 items-center px-2 border-2 border-orange-500 rounded-lg">
            <FaMapMarkerAlt className="lg:text-xl text-orange-500 " />
            <span className="text-base">
              <p>Sprendlingen 55576</p>
            </span>
          </div>
        </div>

        <div className="pt-2">
          <p className="">
            Abholdatum-& Uhrzeit
          </p>
          <div className="flex items-center gap-3 border-2 border-orange-500 px-2 py-2 rounded-lg">
            <span className="flex items-center gap-2" onClick={() => setIsShowCalender(!showCalender)}>
              <FaCalendarAlt className="text-xl text-orange-500" />
              <p

                className="cursor-pointer"
              >
                  {pickupDate ? new Date(pickupDate).toLocaleDateString() : "Abhole Datum"}

              </p>
            </span>
            <div className="  w-[1.5px] h-5 bg-slate-400 " />
            <p
              onClick={() => setIsShowTime(!showTime)}
              className="cursor-pointer"
            >
              {pickupTime ? pickupTime : "Zeit"}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <p className="">
            Rückgabedatum- & Uhrzeit
          </p>
          <div className="flex items-center gap-3 border-2 border-orange-500 px-2 py-2 rounded-lg">
            <span className="flex items-center gap-2" onClick={() => setIsShowCalenderReturn(!showCalenderReturn)}>
              <FaCalendarAlt className="text-xl text-orange-500" />
              <p className=" cursor-pointer"
              >
                {returnDate ? new Date(returnDate).toLocaleDateString() : "Rückgabedatum"}

              </p>
            </span>
            <div className="w-[1.5px] h-5 bg-slate-400 " />

            <p
              onClick={() => setIsShowTimeReturn(!showTimeReturn)}
              className=" cursor-pointer"
            >
              {returnTime ? returnTime : "Zeit"}
            </p>
          </div>
        </div>

      </div>


      <p className="text-center py-2 px-2 font-bold bg-orange-500 rounded-lg">Das Auto kann im Umkreis von 20 km zu Ihnen transportiert werden. Rufen Sie für weitere Details gerne an.</p>


      <div className={`mt-3 ${showCalender ? "flex" : "hidden"}`}>
        <CalenderC onDateSelect={handleDateSelect} />
      </div>
      <div className={`mt-3 ${showTime ? "flex" : "hidden"}`}>
        <TimeC onTimeSelect={handleTimeSelect} />
      </div>
      <div className={`mt-3 ${showCalenderReturn ? "flex" : "hidden"}`}>
        <CalenderC onDateSelect={handleDateSelectReturn} />
      </div>
      <div className={`mt-3 ${showTimeReturn ? "flex" : "hidden"}`}>
        <TimeC onTimeSelect={handleTimeSelectReturn} />
      </div>

      <div className="flex items-center justify-around py-10 mt-4 rounded-lg bg-gray-100">
        <div className="flex items-center gap-2">
          <p>Ich bin </p>
          <label className=" relative">
            <select
              value={age ?? ""}
              onChange={handleAgeChange}
              className="border border-gray-300 rounded-md py-1.5 px-2 "
            >
              <option value="" disabled>
                Alter auswählen
              </option>
              {Array.from({ length: 76 }, (_, i) => i + 25).map((ageOption) => (
                <option key={ageOption} value={ageOption}>
                  {ageOption}
                </option>
              ))}
            </select>
          </label>
          {age && <p> Jahre alt</p>}
        </div>
        <div>
          <button
            onClick={checkAvailability}
            className="px-6 py-1 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center mt-4">
          <Tilt className="tilt-effect">
            <div className="loader">
              <div className="loading-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </Tilt>
        </div>
      ) : (
        <div>
          <h2 className="font-bold text-xl mt-4">Verfügbare Autos</h2>
        </div>
      )}

      <div className=" w-full">
        <CarCard availableCars={availableCars} isSearchComplete={isSearchComplete} showPrice={showPrice}/>
      </div>
    </div>
  );
};

export default CarSearch;
