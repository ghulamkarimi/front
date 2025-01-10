"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { displayCarBuyById, fetchCarBuys } from "../../../../feature/reducers/carBuySlice";
import { AppDispatch, RootState } from "../../../../feature/store/store";
import { IoMail } from "react-icons/io5";
import { FaCalendarAlt, FaPhoneAlt, FaRoad } from "react-icons/fa";
import { TbManualGearboxFilled } from "react-icons/tb";
import { IoMdSpeedometer } from "react-icons/io";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa6";
import FormattedDate from "@/components/FormatesDate";
import Carousel from "react-multi-carousel";
import Zoom from "react-medium-image-zoom";
import "react-multi-carousel/lib/styles.css";
import "react-medium-image-zoom/dist/styles.css";
import Image from "next/image";

const Page = () => {
    const { id: carId } = useParams();
    console.log("Car ID aus der URL:", carId);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();

    const singleCar = useSelector((state: RootState) => displayCarBuyById(state, carId as string));
    console.log("Einzelnes Fahrzeug aus Redux:", singleCar);

    useEffect(() => {
        if (!singleCar) {
            console.log("Daten werden aus dem Backend geladen...");
            dispatch(fetchCarBuys())
                .unwrap()
                .then(() => {
                    console.log("Daten erfolgreich geladen.");
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Fehler beim Laden der Daten:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [singleCar, dispatch]);

    if (!carId) {
        return <h1 className="text-2xl md:text-4xl text-center">Ungültige Fahrzeug-ID</h1>;
    }

    if (loading) {
        return <h1 className="text-2xl md:text-4xl text-center">Daten werden geladen...</h1>;
    }

    if (!singleCar) {
        return <h1 className="text-2xl md:text-4xl text-center">Fahrzeug mit dieser ID nicht gefunden</h1>;
    }

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    return (
        <div className="flex flex-col items-center rounded-lg py-4 px-4 sm:px-8">
            {singleCar?.carImages?.length > 0 ? (
                <Carousel
                    responsive={responsive}
                    className="w-full h-[600px]"
                    showDots={true}
                    keyBoardControl
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
                >
                    {singleCar?.carImages?.map((image, index) => (
                        <Zoom key={index}>
                            <Image
                                className="w-full h-[600px] object-cover"
                                src={image}
                                alt={singleCar?.carTitle || "Car Image"}
                                width={1920}
                                height={1080}
                                loading="lazy"

                            />
                        </Zoom>
                    ))}
                </Carousel>
            ) : (
                <h2 className="text-xl text-center">Keine Bilder verfügbar</h2>
            )}

            <p className="my-2 font-bold">
                Bitte teilen Sie uns bei Interesse stets die Fahrzeug-ID mit, damit wir Ihnen schnell und effizient
                weiterhelfen können. Vielen Dank!
            </p>
            <div className="w-full max-w-[90%] md:max-w-[700px] lg:max-w-[900px] flex flex-col sm:flex-row justify-around bg-orange-500 my-2 rounded-lg px-4 py-2 gap-4">
                <div className="flex flex-col gap-1 justify-center text-center sm:text-left text-sm md:text-base lg:text-lg">
                    <p className="font-bold">Fahrzeug-ID: {singleCar?.carIdentificationNumber}</p>
                    <p className="font-bold">{singleCar?.carTitle}</p>
                    <p className="font-bold">Preis: {singleCar?.carPrice}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm md:text-base lg:text-lg">
                    <a
                        href="mailto:autoservice.aundo@gmail.com"
                        className="bg-white flex items-center gap-2 py-2 px-3 rounded-lg justify-center sm:justify-start"
                    >
                        <IoMail />
                        <p>Schreiben Sie uns E-Mail</p>
                    </a>
                    <a
                        href="tel:+4915158124394"
                        className="bg-white flex items-center gap-6 py-2 px-3 rounded-lg justify-center sm:justify-start"
                    >
                        <FaPhoneAlt />
                        <p>Rufen Sie uns an</p>
                    </a>
                </div>
            </div>

            {/* Details und Technische Daten */}
            <div className="w-full max-w-[90%] md:max-w-[700px] lg:max-w-[900px] bg-white rounded-lg py-6 px-4 my-2">
                <p>Technische Daten</p>
                <div className="border my-2" />
                <div className="flex flex-col gap-3 even-bg">
                    <p>Fahrzeugzustand: {singleCar?.carAccidentFree ? "Unbeschädigt" : "Beschädigt"}</p>
                    <p>Farbe: {singleCar?.carColor}</p>
                    <p>Category: {singleCar?.carCategory}</p>
                    <p>CO2-Emission: {singleCar?.carEuroNorm}</p>
                    <p>Getriebe: {singleCar?.carGearbox}</p>
                    <p>Letzte Inspektion: <FormattedDate date={singleCar?.carTechnicalInspection} /></p>
                    <p>Erstzulassung: <FormattedDate date={singleCar?.carFirstRegistrationDay} /></p>
                    <p>Kilometerstand: {singleCar?.carKilometers}</p>
                    <p>Leistung: {singleCar?.carHorsePower} PS</p>
                    <p>Kraftstoffart: {singleCar?.fuelType}</p>
                    <p>Außen Farbe: {singleCar?.carColor}</p>
                    <p>Klimaanlages: {singleCar?.carAirConditioning ? "Ja" : "Nein"}</p>
                    <p>Navigationssystem: {singleCar?.carNavigation ? "Ja" : "Nein"}</p>
                    <p>Unfallfrei: {singleCar?.damagedCar ? "Ja" : "Nein"}</p>
                    <p>Parkassistent: {singleCar?.carParkAssist ? "Ja" : "Nein"}</p>
                    <p>Vorbesitzer {singleCar?.owner}</p>
                    <p>Kateogorie: {singleCar?.carCategory}</p>
                    <p>Sitzer: {singleCar?.carSeat}</p>
                    <p>Motor: {singleCar?.carMotor}</p>
                </div>
            </div>

            {/* Fahrzeugbeschreibung */}
            <div className="w-full max-w-[90%] md:max-w-[700px] lg:max-w-[900px] bg-white rounded-lg py-6 px-4 my-2">
                <p>Fahrzeugbeschreibung</p>
                <div className="border my-2" />
                <p>{singleCar?.carDescription}</p>
            </div>
        </div>
    );
};

export default Page;
