'use client';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../feature/store/store';
import { setCarId, setIsDetailsSchutzPacketActive, setIsCarVerfügbar } from '../../feature/reducers/carRentSlice';
import { useEffect } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { checkRefreshTokenApi, setUserId } from '../../feature/reducers/userSlice';

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const { isCarVerfügbar, totalPrice, isDetailsSchutzPacketActive } = useSelector((state: RootState) => state.carRent);
  const { gesamteSchutzInfo } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    const carId = localStorage.getItem('carRentId');
    if (carId) {
      dispatch(setCarId(carId));
    }
  }, [dispatch]);

  useEffect(() => {
    const checkUserIsLogin = async () => {
      try {
        await dispatch(checkRefreshTokenApi()).unwrap();
        const userId = localStorage.getItem('userId');
        if (userId) {
          dispatch(setUserId(userId));
        }
      } catch (error: any) {
        localStorage.clear();
        dispatch(setUserId(''));
      }
    };
    checkUserIsLogin();
  }, []);

  const handleProceed = () => {
    const carId = localStorage.getItem('carRentId');
    if (carId) {
      localStorage.setItem('totalPrice', totalPrice.toString());
      setTimeout(() => {
        router.push(`/fahrzeugvermietung/${carId}`);
        dispatch(setIsCarVerfügbar(false));
      }, 1000);
    }
  };

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
              <button onClick={() => handleProceed()} className="bg-yellow-400 font-bold md:text-lg px-6 py-2 rounded-md">
                Weiter mit diesem Fahrzeug
              </button>
              <button onClick={() => dispatch(setIsCarVerfügbar(false))} className="border-2 border-orange-400 text-orange-400 font-bold px-6 py-2 rounded-md">
                Ein anderes Fahrzeug auswählen
              </button>
            </div>
          </div>
        </div>
      )}
      {isDetailsSchutzPacketActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative w-full max-w-4xl h-auto bg-white border border-gray-300 shadow-lg rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{gesamteSchutzInfo?.name}</h2>
                <p className="text-sm text-gray-600">Selbstbeteiligung: {gesamteSchutzInfo?.deductible} €</p>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-800">{gesamteSchutzInfo?.dailyRate} € / Tag</span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Leistungsübersicht</h3>
              <ul className="space-y-3">
                {gesamteSchutzInfo?.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <FaCheck className="text-green-500 text-lg" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6">
              <button onClick={() => dispatch(setIsDetailsSchutzPacketActive(false))} className="px-6 py-2 text-sm font-medium text-gray-700 border border-orange-400 rounded-md hover:bg-orange-50 focus:ring focus:ring-orange-200">
                Zurück zu Ihrer Buchung
              </button>
              <button onClick={() => dispatch(setIsDetailsSchutzPacketActive(false))} className="px-6 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:ring focus:ring-yellow-300">
                Auswählen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
