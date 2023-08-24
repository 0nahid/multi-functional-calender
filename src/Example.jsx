import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";

export default function CustomCalendar() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [ranges, setRanges] = useState([]);
  const [rangeStart, setRangeStart] = useState(null);

  const handleDayClick = (day, { selected }) => {
    if (isDateUnavailable(day) || !isDateAvailable(day)) return; // If day is unavailable or not available, return

    if (rangeStart) {
      if (isSameDay(rangeStart, day) || isDateDisabled(day)) {
        if (!selected) {
          setSelectedDays((prev) => [...prev, day]);
        }
        setRangeStart(null);
      } else {
        const sortedDates = [rangeStart, day].sort(
          (a, b) => a.getTime() - b.getTime()
        );
        const newRange = { from: sortedDates[0], to: sortedDates[1] };

        if (!isRangeIncludingDisabledDates(newRange)) {
          setRanges((prev) => [...prev, newRange]);

          setSelectedDays((prev) =>
            prev.filter((d) => !isDateWithinRange(d, newRange))
          );
        }

        setRangeStart(null);
      }
    } else {
      if (!isDateDisabled(day)) {
        if (selected) {
          setSelectedDays((prev) => prev.filter((d) => !isSameDay(d, day)));
        } else {
          setSelectedDays((prev) => [...prev, day]);
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

  const jsonData = {
    availableDates: [
      "2023-08-15",
      "2023-08-16",
      "2023-08-17",
      "2023-08-18",
      "2023-08-20",
      "2023-08-21",
      "2023-08-22",
      "2023-08-24",
      "2023-08-25",
      "2023-08-30",
      "2023-09-01",
      "2023-09-02",
      "2023-09-03",
      "2023-09-04",
      "2023-09-05",
      "2023-09-06",
      "2023-09-07",
    ],
    unavailableDates: ["2023-08-26", "2023-08-27", "2023-08-28"],
  };

  const [availableDates, setAvailableDates] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    const convertedAvailableDates = jsonData.availableDates.map(
      (dateStr) => new Date(dateStr)
    );
    const convertedUnavailableDates = jsonData.unavailableDates.map(
      (dateStr) => new Date(dateStr)
    );
    setAvailableDates(convertedAvailableDates);
    setUnavailableDates(convertedUnavailableDates);
  }, []);
  const isDateAvailable = (date) => {
    return availableDates.some((availableDate) =>
      isSameDay(availableDate, date)
    );
  };

  const isDateUnavailable = (date) => {
    return unavailableDates.some((unavailableDate) =>
      isSameDay(unavailableDate, date)
    );
  };

  const isRangeIncludingDisabledDates = ({ from, to }) => {
    let date = new Date(from);
    while (date <= to) {
      if (!isDateAvailable(date) || isDateUnavailable(date)) {
        return true;
      }
      date.setDate(date.getDate() + 1);
    }
    return false;
  };

  const isDateDisabled = (date) => {
    return unavailableDates.some((disabledDate) =>
      isSameDay(disabledDate, date)
    );
  };
  const isDateExplicitlyUnavailable = (date) => {
    return unavailableDates.some((disabledDate) =>
      isSameDay(disabledDate, date)
    );
  };

  let footer = (
    <p>Please click twice for individual dates or pick for a range.</p>
  );
  if (selectedDays.length > 0) {
    footer = <p>You selected {selectedDays.length} individual dates.</p>;
  }

  console.log(`ranges:`, ranges);
  console.log(`selectedDays:`, selectedDays);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col md:flex-row w-full max-w-3xl">
      {/* Calendar Display */}
      <div className="flex-none w-full md:w-1/2 mb-4 md:mb-0">
        <DayPicker
          onDayClick={handleDayClick}
          selected={isDaySelected}
          disabled={(day) =>
            isDateExplicitlyUnavailable(day) || !isDateAvailable(day)
          }
          footer={footer}
          showOutsideDays
          className="border border-gray-300 rounded shadow p-5"
          modifiers={{
            available: availableDates,
            unavailable: unavailableDates,
            selected: selectedDays,
            ranges: ranges,
          }}
          modifiersStyles={{
            available: {
              color: "green",
            },
            unavailable: {
              color: "red",
            },
            selected: {
              backgroundColor: "#C6A34F",
              color: "white",
            },
            ranges: {
              backgroundColor: "#C6A34F",
              color: "white",
            },
          }}
        />
      </div>

      {/* Data Display */}
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

        <h3 className="text-gray-700 border-b pb-2 mb-3 mt-5">
          Individual Dates:
        </h3>
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
