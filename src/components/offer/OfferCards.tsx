"use client"; // Ganz oben hinzufügen, um clientseitige Hooks zu unterstützen


import { useSelector, useDispatch } from "react-redux";
import { displayOffers } from "../../../feature/reducers/offerSlice";

import { useRouter } from "next/navigation";

const OfferCards = () => {
    const dispatch = useDispatch();
    const offers = useSelector(displayOffers) || [];
    const router = useRouter();


    return (
        <div className="py-8 px-4 my-4">
            {offers.length > 0 && (
                <h2 className="text-5xl font-extrabold mb-8 text-center text-orange-600 text-shadow-md drop-shadow-lg bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                    Unsere aktuellen Angebote
                </h2>
            )}
            <div className="flex flex-wrap place-content-center gap-6">
                {offers.map((offer, index) => (
                    <div
                    onClick={()=> router.push('/werkstatt-service')}
                        key={offer?._id || index} // Fallback zu `index`, falls `_id` fehlt
                        className="offerCarte bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg p-5 w-full sm:w-[400px] max-w-sm transform hover:scale-105"
                    >
                        <img
                            src={offer?.imageUrl}
                            alt={offer?.title}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-3xl font-bold text-orange-500 mt-4 flex justify-between items-center">
                            {offer?.title}
                            <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-sm font-semibold text-center animate-bounce">
                                {offer.discountPercentage}% OFF
                            </span>
                        </h2>
                        <p className="text-black font-bold mt-2">{offer?.description}</p>
                        <div className="flex items-center gap-3 mt-5 text-lg">
                            <p className="font-semibold text-gray-500">Preis:</p>
                            <p className="text-red-400 font-semibold line-through">
                                {offer?.oldPrice ? `${offer?.oldPrice} €` : ""}
                            </p>
                            <p className="text-green-600 font-bold text-xl">
                                {offer?.newPrice ? `${offer?.newPrice} €` : ""}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfferCards;
