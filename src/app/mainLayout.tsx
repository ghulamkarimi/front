'use client';

import { useRouter } from 'next/navigation';
import './globals.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../feature/store/store';
import { useEffect, useState } from 'react';
import {
  setCarId,
  setIsDetailsSchutzPacketActive,
  setIsCarVerfügbar,
} from '../../feature/reducers/carRentSlice';
import { FaCheck } from 'react-icons/fa6';
import { getSchutzPacketById } from '../../feature/reducers/schutzPacketSlice';

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const { isCarVerfügbar, totalPrice, isDetailsSchutzPacketActive } = useSelector(
    (state: RootState) => state.carRent
  );
  const { gesamteSchutzInfo } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const router = useRouter();

  // Lokale State-Variablen für localStorage-Daten
  const [storedCarId, setStoredCarId] = useState<string | null>(null);
  const [schutzPacketId, setSchutzPacketId] = useState<string | null>(null);

  // Zugriff auf localStorage nur im Browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStoredCarId(localStorage.getItem('carRentId'));
      setSchutzPacketId(localStorage.getItem('SchutzPacketId'));
    }
  }, []);

  useEffect(() => {
    if (storedCarId) {
      dispatch(setCarId(storedCarId));
    }
  }, [storedCarId, dispatch]);

  const getOneSchutzPacket = useSelector((state: RootState) =>
    getSchutzPacketById(state, schutzPacketId!)
  );

  return (
    <main className="relative z-10">
      <div className={isCarVerfügbar ? 'blur-sm' : ''}>{children}</div>

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
                  if (storedCarId) {
                    localStorage.setItem('totalPrice', totalPrice.toString());
                    setTimeout(() => {
                      router.push(`/fahrzeugvermietung/${storedCarId}`);
                      dispatch(setIsCarVerfügbar(false));
                    }, 2000);
                  }
                }}
                className="bg-yellow-400 font-bold md:text-lg px-6 py-2 rounded-md"
              >
                Weiter mit diesem Fahrzeug
              </button>
              <button
                onClick={() => dispatch(setIsCarVerfügbar(false))}
                className="border-2 border-orange-400 text-orange-400 font-bold px-6 py-2 rounded-md"
              >
                Ein anderes Fahrzeug auswählen
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailsSchutzPacketActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="mt-3 md:w-5/6 xl:w-1/2 w-full h-5/6 xl:h-full border border-gray-300 bg-white shadow-lg rounded-md py-5 px-3 mx-2 md:mx-0">
            <div className="flex items-start justify-center gap-2">
              <div className="flex flex-col justify-start">
                <p className="text-lg font-semibold">{gesamteSchutzInfo?.name}</p>
                <p className="text-sm text-gray-600">
                  Selbstbeteiligung: {gesamteSchutzInfo?.deductible} €
                </p>
              </div>
              <div className="border-2 border-black w-1 h-8 mx-4" />
              <div className="flex flex-col justify-start">
                <p className="text-lg font-semibold">
                  {gesamteSchutzInfo?.dailyRate}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center w-full">
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex gap-3 items-center">
                  <FaCheck className="text-green-400 text-sm" />
                  <p className="text-black font-bold">
                    {gesamteSchutzInfo?.features.map((feature, index) => (
                      <span className="flex flex-col gap-4" key={index}>
                        {feature}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="flex items-center w-full justify-around mt-6">
                <button
                  onClick={() =>
                    dispatch(setIsDetailsSchutzPacketActive(false))
                  }
                  className="px-8 py-2 border-2 border-orange-400 rounded-md"
                >
                  Zurück zu Ihrer Buchung
                </button>
                <button
                  onClick={() =>
                    dispatch(setIsDetailsSchutzPacketActive(false))
                  }
                  className="bg-yellow-400 font-bold md:text-lg px-6 py-2 rounded-md"
                >
                  Auswählen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
