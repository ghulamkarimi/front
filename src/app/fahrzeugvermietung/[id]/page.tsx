"use client";

import "react-image-gallery/styles/css/image-gallery.css";
import "yet-another-react-lightbox/styles.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../feature/store/store";
import {
  getRentCarById,
  setIsDetailsSchutzPacketActive,
  setRentalDetails,
  setSelectedSchutzPackage,
} from "../../../../feature/reducers/carRentSlice";

import PackageOption from "@/components/cards/PackageOption";
import RentalLocationCard from "@/components/cards/RentalLocationCard";
import { calculateRentalDays } from "@/utils/rentalUtils";
import { getAllSchutzPacket, setSchutzPacketId } from "../../../../feature/reducers/schutzPacketSlice";

const Page = () => {
  const { id: carRentId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux State
  const allSchutzPaket = useSelector(getAllSchutzPacket);
  const { selectedSchutzPacket, pickupDate, pickupTime, returnDate, returnTime } = useSelector((state: RootState) => state.carRent);
  const { gesamteSchutzInfo } = useSelector((state: RootState) => state.app);

  const getOneCar = useSelector((state: RootState) => getRentCarById(state, carRentId! as string));
  const rentalDays = calculateRentalDays(pickupDate!, pickupTime!, returnDate!, returnTime!);

  // Initial Data Load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rentalDetails = {
        pickupDate: localStorage.getItem("pickupDate"),
        returnDate: localStorage.getItem("returnDate"),
        pickupTime: localStorage.getItem("pickupTime"),
        returnTime: localStorage.getItem("returnTime"),
        pickupLocation: localStorage.getItem("pickupLocation"),
        age: localStorage.getItem("age"),
      };
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

  const handleSelectPacket = (packetName: string, schutzPacketId: string) => {
    dispatch(setSchutzPacketId(schutzPacketId));
    dispatch(setSelectedSchutzPackage(packetName));
    localStorage.setItem("schutzPacketId", schutzPacketId);
  };

  const calculateGesamtePriceSchutzPacket = (schutzPacketId: string) => {
    const schutzPacket = allSchutzPaket.find((packet) => packet._id === schutzPacketId);
    if (!schutzPacket) return "0.00";
    return (schutzPacket.dailyRate * rentalDays).toFixed(2);
  };

  return (
    <div className="m-4 space-y-8">
      {/* Mietdetails */}
      <RentalLocationCard
        rentalDays={rentalDays}
        carRentId={carRentId as string}
        calculateGesamtePriceSchutzPacket={calculateGesamtePriceSchutzPacket}
        formattedPickupDate={formattedPickupDate || "Datum nicht verfügbar"}
        formattedReturnDate={formattedReturnDate || "Datum nicht verfügbar"}
        formattedPickupTime={formattedPickupTime || "Zeit nicht verfügbar"}
        formattedReturnTime={formattedReturnTime || "Zeit nicht verfügbar"}
      />

      {/* Schutzpaket Auswahl */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row justify-around items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Wählen Sie Ihr Schutzpaket & Extras
          </h2>
          <div className="text-lg font-semibold">
            <span>Gesamtpreis: </span>
            <span className="text-green-600">
              {(Number(getOneCar?.carPrice || 0) * rentalDays + Number(gesamteSchutzInfo?.gesamtPrice || 0)).toFixed(2)} €
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSchutzPaket.map((schutzPacket) => (
            <PackageOption
              key={schutzPacket._id}
              name={schutzPacket.name}
              deductible={schutzPacket.deductible}
              dailyRate={schutzPacket.dailyRate}
              features={schutzPacket.features || []}
              isSelected={selectedSchutzPacket === schutzPacket.name}
              onSelect={() => handleSelectPacket(schutzPacket.name, schutzPacket._id)}
              onToggleDetails={() => dispatch(setIsDetailsSchutzPacketActive(true))}
              isDetailsActive={selectedSchutzPacket === schutzPacket.name}
              gesamteSchutzPrice={calculateGesamtePriceSchutzPacket(schutzPacket._id)}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              localStorage.setItem("rentalDays", String(rentalDays));
              router.push(`/reservation/${carRentId}`);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition duration-200 shadow"
          >
            Reservierung abschließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;