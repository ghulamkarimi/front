"use client";

import RentalLocationCard from "@/components/cards/RentalLocationCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../feature/store/store";
import { calculateRentalDays } from "@/utils/rentalUtils";
import { useParams } from "next/navigation";
import {
  getRentCarById,
  setRentalDetails,
} from "../../../../feature/reducers/carRentSlice";
import { useEffect } from "react";
import { FaUserTie } from "react-icons/fa6";
import { GiCarDoor } from "react-icons/gi";
import { MdOutlineSevereCold } from "react-icons/md";
import { SiTransmission } from "react-icons/si";
import FormReservation from "@/components/formReservation/FormReservation";
import { getAllSchutzPacket } from "../../../../feature/reducers/schutzPacketSlice";
import { setGesamtSchutzInfo } from "../../../../feature/reducers/appSlice";

const page = () => {
  const { id: carRentId } = useParams();
  const dispatch = useDispatch();
  const {
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    selectedSchutzPacket,
  } = useSelector((state: RootState) => state.carRent);
  const getOneCar = useSelector((state: RootState) =>
    getRentCarById(state, carRentId! as string)
  );

  const allSchutzPaket = useSelector(getAllSchutzPacket);
  const storedTotalPrice = parseFloat(
    localStorage.getItem("totalPrice") || "0"
  );

  useEffect(() => {}, [storedTotalPrice]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedGesamtSchutzInfo = JSON.parse(
        localStorage.getItem("GesamtSchutzInfo") || "{}"
      );

      const rentalDetails = {
        pickupDate: localStorage.getItem("pickupDate"),
        returnDate: localStorage.getItem("returnDate"),
        pickupTime: localStorage.getItem("pickupTime"),
        returnTime: localStorage.getItem("returnTime"),
        pickupLocation: localStorage.getItem("pickupLocation"),
        age: localStorage.getItem("age"),
      };

      if (storedGesamtSchutzInfo) {
        dispatch(setGesamtSchutzInfo(storedGesamtSchutzInfo));
      }
      dispatch(setRentalDetails(rentalDetails));
    }
  }, [dispatch]);

  const formattedPickupDate = pickupDate
    ? new Date(pickupDate).toLocaleDateString()
    : "Datum nicht verfügbar";
  const formattedReturnDate = returnDate
    ? new Date(returnDate).toLocaleDateString()
    : "Datum nicht verfügbar";
  const formattedPickupTime = pickupTime || "Zeit nicht verfügbar";
  const formattedReturnTime = returnTime || "Zeit nicht verfügbar";

  const rentalDays = calculateRentalDays(
    pickupDate!,
    pickupTime!,
    returnDate!,
    returnTime!
  );

  const calculateGesamtePriceSchutzPacket = (schutzPacketId: string) => {
    const schutzPacket = allSchutzPaket.find(
      (packet) => packet._id === schutzPacketId
    );
    if (!schutzPacket) return "0.00";
    const dailyRate = schutzPacket.dailyRate;
    const gesamtPrice = (dailyRate * rentalDays).toFixed(2);
    return gesamtPrice;
  };

  const { gesamteSchutzInfo } = useSelector((state: RootState) => state.app);

  return (
    <div className=" max-w-full">
      <div>
        <RentalLocationCard
          rentalDays={rentalDays}
          carRentId={carRentId as string}
          calculateGesamtePriceSchutzPacket={calculateGesamtePriceSchutzPacket}
          formattedReturnDate={formattedReturnDate}
          formattedPickupDate={formattedPickupDate}
          formattedReturnTime={formattedReturnTime}
          formattedPickupTime={formattedPickupTime}
        />
        <div className=" sticky top-0 z-50 max-w-full flex  justify-center">
          <div className=" lg:w-1/2 w-full flex items-center justify-between mt-3 m-2 px-2 py-3">
            <p className=" text-2xl font-bold">Bestätigen Sie Ihre Buchung</p>
            <p className=" flex flex-col ">
              <span className=" font-bold">Gesamt</span>
              <span className="  font-bold text-green-600">
                {(
                  Number(getOneCar?.carPrice) * Number(rentalDays) +
                  Number(gesamteSchutzInfo.gesamtPrice)
                ).toFixed(2)}
                €
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-stretch lg:flex-row flex-col-reverse h-full px-2">
       
        <div className=" md:justify-center lg:w-3/6 xl:w-3/6 h-full flex flex-1">
          <FormReservation
            rentalDays={rentalDays}
            returnDate={returnDate}
            pickupDate={pickupDate}
            returnTime={returnTime}
            pickupTime={pickupTime}
          />
        </div>

        
        <div className="mb-4 px-2 w-full lg:w-3/6 xl:w-3/6 flex flex-1 items-stretch border-2  justify-center">
          <div className="bg-white rounded-lg shadow-md overflow-hidden  flex flex-col w-full  md:w-5/6   ">
            
            <div className="p-4">
              <h1 className="text-lg font-bold text-gray-800 mb-3">
                {getOneCar?.carName}
              </h1>
              <img
                className="rounded-lg w-full object-cover"
                src={getOneCar?.carImage}
                alt={getOneCar?.carName}
              />
            </div>

           
            <div className="p-4 flex flex-wrap gap-6 justify-start border-t">
              <span className="flex items-center gap-2 text-gray-600">
                <FaUserTie className="text-xl text-orange-600" />
                {getOneCar?.carPeople}
              </span>
              <span className="flex items-center gap-2 text-gray-600">
                <SiTransmission className="text-xl text-orange-600" />
                {getOneCar?.carGear}
              </span>
              <span className="flex items-center gap-2 text-gray-600">
                <GiCarDoor className="text-xl text-orange-600" />
                {getOneCar?.carDoors}
              </span>
              <span className="flex items-center gap-2 text-gray-600">
                <MdOutlineSevereCold className="text-xl text-blue-500" />
                Klimaanlage
              </span>
            </div>

            
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Schutzpaket:</span>
                <span className="font-semibold text-gray-800">
                  {gesamteSchutzInfo?.name} ({rentalDays} Tage)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Preis:</span>
                <span className="font-bold text-green-600">
                  {gesamteSchutzInfo?.gesamtPrice} €
                </span>
              </div>
            </div>

            
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-100 rounded-md p-3">
                  <p className="text-gray-500 text-sm">Abholung</p>
                  <p className="font-bold text-gray-700">
                    {formattedPickupDate}
                  </p>
                </div>
                <div className="flex-1 bg-gray-100 rounded-md p-3">
                  <p className="text-gray-500 text-sm">Rückgabe</p>
                  <p className="font-bold text-gray-700">
                    {formattedReturnDate}
                  </p>
                </div>
              </div>
            </div>

           
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600 font-medium">
                  Schutzpakete & Extras
                </p>
                <span className="font-bold">
                  {gesamteSchutzInfo?.gesamtPrice} €
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <p className="flex items-center gap-2">
                  <span>{localStorage.getItem("packet")}</span>
                  <span className="bg-blue-500 text-white w-6 h-6 rounded-full text-center cursor-pointer hover:bg-blue-600 transition duration-200">
                    i
                  </span>
                </p>
                <p>{rentalDays} Tage</p>
              </div>
            </div>

           
            <div className="p-4 bg-gray-100 border-t mt-auto">
              <div className="flex justify-between items-center text-lg font-bold">
                <p>Gesamt</p>
                <p className="text-green-600">
                  {(
                    Number(getOneCar?.carPrice) * Number(rentalDays) +
                    Number(gesamteSchutzInfo.gesamtPrice)
                  ).toFixed(2)}{" "}
                  €
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
