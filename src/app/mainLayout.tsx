"use client"; 

import { useRouter } from "next/navigation";
import "./globals.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../feature/store/store";
import {
  setCarId, 
  setIsCarVerfügbar,
  setIsLoading,
} from "../../feature/reducers/carRentSlice";
import {  useEffect } from "react";
import { FaCarSide } from "react-icons/fa6";
import { WiFog } from "react-icons/wi";
import { subscribeToSocketEvents } from '../../feature/reducers/offerSlice'; // Passe den Pfad an
import { AppDispatch } from '../../feature/store/store';


interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const {
    isCarVerfügbar,
    totalPrice,
    isBasicDetailsActive,
    isMediumDetailsActive,
    isPremiumDetailsActive,
    loading,
  } = useSelector((state: RootState) => state.carRent);
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const carId = localStorage.getItem("carRentId");

  useEffect(() => {
   
    if (typeof window !== "undefined") {
      

      if (carId) {
        dispatch(setCarId(carId));
      }
    }
  }, [dispatch,carId]);

  useEffect(() => {
    
    subscribeToSocketEvents(dispatch);
  }, [dispatch]);

  return (
    <main className="relative z-10">
      {/* Apply blur to children when isCarVerfügbar is true */}
      <div className={isCarVerfügbar || loading? "blur-sm" : ""}>{children}</div>

      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className=" flex items-center gap-5 border-t-transparent rounded-full antialiased">
            <div className=" flex items-center gap-1 text-3xl text-orange-400">
              <WiFog className="animate-pulse" />
              <WiFog className="animate-pulse" />
              <WiFog className="animate-pulse" />
            </div>
            <div>
              <FaCarSide className="text-orange-400 text-5xl sm:text-[8rem] animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {isCarVerfügbar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 md:w-full">
          <div className="px-4 py-6 flex flex-col w-full md:w-2/3 bg-white rounded-md max-w-lg mx-auto shadow-lg">
            <h1 className="font-bold text-center text-lg md:text-xl xl:text-2xl">
              Sie haben ein Fahrzeug mit geringer Verfügbarkeit ausgewählt
            </h1>
            <p className="text-center mt-4">
              Sie haben eine Fahrzeugkategorie mit geringer Verfügbarkeit
              ausgewählt. Sobald Ihre Buchung abgeschlossen ist, wird sich die
              Station nach Prüfung der Verfügbarkeit innerhalb von 8 Stunden bei
              Ihnen melden, um die Buchung zu bestätigen. Falls die Buchung
              nicht bestätigt wird, bitten wir Sie, eine neue Buchung zu
              tätigen.
            </p>
            <div className="flex py-4 justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  if (carId) {
                    localStorage.setItem("totalPrice", totalPrice.toString());
                    setTimeout(() => {
                      router.push(`/fahrzeugvermietung/${carId}`);
                      dispatch(setIsCarVerfügbar(false));
                      dispatch(setIsLoading(false))
                    }, 2000);
                  }
                }}
                className="bg-yellow-400 font-bold md:text-lg px-6 py-2 rounded-md"
              >
                Weiter mit diesem Fahrzeug
              </button>
              <button
                onClick={() => 
                  {dispatch(setIsLoading(false))
                  dispatch(setIsCarVerfügbar(false))}
                }
                className="border-2 border-orange-400 text-orange-400 font-bold px-6 py-2 rounded-md"
              >
                Ein anderes Fahrzeug auswählen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dark background overlay for additional states */}
      {isBasicDetailsActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Inhalt hier */}
        </div>
      )}
      {isMediumDetailsActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Inhalt hier */}
        </div>
      )}
      {isPremiumDetailsActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Inhalt hier */}
        </div>
      )}
    </main>
  );
}
