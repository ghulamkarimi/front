import { useDispatch } from 'react-redux';
import { setSelectedSchutzPackage, setTotalPrice } from '../../feature/reducers/carRentSlice';
//import { getAllSchutzPacket, setSchutzPacketId } from '../../feature/reducers/schutzPacketSlice';

//const allSchutzPaket = useSelector(getAllSchutzPacket);

export const calculateRentalDays = (
  pickupDate: string | "",
  pickupTime: string| "",
  returnDate: string| "",
  returnTime: string| ""
): number => {


  // Bereinige die Zeitangaben
  const cleanedPickupTime = pickupTime?.replace(/[^0-9:]/g, "") || "";
  const cleanedReturnTime = returnTime?.replace(/[^0-9:]/g, "") || "";

  // Erstelle die Start- und End-Datetime
  const start = `${pickupDate?.split("T")[0]}T${cleanedPickupTime}`;
  const end = `${returnDate?.split("T")[0]}T${cleanedReturnTime}`;
  // Geplante Rückgabezeit (inkl. 3-Stunden-Toleranz)
  const plannedReturnTime = new Date(start);
  plannedReturnTime.setHours(plannedReturnTime.getHours() + 3);

  // Rückgabe innerhalb der Toleranz → mindestens 1 Tag berechnen
  if (new Date(end) <= plannedReturnTime) {
    return 1;
  }

  // Berechne volle Miettage
  const startDay = new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate());
  const endDay = new Date(new Date(end).getFullYear(), new Date(end).getMonth(), new Date(end).getDate());

  let dayDiff = Math.ceil((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Überprüfe, ob der letzte Tag innerhalb der Toleranz ist
  const finalReturnTime = new Date(startDay);
  finalReturnTime.setDate(startDay.getDate() + dayDiff - 1);
  finalReturnTime.setHours(new Date(start).getHours() + 3);

  if (new Date(end) > finalReturnTime) {
    return dayDiff;
  }

  return dayDiff - 1;
};

export const useSelectPacket = () => {
  const dispatch = useDispatch();

  const handleSelectPacket = (packet: string) => {
  
    dispatch(setSelectedSchutzPackage(packet));
    localStorage.setItem("packet", packet);

  };

  return handleSelectPacket;
};