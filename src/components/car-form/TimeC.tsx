import React, { useState } from 'react';

interface TimeCProps {
  onTimeSelect: (time: string) => void;
  disabledPastTime: boolean;
}

const TimeC = ({ onTimeSelect, disabledPastTime = false }: TimeCProps) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const now = new Date();
  const currentHour = now.getHours();

  const times = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7;
    const formattedHour = hour < 10 ? `0${hour}` : hour.toString();
    const time = `${formattedHour}:00 Uhr`;
    const isPastTime = disabledPastTime && new Date(`${now.toDateString()} ${time}`) < now;
    const isCurrentTime = hour === currentHour;

    return {
      time,
      isPastTime,
      isCurrentTime,
    };
  });

  const handleTimeSelect = (time: string) => {
    const selected = times.find((t) => t.time === time);

    if (!selected?.isPastTime) {
      setSelectedTime(time);
      onTimeSelect(time); 
    }
  };

  return (
    <div className="flex flex-col p-4 border border-gray-300 rounded-md shadow-lg w-full">
      <h3 className="font-bold text-lg mb-2">Wähle eine Uhrzeit</h3>
      <div className="flex flex-wrap">
        {times.map(({ time, isPastTime, isCurrentTime }) => (
          <button
            key={time}
            disabled={isPastTime}
            onClick={() => handleTimeSelect(time)}
            className={`m-1 px-3 py-1 border rounded ${
              isPastTime
                ? 'bg-gray-200 text-black'
                : selectedTime === time
                ? 'bg-green-400 text-white'
                : 'bg-slate-500 text-white'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeC;