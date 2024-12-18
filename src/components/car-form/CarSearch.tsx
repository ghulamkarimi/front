"use client";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import CalenderC from "./Calenderc";
import TimeC from "./TimeC";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRentCars,
  setIsLoading,
  setRentalDetails,
  setTotalPrice,
} from "../../../feature/reducers/carRentSlice";
import Tilt from "react-parallax-tilt";
import CarCard from "./CarCard";
import { RootState } from "../../../feature/store/store";
import { calculateRentalDays } from "@/utils/rentalUtils";

const CarSearch = () => {
  const dispatch = useDispatch();
  const rentCars = useSelector(getAllRentCars);
  const [availableCars, setAvailableCars] = useState(rentCars);
  const [showCalender, setIsShowCalender] = useState<boolean>(false);
  const [showTime, setIsShowTime] = useState<boolean>(false);

  const [showCalenderReturn, setIsShowCalenderReturn] =
    useState<boolean>(false);
  const [showTimeReturn, setIsShowTimeReturn] = useState<boolean>(false);

  const { age, pickupDate, pickupTime, returnDate, returnTime } =
    useSelector((state: RootState) => state.carRent);
  const handleAgeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setRentalDetails({ age: Number(event.target.value) }));
  };
  const [isSearchComplete, setIsSearchComplete] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  
