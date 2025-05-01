'use client';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments, displayAppointments, createAppointmentApi } from "../../../feature/reducers/appointmentSlice";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { RootState, AppDispatch } from "../../../feature/store/store";
import { IAppointment } from "../../../interface";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NotificationService } from "../../../service/NotificationService";
import Image from "next/image";

type CalendarValue = Date | Date[] | null;

const UserCalendar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status } = useSelector((state: RootState) => state.appointments);
    const items = useSelector((state: RootState) => displayAppointments(state));
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [formattedSelectedDate, setFormattedSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userId");
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        setIsClient(true);
        if (status === "idle") {
            dispatch(fetchAppointments());
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (selectedDate && !isNaN(selectedDate.getTime())) {
            setFormattedSelectedDate(formatDate(selectedDate));
        } else {
            console.error("Invalid selected date", selectedDate);
            setFormattedSelectedDate(null);
        }
    }, [selectedDate]);

    const formatDate = (date: Date): string => {
        if (!date || isNaN(date.getTime())) {
            console.error("Invalid date passed to formatDate", date);
            return "";
        }
        return new Intl.DateTimeFormat("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(date);
    };

    const handleDateChange = (value: CalendarValue) => {
        if (value instanceof Date && !isNaN(value.getTime())) {
            setSelectedDate(value);
        } else if (Array.isArray(value) && value[0] instanceof Date && !isNaN(value[0].getTime())) {
            setSelectedDate(value[0]);
        } else {
            setSelectedDate(null);
        }
    };

    const availableTimes = ["07:30", "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"];

    const renderTimeButtons = () => {
        const now = new Date();
        const isToday = selectedDate ? now.toDateString() === selectedDate.toDateString() : false;
        const isSunday = selectedDate ? selectedDate.getDay() === 0 : false; // Prüfen, ob der ausgewählte Tag ein Sonntag ist
      
        return availableTimes.map((time) => {
          const [hours, minutes] = time.split(":").map(Number);
      
          const timeDate = new Date(selectedDate || now);
          timeDate.setHours(hours, minutes, 0, 0);
      
          const isBookedOrBlocked = items.some((appointment: IAppointment) => {
            const appointmentDate = appointment.date ? formatDate(new Date(appointment.date)) : "";
            const isSameDate = appointmentDate === formattedSelectedDate;
            const isSameTime = (appointment.time || "").padStart(5, "0") === time;
            return isSameDate && isSameTime && appointment.isBookedOrBlocked;
          });
      
          const isPastTime = isToday && timeDate < now;
      
          return (
            <button
              key={time}
              className={`px-4 py-2 m-2 rounded-lg text-white ${isBookedOrBlocked || isPastTime || isSunday
                ? "bg-red-500 cursor-not-allowed" // Wenn es Sonntag oder gebucht/blockiert ist
                : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={isBookedOrBlocked || isPastTime || isSunday} // Verhindert Auswahl an Sonntagen
              onClick={() => {
                setSelectedTime(time || "");
              }}
            >
              {time}
            </button>
          );
        });
      };
      
    const initialValues: Omit<IAppointment, "_id" | "isBookedOrBlocked"> = {
        service: "",
        date: formattedSelectedDate || "",
        time: selectedTime || "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        comment: "",
        licensePlate: "",
        hsn: "",
        tsn: "",
        ...(userId && { userId }),
    };

    const validationSchema = Yup.object({
        service: Yup.string().required("Service ist erforderlich"),
        date: Yup.string().required("Datum ist erforderlich"),
        time: Yup.string().required("Zeit ist erforderlich"),
        firstName: Yup.string().required("Vorname ist erforderlich"),
        lastName: Yup.string().required("Nachname ist erforderlich"),
        email: Yup.string().email("Ungültige E-Mail-Adresse").required("E-Mail ist erforderlich"),
        phone: Yup.string()
            .matches(/^\d{10,15}$/, "Telefonnummer muss zwischen 10 und 15 Ziffern haben")
            .required("Telefonnummer ist erforderlich"),
        licensePlate: Yup.string().required("Kennzeichen ist erforderlich"),
        hsn: Yup.string()
        .min(3, "HSN muss mindestens 3 Zeichen lang sein")
        .when("service", {
            is: (service: string) => ["Ölservice", "Aufbreitung"]
            .includes(service),
            then: (schema) => schema.required("HSN ist erforderlich für Ölservice oder Aufbreitung"),
        }),
        tsn: Yup.string().min(3, "TSN muss mindestens 3 Zeichen lang sein").when("service", {
            is: (service: string) => ["Ölservice", "Aufbreitung"].includes(service),
            then: (schema) => schema.required("TSN ist erforderlich für Ölservice oder Aufbreitung"),
        }),
        comment: Yup.string(),
    });

    const handleSubmit = async (values: typeof initialValues, { resetForm }: { resetForm: () => void }) => {
        console.log("Form data submitted:", values);
        try {
            const payload = userId ? { ...values, userId } : values;
            const response = await dispatch(createAppointmentApi(values as IAppointment)).unwrap();
            NotificationService.success(response.message || "Appointment created successfully");
            resetForm();
        } catch (error: any) {
            NotificationService.error(error?.response?.data?.message || "Error creating appointment");
        }
    };

    const [services, setServices] = useState([
        {
            title: "Aufbreitung",
            description: "Eine gründliche Überprüfung aller sicherheitsrelevanten Komponenten Ihres Fahrzeugs, einschließlich Bremsen, Reifen, Lenkung und Beleuchtung. Unsere Aufbreitung sorgt dafür, dass Ihr Fahrzeug in bestem Zustand bleibt und die gesetzlichen Anforderungen erfüllt, damit Sie sorgenfrei unterwegs sind.",
            image: "/aufbreitung.jpg",
            expanded: false,
        },
        {
            title: "Ölservice",
            description: "Ein regelmäßiger Ölwechsel schützt Ihren Motor vor Verschleiß und erhöht die Lebensdauer Ihres Fahrzeugs. Unser Ölservice verwendet hochwertiges Motoröl, das speziell auf die Anforderungen Ihres Fahrzeugs abgestimmt ist, und sorgt für eine optimale Leistung Ihres Motors.",
            image: "/ölwechsel.jpeg",
            expanded: false,
        },
        {
            title: "Radwechsel",
            description: "Wir bieten einen schnellen und professionellen Reifenwechsel, um Ihre Sicherheit auf der Straße zu gewährleisten. Egal, ob Sie Sommer- oder Winterreifen benötigen, wir prüfen Ihre Reifen auf Verschleiß und sorgen für die korrekte Montage. So fahren Sie immer sicher und effizient.",
            image: "/reifen.jpg",
            expanded: false,
        },
        {
            title: "Reifenmontage",
            description: "Ein professioneller und sicherer Wechsel Ihrer Räder, um optimalen Grip und Sicherheit auf der Straße zu gewährleisten. Unser Team sorgt für eine gründliche Prüfung und korrekte Montage, um Ihre Fahrt angenehm und sicher zu machen. Ideal vor und nach der Saison oder bei Wechsel auf Winter- oder Sommerreifen.",
            image: "/mont.jpg",
            expanded: false,
        },
       
    ]);

    const handleServiceSelect = () => {

        setShowForm(true);
    };
    const toggleDescription = (index: number) => {
        setServices((prevServices) =>
            prevServices.map((service, i) =>
                i === index ? { ...service, expanded: !service.expanded } : service
            )
        );
    };


    return (
        <div
            style={{ backgroundImage: `url(/background.jpg)` }}
            className="home-background">
            <div className="">
                <div className="p-6  min-h-screen py-20">
                    <h1 className="text-2xl font-bold mb-4 text-center text-gray-200">Willkommen zu Ihrem persönlichen Werkstatt-Terminplaner {"-"} Einfach. Schnell. Bequem.</h1>
                    <div className="text-center text-gray-200 text-2xl font-bold py-6">
                        <p>Usere Öffnungszeiten</p>
                        <p>Montag - Samstag: 07:30 - 18:00 Uhr</p>
                    </div>



                    <div>
                        {!showForm ? (
                        <div className="flex flex-wrap justify-center gap-8">
                        {services.map((service, index) => (
                          <div
                          key={index}
                          className="max-w-sm rounded-lg shadow-lg bg-white overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                      >
                          <Image
                              width={300}
                              height={200}
                              src={service.image}
                              alt={service.title}
                              className="w-full h-60 object-cover"
                          />
                          <div className="p-6">
                              <h3 className="text-xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                              <div
                                  className={`text-gray-600 text-sm mb-4 overflow-hidden transition-max-height duration-500 ease-in-out`}
                                  style={{
                                      maxHeight: service.expanded ? "500px" : "60px", // Übergangshöhe
                                  }}
                              >
                                  {service.description}
                              </div>
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDescription(index);
                                  }}
                                  className="text-blue-600 text-sm font-medium underline hover:text-blue-800 transition-colors"
                              >
                                  {service.expanded ? "Weniger lesen..." : "Mehr lesen..."}
                              </button>
                          </div>
                          <div className="p-6 border-t border-gray-200">
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      handleServiceSelect();
                                  }}
                                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors"
                              >
                                  Termin vereinbaren
                              </button>
                          </div>
                      </div>
                      
                        
                        ))}
                    </div>
                    

                        ) : (
                            <div>
                                <p className="text-center mb-4 text-xl font-bold text-gray-200">Bitte wählen Sie das Datum und die Uhrzeit für Ihren Termin im Kalender aus.</p>
                                <div className="calendar-container flex justify-center mb-6">
                                    {isClient && (
                                        <Calendar
                                            onChange={(value) => handleDateChange(value as CalendarValue)}
                                            value={selectedDate}
                                            className="shadow-lg rounded-lg p-4 bg-gray-300 w-full max-w-3xl text-black"
                                            tileDisabled={({ date }) => {
                                                const today = new Date();
                                                return (
                                                    date.getDay() === 0 ||
                                                    date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                                                );
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="time-buttons mt-6 text-center">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-200">
                                        Verfügbare Uhrzeiten für den {formattedSelectedDate}:
                                    </h3>
                                    <div className="flex flex-wrap justify-center">{renderTimeButtons()}</div>
                                </div>
                                <div className="form-container max-w-2xl mx-auto bg-slate-200 p-6 rounded-lg shadow-lg mt-8">
                                    <h2 className="text-xl font-bold mb-4 text-center">Terminbuchungsformular</h2>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                        enableReinitialize
                                    >
                                        {({ values }) => (
                                            <Form>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <label htmlFor="service" className="block text-sm font-medium">
                                                            Service
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            name="service"
                                                            className="mt-1 p-2 border rounded-md w-full"
                                                        >
                                                            <option value="">Wählen Sie einen Service</option>
                                                            <option value="Ölservice">Ölservice</option>
                                                            <option value="Aufbreitung">Aufbreitung</option>
                                                            <option value="Reifenmontage">Reifenmontage</option>
                                                            <option value="Radwechsel">Radwechsel</option>
                                                         
                                                        </Field>
                                                        <ErrorMessage name="service" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="date" className="block text-sm font-medium">
                                                            Datum
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            name="date"
                                                            className="mt-1 p-2 border rounded-md w-full"
                                                            value={formattedSelectedDate || ""}
                                                            readOnly
                                                        />
                                                        <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="time" className="block text-sm font-medium">
                                                            Uhrzeit
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            name="time"
                                                            className="mt-1 p-2 border rounded-md w-full"
                                                            value={selectedTime || ""}
                                                            readOnly
                                                        />
                                                        <ErrorMessage name="time" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="firstName" className="block text-sm font-medium">
                                                            Vorname
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            name="firstName"
                                                            className="mt-1 p-2 border rounded-md w-full"
                                                        />
                                                        <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="lastName" className="block text-sm font-medium">
                                                            Nachname
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            name="lastName"
                                                            className="mt-1 p-2 border rounded-md w-full"
                                                        />
                                                        <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium">
                                                            E-Mail
                                                        </label>
                                                        <Field
                                                            type="email"
                                                            name="email"
                                                            className="mt-1 p-2 border rounded-md w-full"
                                                        />
                                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="phone" className="block text-sm font-medium">
                                                            Telefonnummer
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            name="phone"
                                                            className="mt-1 p-2 border rounded-md w-full"
                                                        />
                                                        <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="licensePlate" className="block text-sm font-medium">
                                                            Kennzeichen
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            name="licensePlate"
                                                            className="mt-1 p-2 border rounded-md w-full"
                                                        />
                                                        <ErrorMessage name="licensePlate" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    {["Ölservice", "Aufbreitung"].includes(values.service) && (
                                                        <>
                                                            <div>
                                                                <label htmlFor="hsn" className="block text-sm font-medium">
                                                                    HSN
                                                                </label>
                                                                <Field
                                                                    type="text"
                                                                    name="hsn"
                                                                    className="mt-1 p-2 border rounded-md w-full"
                                                                />
                                                                <ErrorMessage name="hsn" component="div" className="text-red-500 text-sm" />
                                                            </div>
                                                            <div>
                                                                <label htmlFor="tsn" className="block text-sm font-medium">
                                                                    TSN
                                                                </label>
                                                                <Field
                                                                    type="text"
                                                                    name="tsn"
                                                                    className="mt-1 p-2 border rounded-md w-full"
                                                                />
                                                                <ErrorMessage name="tsn" component="div" className="text-red-500 text-sm" />
                                                            </div>
                                                        </>
                                                    )}
                                                    <div>
                                                        <label htmlFor="comment" className="block text-sm font-medium">
                                                            Kommentar
                                                        </label>
                                                        <Field
                                                            as="textarea"
                                                            name="comment"
                                                            rows={3}
                                                            className="mt-1 p-2 border rounded-md w-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <button
                                                        type="submit"
                                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                                                    >
                                                        Termin Buchen
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCalendar;
