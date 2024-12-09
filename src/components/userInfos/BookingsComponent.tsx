import React, { useState } from "react";
import { useSelector } from "react-redux";
import { displayAppointments } from "../../../feature/reducers/appointmentSlice";

const BookingsComponent = () => {
  // Aktuelle Benutzer-ID aus localStorage
  const userId = localStorage.getItem("userId");
  console.log("User ID von localstorage in booking component:", userId);

  // Alle Termine aus Redux abrufen
  const appointments = useSelector(displayAppointments);
  console.log("Alle Appointments:", appointments);

  // Filtere Werkstatt-Buchungen
  const workshopAppointments = appointments.filter(
    (appointment) => appointment.userId?.toString() === userId?.toString()
  );

  // Platzhalter für zukünftige Autovermietungs-Buchungen
  const carRentalAppointments = []; // Noch keine Buchungen vorhanden

  // Zustand, um zwischen den Abschnitten zu wechseln
  const [activeSection, setActiveSection] = useState("workshop");

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-br from-orange-100 via-white to-orange-50 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-800">
        Meine Buchungen
      </h1>

      {/* Umschalt-Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveSection("workshop")}
          className={`px-6 py-2 font-bold rounded-lg ${
            activeSection === "workshop"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Werkstatt
        </button>
        <button
          onClick={() => setActiveSection("rental")}
          className={`px-6 py-2 font-bold rounded-lg ${
            activeSection === "rental"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Rent
        </button>
      </div>

      {/* Inhalte basierend auf der aktiven Sektion */}
      {activeSection === "workshop" && (
        <section>
          <h2 className="text-3xl font-bold mb-6 text-orange-600 text-center">
            Werkstatt
          </h2>
          {workshopAppointments.length > 0 ? (
            <ul className="space-y-8">
              {workshopAppointments.map((appointment) => (
                <li
                  key={appointment._id}
                  className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {appointment.service}
                    </h3>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        appointment.isBookedOrBlocked
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.isBookedOrBlocked ? "Gebucht" : "Verfügbar"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-gray-600">
                    <p>
                      <strong className="text-gray-800">Datum:</strong>{" "}
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong className="text-gray-800">Zeit:</strong>{" "}
                      {appointment.time}
                    </p>
                    {appointment.comment && (
                      <p className="col-span-2">
                        <strong className="text-gray-800">Kommentar:</strong>{" "}
                        {appointment.comment}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center bg-gray-100 p-8 rounded-2xl shadow-md">
              <p className="text-xl text-gray-600">
                Du hast keine Werkstatt-Buchungen vorgenommen.
              </p>
              <img
                src="/no-bookings.svg"
                alt="Keine Buchungen"
                className="mx-auto mt-4 w-40"
              />
            </div>
          )}
        </section>
      )}

      {activeSection === "rental" && (
        <section>
          <h2 className="text-3xl font-bold mb-6 text-orange-600 text-center">
            Autovermietung
          </h2>
         <p>
            Keine Autovermietungs-B
         </p>
        </section>
      )}
    </div>
  );
};

export default BookingsComponent;
