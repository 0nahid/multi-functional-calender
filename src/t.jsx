// // ... other imports ...

// export default function CustomCalendar() {
//     // ... other useState hooks ...
  
//     const handleDayClick = (day, { selected }) => {
//       if (rangeStart) {
//         if (isSameDay(rangeStart, day) || isDateDisabled(day)) {
//           if (!selected) {
//             setSelectedDays((prev) => [...prev, day]);
//           }
//           setRangeStart(null);
//         } else {
//           const sortedDates = [rangeStart, day].sort(
//             (a, b) => a.getTime() - b.getTime()
//           );
  
//           const newRange = { from: sortedDates[0], to: sortedDates[1] };
  
//           if (!isRangeIncludingDisabledDates(newRange)) {
//             setRanges((prev) => [...prev, newRange]);
  
//             setSelectedDays((prev) =>
//               prev.filter((d) => !isDateWithinRange(d, newRange))
//             );
//           }
  
//           setRangeStart(null);
//         }
//       } else {
//         if (!isDateDisabled(day)) {
//           if (selected) {
//             setSelectedDays((prev) => prev.filter((d) => !isSameDay(d, day)));
//           } else {
//             setSelectedDays((prev) => [...prev, day]);
//           }
//         }
  
//         setRangeStart(day);
//       }
//     };
  
//     // Check if the selected range includes any disabled dates
//     const isRangeIncludingDisabledDates = ({ from, to }) => {
//       return unavailableDates.some(
//         (disabledDate) =>
//           disabledDate.getTime() >= from.getTime() &&
//           disabledDate.getTime() <= to.getTime()
//       );
//     };
  
//     const isDateDisabled = (date) => {
//       return unavailableDates.some((disabledDate) => isSameDay(disabledDate, date));
//     };
  
//     // ... rest of the component ...
  
//   }
  