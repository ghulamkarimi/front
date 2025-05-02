import React, { useState } from "react";
import { useSelector } from "react-redux";
import { displayAppointments } from "../../../feature/reducers/appointmentSlice";
import { AllReservation } from "../../../feature/reducers/reservationSlice";
import FormattedDate from "../FormatesDate";
import { FaCalendarAlt, FaEuroSign } from "react-icons/fa";
import Image from 'next/image';

const BookingsComponent = () => {
  const userId = localStorage.getItem("userId");

  const appointments = useSelector(displayAppointments);
  const workshopAppointments = appointments.filter(
    (appointment) => appointment.userId?.toString() === userId?.toString()
  );

  const userReservations = useSelector(AllReservation);
  const rentalAppointment = userReservations.filter(
    (reservation) => reservation.user?._id?.toString() === userId?.toString()
  );

  const [activeSection, setActiveSection] = useState("workshop");

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto bg-white rounded-xl shadow-xl">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 md:mb-14 text-center text-orange-600">
        Meine Buchungen
      </h1>

      {/* Umschalt-Buttons */}
      <div className="flex justify-center gap-6 md:gap-12 mb-10">
        <button
          onClick={() => setActiveSection("workshop")}
          className={`px-8 md:px-12 py-3 md:py-4 font-semibold rounded-full transition-all duration-300 ${activeSection === "workshop"
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-800 hover:bg-orange-200"
            }`}
        >
          Leistungen
        </button>
        <button
          onClick={() => setActiveSection("rental")}
          className={`px-8 md:px-12 py-3 md:py-4 font-semibold rounded-full transition-all duration-300 ${activeSection === "rental"
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-800 hover:bg-orange-200"
            }`}
        >
          Autovermietung
        </button>
      </div>

      {/* Inhalte basierend auf der aktiven Sektion */}
      {activeSection === "workshop" && (
        <section>
          <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-orange-500 text-center">
          Ihr Service-Termin
          </h2>
          {workshopAppointments.length > 0 ? (
            <ul className="space-y-6 md:space-y-10">
              {workshopAppointments.map((appointment) => (
                <li
                  key={appointment._id}
                  className="p-6 md:p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-8 border-orange-400"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {appointment.service}
                    </h3>
                    <span
                      className={`px-4 py-2 mt-4 md:mt-0 rounded-full text-sm font-medium ${appointment.isBookedOrBlocked
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {appointment.isBookedOrBlocked
                        ? "Gebucht"
                        : "Verfügbar"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <p className="flex items-center">
                      <FaCalendarAlt className="inline mr-2 text-orange-500" />
                      <strong>Datum:</strong>{" "}
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Zeit:</strong> {appointment.time}
                    </p>
                    {appointment.comment && (
                      <p className="col-span-1 md:col-span-2 italic text-gray-500">
                        {appointment.comment}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center bg-gray-50 p-8 rounded-xl shadow-md">
              <p className="text-xl md:text-2xl text-gray-500">
                Du hast keine Werkstatt-Buchungen vorgenommen.
              </p>
            </div>
          )}
        </section>
      )}

      {activeSection === "rental" && (
        <section>
          <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-orange-500 text-center">
            Autovermietungen
          </h2>
          {rentalAppointment.length > 0 ? (
            <ul className="space-y-6 md:space-y-10">
              {rentalAppointment.map((reservation) => (
                <li
                  key={reservation._id}
                  className="p-6 md:p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-8 border-orange-400"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                    <Image
                      src={reservation.carRent.carImage}
                      alt="car"
                      width={150}
                      height={150}
                      className="rounded-lg"
                    />
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-2xl font-bold">
                        {reservation.carRent.carName}
                      </h3>
                      <p className="text-gray-600">

                        Abholung:{" "}
                        {reservation.pickupDate && (
                          <FormattedDate date={reservation.pickupDate} />
                        )}
                      </p>
                      <p className="text-gray-600">
                        Rückgabe:{" "}
                        {reservation.returnDate && (
                          <FormattedDate date={reservation.returnDate} />
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col py-4">
                  <span className="text-2xl font-semibold text-gray-900 pb-4">
                      Gesamtpreis:{" "}
                      {reservation.gesamtPrice} €
                    </span>
                    <span>
                      <p>„Sie können Ihre Buchungen bis zu 24 Stunden vor dem Abholdatum stornieren!“</p>
                      <p>„Abholort: Badenheimer Straße 4, 55576 Sprendlingen“</p>
                    </span>
                  
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center bg-gray-50 p-8 rounded-xl shadow-md">
              <p className="text-xl md:text-2xl text-gray-500">
                Du hast keine Mietreservierungen vorgenommen.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default BookingsComponent;
