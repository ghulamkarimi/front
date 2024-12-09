import { useDispatch } from 'react-redux';
import { setSelectedSchutzPackage } from '../../feature/reducers/carRentSlice';






export const calculateRentalDays = (pickupDate: string, pickupTime: string, returnDate: string, returnTime: string) => {
  
  const cleanedPickupTime = pickupTime ? pickupTime.replace(/[^0-9:]/g, '') : '';
  const cleanedReturnTime = returnTime ? returnTime.replace(/[^0-9:]/g, '') : '';


  if (!cleanedPickupTime || !cleanedReturnTime) {
    console.error('Invalid pickupTime or returnTime values');
    return NaN;
  }

  // Check if the dates are valid
  const start = new Date(pickupDate);
  const end = new Date(returnDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error('Invalid date values');
    return NaN;
  }

  // Combine the date and cleaned time to create a full datetime string
  const startDateTime = new Date(`${pickupDate.split('T')[0]}T${cleanedPickupTime}`);
  const endDateTime = new Date(`${returnDate.split('T')[0]}T${cleanedReturnTime}`);

  // Ensure the datetime values are valid
  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    console.error('Invalid combined date/time values');
    return NaN;
  }

  // Calculate the time difference in hours
  const timeDiffInMilliseconds = endDateTime.getTime() - startDateTime.getTime();
  const timeDiffInHours = timeDiffInMilliseconds / (1000 * 60 * 60); // in hours

  // Calculate the planned return time (pickup time + 3 hours tolerance)
  const plannedReturnTime = new Date(`${returnDate.split('T')[0]}T${cleanedPickupTime}`);
  plannedReturnTime.setHours(plannedReturnTime.getHours() + 3); // add 3 hours tolerance

  // If the actual return time is within 3 hours of the planned return time, treat it as the same day
  if (endDateTime <= plannedReturnTime) {
    return 2; // If return is within 3 hours tolerance, return 2 days
  }

  // Otherwise, calculate the number of rental days based on the time difference
  const rentalDays = Math.ceil(timeDiffInHours / 24); 

  return rentalDays; // return rentalDays if it's more than 3 hours
};





export const useSelectPacket = () => {
  const dispatch = useDispatch();

  const handleSelectPacket = (packet: string) => {
    dispatch(setSelectedSchutzPackage(packet));
    localStorage.setItem("packet", packet);
  };

  return handleSelectPacket;
};
