import { AiOutlineClose } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setGesamtSchutzInfo } from "../../../feature/reducers/appSlice";
import { useEffect } from "react";

interface PackageOptionProps {
  name: string;
  deductible: number;
  dailyRate: number;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
  onToggleDetails: () => void;
  isDetailsActive: boolean;
  gesamteSchutzPrice: string;
}

const PackageOption = ({
  name,
  deductible,
  dailyRate,
  features,
  isSelected,
  onSelect,
  onToggleDetails,
  isDetailsActive,
  gesamteSchutzPrice,
}: PackageOptionProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedGesamtSchutzInfo = localStorage.getItem("GesamtSchutzInfo");
    if (storedGesamtSchutzInfo) {
      dispatch(setGesamtSchutzInfo(JSON.parse(storedGesamtSchutzInfo)));
    }
  }, [dispatch]);

  return (
    <div className="w-full flex items-center justify-center p-5">
      <fieldset
        className={`w-full xl:w-[32rem] rounded-lg shadow-lg p-6 border-2 transition-all duration-300 ${
          isSelected ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
        } hover:shadow-xl`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">{name}</h1>
          <div
            className={`text-sm px-3 py-1 rounded-md font-semibold ${
              isSelected ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {isSelected ? "Ausgewählt" : "Optional"}
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Selbstbeteiligung:</strong> <span className="font-medium">{deductible} €</span>
          </p>
          <p className="text-sm text-gray-600">
            <strong>Preis:</strong> {dailyRate} € / Tag
          </p>
          <p className="text-lg font-bold text-gray-800 mt-2">
            Gesamtpreis: <span className="text-green-500">{gesamteSchutzPrice} €</span>
          </p>
        </div>

        {/* Features */}
        <div className="mt-5 border-t pt-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              {index < 3 ? (
                <FaCheck className="text-green-500 text-base" />
              ) : (
                <AiOutlineClose className="text-gray-400 text-base" />
              )}
              <p
                className={`text-sm ${
                  index < 3 ? "text-gray-800 font-medium" : "text-gray-400"
                }`}
              >
                {feature}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onToggleDetails}
            className="text-blue-500 text-sm hover:underline"
          >
            {isDetailsActive ? "Weniger Details anzeigen" : "Weitere Details anzeigen"} →
          </button>
          <button
            onClick={() => {
              onSelect();
              dispatch(
                setGesamtSchutzInfo({
                  name,
                  deductible,
                  dailyRate,
                  features,
                  gesamtPrice: gesamteSchutzPrice,
                })
              );
              localStorage.setItem(
                "GesamtSchutzInfo",
                JSON.stringify({
                  name,
                  deductible,
                  dailyRate,
                  features,
                  gesamtPrice: gesamteSchutzPrice,
                })
              );
            }}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              isSelected
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {isSelected ? "Ausgewählt" : "Wählen"}
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default PackageOption;