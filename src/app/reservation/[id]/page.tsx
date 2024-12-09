"use client";

import RentalLocationCard from "@/components/cards/RentalLocationCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../feature/store/store";
import {
  calculateRentalDays,
} from "@/utils/rentalUtils";
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
import Image from "next/image";

const Page = () => {
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
    getRentCarById(state, carRentId as string)
  );

  const storedTotalPrice = parseFloat(
    localStorage.getItem("totalPrice") || "0"
  );

  const rentalDetails = {
    pickupDate: localStorage.getItem("pickupDate"),
    returnDate: localStorage.getItem("returnDate"),
    pickupTime: localStorage.getItem("pickupTime"),
    returnTime: localStorage.getItem("returnTime"),
    pickupLocation: localStorage.getItem("pickupLocation"),
    age: localStorage.getItem("age"),
  };

  useEffect(() => {
    dispatch(setRentalDetails(rentalDetails));
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

  const calculateGesamtePriceSchutzPacket = (dailyRate: number) => {
    return (dailyRate * rentalDays).toFixed(2);
  };

  return (
    <div className="max-w-full">
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
        <div className="sticky top-0 z-50 max-w-full flex justify-center">
          <div className="lg:w-1/2 w-full flex items-center justify-between mt-3 m-2 px-2 py-3">
            <p className="text-2xl font-bold">Bestätigen Sie Ihre Buchung</p>
            <p className="flex flex-col">
              <span>Gesamt</span>
              <span className="font-bold">
                {localStorage.getItem("gesamtPreice")}€
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex lg:flex-row flex-col-reverse">
        <div className="lg:w-3/6 xl:w-4/6">
          <FormReservation
            returnDate={returnDate}
            pickupDate={pickupDate}
            returnTime={returnTime}
            pickupTime={pickupTime}
          />
        </div>
        <div className="mb-4 px-2 lg:w-3/6 xl:w-2/6">
          <div>
            <div>
              <h1 className="text-sm font-bold mb-3">{getOneCar?.carName}</h1>
              <Image
                className="px-2 rounded-md w-full"
                src={getOneCar?.carImage}
                alt={getOneCar?.carName || "Car Image"}
                width={500}
                height={300}
              />
            </div>
            <div className="w-full flex flex-wrap gap-6 mt-3">
              <span className="cardInfoSell">
                <FaUserTie className="cardInfoSellIcon" />
                {getOneCar?.carPeople}
              </span>
              <span className="cardInfoSell">
                <SiTransmission className="cardInfoSellIcon" />
                {getOneCar?.carGear}
              </span>
              <span className="cardInfoSell">
                <GiCarDoor className="cardInfoSellIcon" />
                {getOneCar?.carDoors}
              </span>
              <span className="flex items-center gap-2 cardInfoSell">
                <MdOutlineSevereCold className="cardInfoSellIcon" />
                Klimaanlage
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>
                {localStorage.getItem("packet")} für ({rentalDays} Tage)
              </span>
              <span className="font-bold">
                {localStorage.getItem("gesamtPreice")} €
              </span>
            </div>
            <div className="mt-3">
              <div className="py-2 flex flex-col gap-3">
                <div className="bg-slate-400 rounded-md px-3 py-2">
                  <p>Abholung</p>
                  <p className="font-bold text-sm">{formattedPickupDate}</p>
                </div>
                <div className="bg-slate-400 rounded-md px-3 py-2">
                  <p>Rückgabe</p>
                  <p className="font-bold text-sm">{formattedReturnDate}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p>Schutzpakete & Extras</p>
                <p>
                  {selectedSchutzPacket === "Medium"
                    ? `${calculateGesamtePriceSchutzPacket(11.1)} €`
                    : selectedSchutzPacket === "Premium"
                    ? `${calculateGesamtePriceSchutzPacket(14.2)} €`
                    : "Inklusive"}
                </p>
              </div>
              <div className="border-2 h-1 w-full px-2" />
              <div className="flex items-center justify-between p-2 w-full">
                <p className="flex items-center gap-3">
                  <span>{localStorage.getItem("packet")}</span>
                  <span className="bg-slate-400 text-white w-6 h-6 rounded-full text-center cursor-pointer">
                    i
                  </span>
                </p>
                <p>{rentalDays} Tage</p>
              </div>
            </div>
            <div className="w-full border-2 border-black h-[0.1px] mt-2" />
            <div className="mt-3 flex items-center justify-around">
              <p>Gesamt</p>
              <p className="font-bold">
                {localStorage.getItem("gesamtPreice")} €
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
