import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarCProps {
  onDateSelect: (date: Date | null) => void;
}

const CalenderC: React.FC<CalendarCProps> = ({ onDateSelect }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  return (
    <div className="flex justify-center p-4 border border-gray-300 rounded-md shadow-lg w-full">
      <DatePicker
        selected={startDate}
        onChange={(date) => {
          setStartDate(date);
          onDateSelect(date); 
        }}
        monthsShown={2}
        inline
        dateFormat="dd/MM/yyyy"
        className="w-full"
      />
    </div>
  );
};

export default CalenderC;
