import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface DateTimePickerProps {}

const DateTimePicker: React.FC<DateTimePickerProps> = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(dayjs(event.target.value));
  };

  console.log(selectedDate.format('YYYY-MM-DDTHH:mm'));
  console.log(selectedDate.toISOString());

  console.log({
    selectedDate: selectedDate.format('YYYY-MM-DDTHH:mm'),
    selectedDateISO: selectedDate.toISOString()
  });

  return (
    <div>
      <input
        type="datetime-local"
        value={selectedDate.format('YYYY-MM-DDTHH:mm')}
        onChange={handleDateChange}
        className="border border-gray-300 rounded-md px-2 py-1 w-full"
      />
      <p>Selected date and time: {selectedDate.format('DD/MM/YYYY HH:mm')}</p>
    </div>
  );
};

export default DateTimePicker;
