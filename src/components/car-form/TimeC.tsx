// TimeC.tsx

import React, { useState } from 'react';


interface TimeCProps{
    onTimeSelect:(time:string)=>void
}


const TimeC = ({ onTimeSelect }:TimeCProps) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const times = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7;
    const formattedHour = hour < 10 ? `0${hour}` :  hour.toString();
    return `${formattedHour}:00 Uhr`;
  });

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onTimeSelect(time); 
  };

  return (
    <div className="flex flex-col p-4 border border-gray-300 rounded-md shadow-lg w-full">
      <h3 className="font-bold text-lg mb-2">Wähle eine Uhrzeit</h3>
      <div className="flex flex-wrap">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className={`m-1 px-3 py-1 border rounded ${selectedTime === time ? 'bg-green-400 text-white' : 'bg-gray-200'}`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeC;
