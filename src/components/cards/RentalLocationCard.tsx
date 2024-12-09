import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../feature/store/store";
import { getRentCarById, setTotalPrice } from "../../../feature/reducers/carRentSlice";
import { useEffect } from "react";
import { getSchutzPacketById } from "../../../feature/reducers/schutzPacketSlice";




interface RentalLocationCardProps {
    rentalDays:number;
  formattedPickupDate: string;
  formattedPickupTime: string;
  formattedReturnDate: string;
  formattedReturnTime: string;
  carRentId:string ;
  calculateGesamtePriceSchutzPacket: (dailyRate: number) => string
  }


const RentalLocationCard = ({
  formattedPickupDate,
  formattedPickupTime,
  formattedReturnDate,
  formattedReturnTime,
  rentalDays,
  calculateGesamtePriceSchutzPacket,
  carRentId
  }: RentalLocationCardProps) => {

    const {  
        selectedSchutzPacket,age,pickupLocation,totalPrice
      } = useSelector((state: RootState) => state.carRent);

      const {schutzPacketId} = useSelector((state:RootState)=>state.schutzPacket)

    const getOneSchutzPacket = useSelector((state:RootState)=>getSchutzPacketById(state,schutzPacketId || ""))
const dispatch = useDispatch()
const getOneCar = useSelector((state:RootState)=>getRentCarById(state,carRentId))


useEffect(() => {
    const basePrice = Number(getOneCar?.carPrice || 0) * rentalDays;
    let protectionPrice = 0;

    if (localStorage.getItem("packet") === "Medium") {
        
      protectionPrice = rentalDays * 11.1;

    } else if ( localStorage.getItem("packet") === "Premium") {
 
        localStorage.setItem("selectedSchutzPacket","Premium")
      protectionPrice = rentalDays * 14.2;
    }

    const calculatedTotalPrice = basePrice + protectionPrice;
    dispatch(setTotalPrice(calculatedTotalPrice));

    // Store in localStorage
    localStorage.setItem("gesamtPreice", calculatedTotalPrice.toFixed(2));

  }, [getOneCar, rentalDays, selectedSchutzPacket]);

  return (
    <div>
      <div className=" px-2 w-full flex flex-col md:flex-row items-center md:justify-center gap-2">
        <div className=" bg-white px-2 py-4 rounded-lg w-full md:w-1/3 md:h-[11rem]">
          <div className=" flex gap-2 items-center px-2">
            <span className=" bg-gray-400 px-2 py-1 text-white rounded-br-xl rounded-tl-xl">
              1
            </span>
            <h2 className=" uppercase">MietOrt</h2>
          </div>
          <div className=" flex items-center justify-between mt-2 px-2">
            <p className=" font-bold text-xl">Abholung</p>
            <p className=" font-bold text-xl">Rückgabe</p>
          </div>
          <div className=" mt-1 px-2 flex items-center justify-between font-bold text-sm">
            <p>{pickupLocation}</p>
            <p>{formattedReturnDate}</p>
          </div>
          <div className=" mt-1 px-2 w-full flex items-center justify-between font-bold text-sm text-red-500">
            <p className=" font-bold text-sm">
              {formattedPickupDate} {formattedPickupTime}
            </p>
            <p className=" md:text-center">
              {formattedReturnDate} {formattedReturnTime}
            </p>
          </div>
          <div className=" px-2 font-bold text-sm">Age:{age}</div>
        </div>
        <div className="bg-white px-2 py-4 rounded-lg w-full md:w-1/5 h-[11rem]">
          <div className=" flex gap-2 items-center px-2">
            <span className=" bg-gray-400 px-2 py-1 text-white rounded-br-xl rounded-tl-xl">
              2
            </span>
            <h2 className=" uppercase">Fahrzeug</h2>
          </div>
          <div className=" px-2 mt-3 flex flex-col gap-4">
            <p className=" font-bold text-xl">
              {getOneCar?.carName || "Car name not available"}
            </p>
            <p className="font-bold text-xl">
              {" "}
              {(Number(getOneCar?.carPrice) * rentalDays).toFixed(2)} €
            </p>
          </div>
        </div>
        <div className="bg-white px-2 py-4 rounded-lg w-full md:w-1/5 overflow-hidden h-[11rem]">
          <div className=" flex gap-2 items-center px-2">
            <span className=" bg-gray-400 px-2 py-1 text-white rounded-br-xl rounded-tl-xl">
              2
            </span>
            <h2 className=" uppercase">
              Schutzpakete,
              <br />
              Extras
            </h2>
          </div>
          <div className=" grid grid-cols-2 items-center gap-2 mt-2 ">
            <div className=" col-span-1">
              <p className=" font-bold text-xl">Basic</p>
              <span>Inklusive</span>
            </div>
            <div className=" col-span-1 flex items-center gap-2">
              <div className=" border-2 h-9 border-orange-400" />
              <div>
                <p className="font-bold text-sm"> Extra</p>
                <span>
                  {selectedSchutzPacket === "Medium"
                    ? `${calculateGesamtePriceSchutzPacket(11.1)} €`
                    : selectedSchutzPacket === "Premium"
                    ? `${calculateGesamtePriceSchutzPacket(14.2)} €`
                    : "Inklusive"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white px-2 py-4 rounded-lg w-full md:w-1/5 h-[11rem]">
          <div className=" flex gap-2 items-center px-2">
            <span className=" bg-gray-400 px-2 py-1 text-white rounded-br-xl rounded-tl-xl">
              2
            </span>
            <h2 className=" uppercase">Übersicht</h2>
          </div>
          <div className=" flex flex-col gap-4 mt-2 font-bold text-xl">
            <p>Gesamtpreis</p>
            <p className=" text-xl font-extrabold">
            {`${totalPrice.toFixed(2)} €`}
            </p>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default RentalLocationCard;
