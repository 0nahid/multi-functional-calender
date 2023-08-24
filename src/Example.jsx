import { isSameDay } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

export default function CustomCalendar() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [ranges, setRanges] = useState([]); // Array of date ranges
  const [rangeStart, setRangeStart] = useState(null);
  const handleDayClick = (day, { selected }) => {
    if (rangeStart) {
      if (isSameDay(rangeStart, day)) {
        if (!selected) {
          setSelectedDays((prev) => [...prev, day]);
          console.log("Selected Individual Date:", day);
        }
        setRangeStart(null);
      } else {
        const sortedDates = [rangeStart, day].sort(
          (a, b) => a.getTime() - b.getTime()
        );
        const newRange = { from: sortedDates[0], to: sortedDates[1] };
        setRanges((prev) => [...prev, newRange]);
        console.log("Selected Range:", newRange);

        // Remove any individual dates that are now part of the range
        setSelectedDays((prev) =>
          prev.filter((d) => !isDateWithinRange(d, newRange))
        );

        setRangeStart(null);
      }
    } else {
      // Check if the selected date is part of any existing range
      const isPartOfRange = ranges.some((r) => isDateWithinRange(day, r));

      if (!isPartOfRange) {
        if (selected) {
          setSelectedDays((prev) => prev.filter((d) => !isSameDay(d, day)));
        } else {
          setSelectedDays((prev) => [...prev, day]);
          console.log("Selected Individual Date:", day);
        }
      }

      setRangeStart(day);
    }
  };

  const isDateWithinRange = (date, { from, to }) => {
    return date.getTime() >= from.getTime() && date.getTime() <= to.getTime();
  };

  const isDaySelected = (day) => {
    for (let range of ranges) {
      if (isDateWithinRange(day, range)) {
        return true;
      }
    }
    return selectedDays.some((selectedDay) => isSameDay(day, selectedDay));
  };

  const deselectIndividualDate = (date) => {
    setSelectedDays((prev) => prev.filter((d) => !isSameDay(d, date)));
  };

  const deselectRange = (index) => {
    setRanges((prev) => prev.filter((_, i) => i !== index));
  };

  let footer = (
    <p>Please click twice for individual dates or pick for a range.</p>
  );
  if (selectedDays.length > 0) {
    footer = <p>You selected {selectedDays.length} individual dates.</p>;
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col md:flex-row w-full max-w-3xl">
      {/* Part 1: Calendar */}
      <div className="flex-none w-full md:w-1/2 mb-4 md:mb-0">
        <DayPicker
          onDayClick={handleDayClick}
          selected={isDaySelected}
          footer={footer}
          showOutsideDays
          className="border border-gray-300 rounded shadow p-5"
        />
      </div>
  
      {/* Part 2: Data Display */}
      <div className="flex-grow w-full md:w-1/2 bg-white p-8 overflow-y-auto max-h-[400px]">
        <h3 className="text-gray-700 border-b pb-2 mb-3">Selected Ranges:</h3>
        <ul className="list-decimal pl-5 mb-5">
          {ranges.map((range, index) => (
            <li
              key={index}
              onClick={() => deselectRange(index)}
              className="mb-2 p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300 flex justify-between"
            >
              <span>
                {range.from.toLocaleDateString()} -{" "}
                {range.to.toLocaleDateString()}
              </span>
              <span className="text-red-500 ml-2">X</span>
            </li>
          ))}
        </ul>
  
        <h3 className="text-gray-700 border-b pb-2 mb-3 mt-5">Individual Dates:</h3>
        <ul className="list-decimal pl-5">
          {selectedDays.map((date, index) => (
            <li
              key={index}
              onClick={() => deselectIndividualDate(date)}
              className="mb-2 p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300 flex justify-between"
            >
              <span>{date.toLocaleDateString()}</span>
              <span className="text-red-500 ml-2">X</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
}
