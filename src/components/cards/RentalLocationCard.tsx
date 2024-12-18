import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../feature/store/store";
import { getRentCarById } from "../../../feature/reducers/carRentSlice";
import { useEffect } from "react";
import { getSchutzPacketById } from "../../../feature/reducers/schutzPacketSlice";

interface RentalLocationCardProps {
  rentalDays: number;
  formattedPickupDate: string;
  formattedPickupTime: string;
  formattedReturnDate: string;
  formattedReturnTime: string;
  carRentId: string;
  calculateGesamtePriceSchutzPacket: (schutzPacketId: string) => string;
}

const CardSection = ({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-lg w-full md:h[h-11rem] lg:w-1/4 lg:h-[12.5rem] ">
    <div className="flex items-center gap-2 mb-4">
      <span className="bg-orange-600 text-white px-2 py-1 rounded-br-xl rounded-tl-xl">
        {step}
      </span>
      <h2 className="uppercase font-semibold text-gray-700">{title}</h2>
    </div>
    {children}
  </div>
);

const RentalLocationCard = ({
  formattedPickupDate,
  formattedPickupTime,
  formattedReturnDate,
  formattedReturnTime,
  rentalDays,
  calculateGesamtePriceSchutzPacket,
  carRentId,
}: RentalLocationCardProps) => {
  const dispatch = useDispatch();
  const { age, pickupLocation } = useSelector((state: RootState) => state.carRent);
  const { gesamteSchutzInfo } = useSelector((state: RootState) => state.app);
  const getOneCar = useSelector((state: RootState) => getRentCarById(state, carRentId));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const gesamtPrice = (
        Number(getOneCar?.carPrice || 0) * Number(rentalDays || 0) +
        Number(gesamteSchutzInfo?.gesamtPrice || 0)
      ).toFixed(2);
      localStorage.setItem("gesamtPrice", gesamtPrice);
    }
  }, [getOneCar?.carPrice, rentalDays, gesamteSchutzInfo?.gesamtPrice]);

  return (
    <div className="mt-6 px-4">
      <div className="flex flex-col lg:flex-row  gap-6 justify-center">
        {/* Mietort */}
        <CardSection step={1} title="Mietort">
          <div className="flex justify-between mb-2">
            <p className="font-bold text-gray-700">Abholung</p>
            <p className="font-bold text-gray-700">Rückgabe</p>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <p>Badenheimer Str. 6, 55576 Sprendlingen</p>
            <p className=" font-bold ">Alter: {age}</p>
          </div>
          <div className="mt-3 flex justify-between text-red-500 font-bold text-xs">
            <p>
              {formattedPickupDate} Um {formattedPickupTime}
            </p>
            <p>
              {formattedReturnDate} Um {formattedReturnTime}
            </p>
          </div>
          <p ></p>
        </CardSection>

        {/* Fahrzeug */}
        <CardSection step={2} title="Fahrzeug">
          <p className="text-lg font-bold text-gray-800">
            {getOneCar?.carName || "Auto-Name nicht verfügbar"}
          </p>
          <p className="mt-2 text-green-600 font-bold text-xl">
            {(Number(getOneCar?.carPrice) * rentalDays).toFixed(2)} €
          </p>
        </CardSection>

        {/* Schutzpakete */}
        <CardSection step={2} title="Schutzpakete">
          <div className="flex gap-2 items-center px-2">
            <span className="border-orange-600 px-2  text-white rounded-br-xl rounded-tl-xl">
              3
            </span>
            <h2 className="uppercase font-semibold">Schutzpakete, Extras</h2>
          </div>
          <div className="grid grid-cols-2 items-center gap-2 mt-2">
            <div className="col-span-1">
              <p className="font-bold text-xl">
                {gesamteSchutzInfo?.name || "Inklusive"}
              </p>
              <span>Inklusive</span>
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <div className="border-2 h-9 border-orange-400" />
              <div>
                <p className="font-bold text-sm">Extra</p>
                <span>{gesamteSchutzInfo?.gesamtPrice || "0.00"} €</span>
              </div>
            </div>
          </div>
        
        </CardSection>
        

        {/* Übersicht */}
        <CardSection step={4} title="Übersicht">
          <p className="text-lg font-semibold text-gray-700 mb-2">Gesamtpreis</p>
          <p className="text-green-600 text-2xl font-extrabold">
            {(
              Number(getOneCar?.carPrice) * Number(rentalDays) +
              Number(gesamteSchutzInfo?.gesamtPrice || 0)
            ).toFixed(2)}{" "}
            €
          </p>
        </CardSection>
      </div>
    </div>
  );
};

export default RentalLocationCard;