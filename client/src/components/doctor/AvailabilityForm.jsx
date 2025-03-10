
import React, { useState, useEffect, useContext } from "react";
import DoctorContext from "../../context/doctor/DoctorContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";

const AvailabilityForm = () => {
  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const doctorContext = useContext(DoctorContext);
  const alertContext = useContext(AlertContext);
  const { currentDoctor, updateAvailability, loading } = doctorContext;
  const { setAlert } = alertContext;

  // Initialize with empty availability to prevent undefined issues
  const [availability, setAvailability] = useState(
    DAYS.map((day) => ({
      day,
      slots: [],
    }))
  );

  // Make sure to run this effect ONLY when currentDoctor changes
  useEffect(() => {
    if (
      currentDoctor &&
      currentDoctor.availability &&
      currentDoctor.availability.length > 0
    ) {
      // Initialize with existing availability data
      setAvailability(currentDoctor.availability);
    } else {
      // Initialize with empty availability for each day
      const initialAvailability = DAYS.map((day) => ({
        day,
        slots: [],
      }));
      setAvailability(initialAvailability);
    }
  }, [currentDoctor]);

  const addSlot = (dayIndex) => {
    const updatedAvailability = [...availability];
    if (!updatedAvailability[dayIndex]) {
      // Create the day entry if it doesn't exist
      updatedAvailability[dayIndex] = { day: DAYS[dayIndex], slots: [] };
    }
    updatedAvailability[dayIndex].slots.push({
      startTime: "09:00",
      endTime: "10:00",
      isBooked: false,
    });
    setAvailability(updatedAvailability);
  };

  const removeSlot = (dayIndex, slotIndex) => {
    if (!availability[dayIndex]) return;

    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots.splice(slotIndex, 1);
    setAvailability(updatedAvailability);
  };

  const handleSlotChange = (dayIndex, slotIndex, field, value) => {
    if (!availability[dayIndex] || !availability[dayIndex].slots[slotIndex])
      return;

    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots[slotIndex][field] = value;
    setAvailability(updatedAvailability);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate all time slots
    let isValid = true;
    let errorMessage = "";

    availability.forEach((day) => {
      if (day && day.slots) {
        day.slots.forEach((slot) => {
          if (slot.startTime >= slot.endTime) {
            isValid = false;
            errorMessage = "Start time must be before end time";
          }
        });
      }
    });

    if (!isValid) {
      setAlert(errorMessage, "danger");
      return;
    }

    if (!currentDoctor || !currentDoctor._id) {
      setAlert("Doctor information is missing", "danger");
      return;
    }

    const success = await updateAvailability(currentDoctor._id, availability);

    if (success) {
      setAlert("Availability updated successfully", "success");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Card title="Set Your Availability">
      <form onSubmit={onSubmit} className="availability-form">
        {availability && availability.length > 0 ? (
          availability.map((dayAvailability, dayIndex) => (
            <div key={dayIndex} className="day-availability">
              <h3>{dayAvailability.day}</h3>

              {!dayAvailability.slots || dayAvailability.slots.length === 0 ? (
                <div className="no-slots">
                  <p>No time slots added for this day.</p>
                </div>
              ) : (
                <div className="slots-container">
                  {dayAvailability.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="slot-item">
                      <div className="slot-time">
                        <div className="time-input">
                          <label>Start Time</label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleSlotChange(
                                dayIndex,
                                slotIndex,
                                "startTime",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="time-input">
                          <label>End Time</label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleSlotChange(
                                dayIndex,
                                slotIndex,
                                "endTime",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="remove-slot-btn"
                        onClick={() => removeSlot(dayIndex, slotIndex)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
 
              <button
                type="button"
                className="add-slot-btn"
                onClick={() => addSlot(dayIndex)}
              >
                <i className="fas fa-plus"></i> Add Time Slot
              </button>
            </div>
          ))
        ) : (
          <p>Loading availability settings...</p>
        )}

        <Button type="submit" text="Save Availability" variant="primary" />
      </form>
    </Card>
  );
};

export default AvailabilityForm;
