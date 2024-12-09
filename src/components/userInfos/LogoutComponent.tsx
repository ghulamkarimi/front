import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../feature/store/store";
import { userLogoutApi} from "../../../feature/reducers/userSlice";
import { NotificationService } from "../../../service/NotificationService";
import { MdLogout } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";

const LogoutComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await dispatch(userLogoutApi()).unwrap();
      
      NotificationService.success("Erfolgreich abgemeldet!");
      router.push("/home");
    } catch (error) {
      NotificationService.error("Abmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

 

  return (
    <div className="flex items-center justify-center py-10 ">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <MdLogout className="text-6xl text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Möchten Sie sich abmelden?</h2>
        <p className="text-gray-500 mb-4">
          Nach der Abmeldung können Sie Ihre Buchungen oder Verwaltung nicht mehr anzeigen oder bearbeiten.
        </p>
        <p className="text-gray-500 mb-6">
          Sie müssen sich erneut anmelden, um Zugang zu diesen Funktionen zu erhalten.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Abmelden
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutComponent;
