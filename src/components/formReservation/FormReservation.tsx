import { useFormik } from "formik";
import * as Yup from "yup";
import {  useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../feature/store/store";

import {
  createReservationApi,
  getOneReservation,
  setReservationId,
} from "../../../feature/reducers/reservationSlice";
import { NotificationService } from "../../../service/NotificationService";
import { TReservation } from "../../../interface";
import FahrerDetails from "./FahrerDetails";
import PayPalSection from "./PayPalSection";
import { getRentCarById } from "../../../feature/reducers/carRentSlice";



interface FormReservationProps{
  rentalDays:number
}

function ensureString(param: string | string[] | undefined): string {
  return typeof param === "string" ? param : param?.[0] || "";
}
const FormReservation = ({rentalDays}:FormReservationProps) => {
  const { id: carRentIdRaw } = useParams();
  const carRentId = ensureString(carRentIdRaw);
  
  
  const userId = localStorage.getItem("userId") || "";
  const dispatch = useDispatch<AppDispatch>();
  const { reservationId } = useSelector(
    (state: RootState) => state.reservation
  );
const getOneCar = useSelector((state:RootState)=>getRentCarById(state,carRentId || ""))
const {gesamteSchutzInfo} = useSelector((state:RootState)=>state.app)


  // const getReservation = useSelector((state: RootState) =>
  //   getOneReservation(state, reservationId || "")
 
  // );
  // console.log("getReservation",getReservation)



  const [step, setStep] = useState(1);
  const router = useRouter();

  const pickupDate = localStorage.getItem("pickupDate") || "";
  const returnDate = localStorage.getItem("returnDate") || "";
  const pickupTime = localStorage.getItem("pickupTime") || "";
  const returnTime = localStorage.getItem("returnTime") || "";

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const gesamtPrice = localStorage.getItem("gesamtPrice")

  const formSchema = Yup.object({
    vorname: Yup.string().required("Vorname ist erforderlich"),
    nachname: Yup.string().required("Nachname ist erforderlich"),
    geburtsdatum: Yup.string()
      .required("Geburtsdatum ist erforderlich")
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "Geburtsdatum muss im Format JJJJ-MM-TT sein"
      ),

    email: Yup.string()
      .required("Email-Adresse ist erforderlich")
      .email("Ungültige Email-Adresse"),
    telefonnummer: Yup.string()
      .required("Telefonnummer ist erforderlich")
      .matches(/^\d+$/, "Telefonnummer darf nur Zahlen enthalten"),
    adresse: Yup.string().required("Adresse ist erforderlich"),
    postalCode: Yup.string()
      .required("Postleitzahl ist erforderlich")
      .matches(/^\d{5}$/, "Postleitzahl muss 5 Ziffern lang sein"),
    stadt: Yup.string().required("Stadt ist erforderlich"),
  });

  const formik = useFormik({
    initialValues: {
      vorname: "",
      nachname: "",
      geburtsdatum: "",
      email: "",
      telefonnummer: "",
      adresse: "",
      postalCode: "",
      stadt: "",
      gesamtPrice:gesamtPrice || "",
      carRentId: carRentId || "",
      userId: userId || "",
      pickupDate: pickupDate || "",
      returnDate: returnDate || "",
      pickupTime: pickupTime || "",
      returnTime: returnTime || "",
    },
    validationSchema: formSchema,
    onSubmit: async (values: TReservation) => {
      try {
        console.log("value", values);
        const response = await dispatch(createReservationApi(values)).unwrap();
        localStorage.setItem("email", values.email || "");      
        console.log("responsevalue", response);
        NotificationService.success(response.message);
       dispatch(setReservationId(localStorage.getItem("storedReservationId")
       ))
        setStep(2);
      } catch (error: any) {
        NotificationService.error(error.message);
      }
    },
  });

  const createOrderHandler = async () => {
    setLoading(true);
    try {
      const gesamtPreis = localStorage.getItem("gesamtPrice") || "0.00";
      const carRentId = localStorage.getItem("carRentId");
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("email");
      const reservationId = localStorage.getItem("storedReservationId");
      console.log("reservationId", reservationId);
      console.log("Form values:", formik.values);
      console.log("gesamtPreis", gesamtPreis);
      console.log("carRentId", carRentId);
      console.log("userId", userId);
      console.log("customerEmail", email); 

      if (!gesamtPreis || !carRentId || !userId) {
        throw new Error("Fehlende Daten für die Bestellung");
      }

      const response = await fetch(
        "http://localhost:7001/payment/createOrder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: gesamtPreis,
            customerEmail: email,
            carId: carRentId,
            userId: userId,
            reservationId: reservationId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Fehler bei der Erstellung der Bestellung."
        );
      }

      const orderData = await response.json();
      return orderData.orderId;
    } catch (error: any) {
      setPaymentError(error.message || "Fehler bei der Bestellung.");
      console.error("Fehler bei der Bestellung:", error);
    } finally {
      setLoading(false);
    }
  };

  const onApproveHandler = async (data: any) => {
    setLoading(true);
    try {
      const { orderID, payerID } = data;
      const response = await fetch(
        `http://localhost:7001/payment/capture?token=${orderID}&PayerID=${payerID}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      // Überprüfen, ob die Zahlung erfolgreich war, indem wir den Status prüfen und nicht nur die Nachricht
      if (
        response.ok &&
        result.message &&
        result.message.includes("Zahlung erfolgreich abgeschlossen!")
      ) {
        // Zahlung war erfolgreich
        NotificationService.success(
          `Zahlung erfolgreich abgeschlossen! Bestell-ID: ${orderID}`
        );
        router.push("/fahrzeugvermietung");
      } else {
        // Fehlerbehandlung für unerwartete Ergebnisse
        throw new Error(
          result.message || "Zahlung konnte nicht abgeschlossen werden."
        );
      }
    } catch (error: any) {
      // Fehlerbehandlung, wenn die Anfrage fehlschlägt
      setPaymentError(error.message || "Fehler bei der Zahlungsabwicklung.");
      console.error("Fehler bei der Zahlungsabwicklung:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVorOrtZahlenClick = async () => {
    setLoading(true);
    try {
      const values = formik.values;
      const response = await dispatch(createReservationApi(values)).unwrap();
     
      
      NotificationService.success(response.message);
      dispatch(setReservationId(localStorage.getItem("storedReservationId")));
      setTimeout(()=>{
        router.push("/fahrzeugvermietung")
       },2000) ;
    } catch (error: any) {
      NotificationService.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reservierungsformular</h1>
      {step === 1 && <FahrerDetails formik={formik} />}
      {step === 2 && (
        <PayPalSection
          createOrderHandler={createOrderHandler}
          onApproveHandler={onApproveHandler}
          paymentError={paymentError}
          setPaymentError={setPaymentError}
        />
      )}
      <button
           type="submit"
          className={step === 2 ?  "hidden" : "w-full text-white font-medium py-3 mt-3 px-2 rounded-md bg-green-600 hover:bg-green-700"}
        onClick={()=>{
          handleVorOrtZahlenClick();
       
         
        }}
        >
          Vor Ort zahlen
        </button>
    </div>
  );
};

export default FormReservation;