if (typeof window !== "undefined") {
  
  useEffect(() => {
    if (pickupDate) localStorage.setItem("pickupDate", pickupDate);
    if (pickupTime) localStorage.setItem("pickupTime", pickupTime);
    if (returnDate) localStorage.setItem("returnDate", returnDate);
    if (returnTime) localStorage.setItem("returnTime", returnTime);
  }, [pickupDate, pickupTime, returnDate, returnTime]);

}
  const handleDateSelect = (date: Date | null) => {
    const today = new Date();
    if (date && date >= new Date(today.setHours(0, 0, 0, 0))) { 
      dispatch(setRentalDetails({ pickupDate: date.toISOString() }));
      setIsShowCalender(false);
    } else {
      alert("Vergangene Daten können nicht ausgewählt werden.");
    }
  };
  


  
  const handleTimeSelect = (time: string | null) => {
  
    const cleanedPickupTime = time?.replace(/[^0-9:]/g, "") || "";
  
    // Extrahiere nur das Datum und setze eine Standardzeit (z.B. `T00:00`) falls keine Zeit ausgewählt wurde
    const pickupDatePart = localStorage.getItem("pickupDate")!.split("T")[0];
    const pickupTimePart = cleanedPickupTime ? `T${cleanedPickupTime}:00` : "T00:00";
  
    
    const pickupDateTime = `${pickupDatePart}${pickupTimePart}`;
  
    
  
    // Überprüfe, ob die gewählte Zeit in der Zukunft liegt
    if (new Date(pickupDateTime).getTime() > new Date().getTime()) {
      dispatch(setRentalDetails({ pickupTime: time || "" }));
    } else {
      alert("Vergangene Zeiten sind nicht erlaubt.");
    }
    setIsShowTime(false);
  };
  
  
  
    
   

  const handleDateSelectReturn = (date: Date | null) => {
    dispatch(setRentalDetails({ returnDate: date?.toISOString() }));
    setIsShowCalenderReturn(false);
  };

  const handleTimeSelectReturn = (time: string | null) => {
    dispatch(setRentalDetails({ returnTime: time?.toString() }));
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
    setShowPrice(true);

    setTimeout(() => {
     // const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
    //  const returnDateTime = new Date(`${returnDate}T${returnTime}:00`);
    const cleanedPickupTime = pickupTime?.replace(/[^0-9:]/g, "") || "";
  const cleanedReturnTime = returnTime?.replace(/[^0-9:]/g, "") || "";
  
      const pickupDateTime = `${pickupDate.split("T")[0]}T${cleanedPickupTime}:00`;
      const returnDateTime = `${returnDate.split("T")[0]}T${cleanedReturnTime}:00`;

      if (pickupDateTime >= returnDateTime) {
        alert("Das Rückgabedatum muss nach dem Abholdatum liegen.");
        dispatch(setIsLoading(false));
        return;
      }

      const rentalDays = calculateRentalDays(
        pickupDate,
        pickupTime,
        returnDate,
        returnTime
      );
     
      const filteredCars = rentCars.filter((car) => {
        const isCarUnavailable = car.bookedSlots?.some((slot) => {
          const slotStart = new Date(slot.start).getTime();
          const slotEnd = new Date(slot.end).getTime();
          const selectedStart = new Date(pickupDateTime).getTime();
          const selectedEnd = new Date(returnDateTime).getTime();

       

          // Überlappungsprüfung: Verhindert Zeiträume, die mit dem gewünschten kollidieren
          return !(selectedEnd <= slotStart || selectedStart >= slotEnd);
        });

        // Nur Autos, die nicht gebucht sind, einbeziehen
        return !isCarUnavailable;
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
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="font-medium text-gray-700">Abhol- & Rückgabeort</p>
        <div className="flex items-center border border-orange-600 rounded-lg px-4 py-2 mt-2">
          <FaMapMarkerAlt className="text-orange-600" />
          <p className="ml-3 text-gray-600">Sprendlingen 55576</p>
        </div>
      </div>
      <div>
          <p className="font-medium text-gray-700">Abholdatum & Uhrzeit</p>
          <div className="flex items-center border border-orange-600 rounded-lg px-4 py-2 mt-2">
            <span
              className="flex items-center cursor-pointer"
              onClick={() => setIsShowCalender(!showCalender)}
            >
              <FaCalendarAlt className="text-orange-600" />
              <p className="ml-3 text-gray-600">
                {pickupDate
                  ? new Date(pickupDate).toLocaleDateString()
                  : "Datum"}
              </p>
            </span>
            <div className="mx-4 border-l border-gray-300 h-6"></div>
            <p
              className="cursor-pointer text-gray-600"
              onClick={() => setIsShowTime(!showTime)}
            >
              {pickupTime ? pickupTime : "Uhrzeit"}
            </p>
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-700">Rückgabedatum & Uhrzeit</p>
          <div className="flex items-center border border-orange-600 rounded-lg px-4 py-2 mt-2">
            <span
              className="flex items-center cursor-pointer"
              onClick={() => setIsShowCalenderReturn(!showCalenderReturn)}
            >
              <FaCalendarAlt className="text-green-600" />
              <p className="ml-3 text-gray-600">
                {returnDate
                  ? new Date(returnDate).toLocaleDateString()
                  : "Datum"}
              </p>
            </span>
            <div className="mx-4 border-l border-gray-300 h-6"></div>
            <p
              className="cursor-pointer text-gray-600"
              onClick={() => setIsShowTimeReturn(!showTimeReturn)}
            >
              {returnTime ? returnTime : "Uhrzeit"}
            </p>
          </div>
        </div>
      </div>

      {showCalender && (
        <div className="mt-4">
          <CalenderC onDateSelect={handleDateSelect} />
        </div>
      )}
      {showTime && (
        <div className="mt-4">
          <TimeC onTimeSelect={handleTimeSelect} disabledPastTime={true} />
        </div>
      )}
      {showCalenderReturn && (
        <div className="mt-4">
          <CalenderC onDateSelect={handleDateSelectReturn} />
        </div>
      )}
      {showTimeReturn && (
        <div className="mt-4">
          <TimeC onTimeSelect={handleTimeSelectReturn} disabledPastTime={false} />
        </div>
      )}

      <p className="mt-6 text-center text-sm bg-green-100 text-green-700 py-2 rounded-lg">
        Das Auto kann im Umkreis von 20 km zu Ihnen transportiert werden. Rufen
        Sie für weitere Details gerne an.
      </p>

      <div className="flex justify-between items-center mt-8 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <p className="text-gray-700">Ich bin</p>
          <select
            value={age ?? ""}
            onChange={handleAgeChange}
            className="ml-2 border border-gray-300 rounded-lg py-1 px-3"
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
          {age && <p className="ml-2 text-gray-700">Jahre alt</p>}
        </div>
        <button
          onClick={checkAvailability}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Suchen
        </button>
      </div>

      {showPrice && (
        <div className="flex justify-center items-center mt-6">
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
      )}

      {!showPrice && (
        <div>
          <h2 className="font-bold text-xl text-gray-700 mt-6">
            Verfügbare Autos
          </h2>
        </div>
      )}

      <div className="mt-4">
        <CarCard
          availableCars={availableCars}
          isSearchComplete={isSearchComplete}
          showPrice={showPrice}
        />
      </div>
    </div>
  );
};

export default CarSearch;