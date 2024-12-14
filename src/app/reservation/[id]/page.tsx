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
    selectedSchutzPacket
  } = useSelector((state: RootState) => state.carRent);
  const getOneCar = useSelector((state: RootState) =>
    getRentCarById(state, carRentId! as string)
  );

const allSchutzPaket = useSelector(getAllSchutzPacket)
  const storedTotalPrice = parseFloat(
    localStorage.getItem("totalPrice") || "0"
  );
 

  useEffect(() => {}, [storedTotalPrice]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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


  const rentalDays = calculateRentalDays(pickupDate!, pickupTime!,returnDate!,returnTime!);

  const calculateGesamtePriceSchutzPacket = (schutzPacketId: string) => {
    const schutzPacket = allSchutzPaket.find(
      (packet) => packet._id === schutzPacketId
    );
    if (!schutzPacket) return "0.00";
    const dailyRate = schutzPacket.dailyRate;
    const gesamtPrice = (dailyRate * rentalDays).toFixed(2);
    return gesamtPrice;
  };
   
  const { gesamteSchutzInfo } = useSelector(
    (state: RootState) => state.app
  );


 



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
              <span>Gesamt</span>
              <span className="  font-bold">
              {(Number(getOneCar?.carPrice) * Number(rentalDays) + Number(gesamteSchutzInfo.gesamtPrice)).toFixed(2)}€
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className=" w-full flex lg:flex-row flex-col-reverse ">
       <div className=" lg:w-3/6 xl:w-4/6">
        <FormReservation
        rentalDays={rentalDays}
        />
       </div>
        <div className=" mb-4 px-2 lg:w-3/6 xl:w-2/6">
          <div>
            <div>
              <h1 className=" text-sm font-bold mb-3">{getOneCar?.carName}</h1>
              <img
                className=" px-2 rounded-md w-full"
                src={getOneCar?.carImage}
                alt={getOneCar?.carImage}
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
            <div className=" mt-2 flex items-center justify-between">
              <span>
                {gesamteSchutzInfo?.name} für ({rentalDays}{" "}
                Tage)
              </span>
              <span className=" font-bold">
              {gesamteSchutzInfo?.gesamtPrice} €
              </span>
            </div>
            <div className=" mt-3">
              <div className="  py-2  flex flex-col  gap-3">
                <div className=" bg-slate-400 rounded-md px-3 py-2">
                  <p>Abholung</p>
                  <p className=" font-bold text-sm">{formattedPickupDate}</p>
                </div>
                <div className=" bg-slate-400 rounded-md px-3 py-2">
                  <p>Rückgabe</p>
                  <p className=" font-bold text-sm">{formattedReturnDate}</p>
                </div>
              </div>
            </div>
            <div>
              <div className=" flex items-center justify-between">
                <p>Schutzpakete & Extras</p>
                <p>
                 
                  
                    {gesamteSchutzInfo?.gesamtPrice}
                 €
                </p>
              </div>
              <div className=" border-2 h-1 w-full px-2" />
              <div className=" flex items-center justify-between p-2 w-full">
                <p className=" flex items-center gap-3">
                  <span>{localStorage.getItem("packet")}</span>
                  <span
                    className=" bg-slate-400 text-white w-6 h-6 rounded-full text-center cursor-pointer"
                  >
                    i
                  </span>
                </p>
                <p>{rentalDays} Tage</p>
              </div>
            </div>
            <div className=" w-full border-2 border-black h-[0.1px] mt-2" />
            <div className=" mt-3 flex items-center justify-around">
              <p>Gesamt</p>
              <p className=" font-bold">{(Number(getOneCar?.carPrice) * Number(rentalDays) + Number(gesamteSchutzInfo.gesamtPrice)).toFixed(2)} €</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;