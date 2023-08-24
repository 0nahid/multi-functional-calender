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

  let footer = <p>Please click twice for individual dates or pick for a range.</p>;
  if (selectedDays.length > 0) {
    footer = <p>You selected {selectedDays.length} individual dates.</p>;
  }

  return (
    <>
        
      <DayPicker
        onDayClick={handleDayClick}
        selected={isDaySelected}
        footer={footer}
        showOutsideDays
      />
      <div style={{ marginTop: "20px" }}>
        <h3>Selected Ranges:</h3>
        <ul>
          {ranges.map((range, index) => (
            <li
              key={index}
              onClick={() => deselectRange(index)}
              style={{ cursor: "pointer" }}
            >
              {range.from.toLocaleDateString()} -{" "}
              {range.to.toLocaleDateString()}
            </li>
          ))}
        </ul>

        <h3>Individual Dates:</h3>
        <ul>
          {selectedDays.map((date, index) => (
            <li
              key={index}
              onClick={() => deselectIndividualDate(date)}
              style={{ cursor: "pointer" }}
            >
              {date.toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
