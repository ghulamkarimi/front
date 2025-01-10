import Link from "next/link";

export default function Contact() {
    return (
        <div className="bg-cover bg-center bg-no-repeat min-h-screen flex justify-center items-center flex-col text-black text-center px-4 py-2"
            style={{ backgroundImage: "url('/hintergrund.webp')" }}
        >
            <div className="bg-gray-100 shadow-md rounded-lg max-w-md w-full p-8">
                <h1 className="text-3xl font-semibold text-center text-orange-500 mb-6">
                    Kontaktieren Sie uns
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Haben Sie Fragen oder benötigen Sie Unterstützung? Wir sind hier, um Ihnen zu helfen.
                    Zögern Sie nicht, uns zu kontaktieren – unser Team freut sich, Ihnen weiterzuhelfen.
                </p>

                <div className="text-center mt-8 text-gray-500">
                    <p className="pb-2">Senden Sie uns eine E-Mail:</p>
                    <p className="font-semibold text-gray-700">
                        <a href="mailto:autoservice.aundo@gmail.com" className="text-gray-700 hover:underline">
                            autoservice.aundo@gmail.com
                        </a>
                    </p>


                    <div className="text-center mt-8 text-gray-500">
                        <p className="pb-2">Oder rufen Sie uns direkt an:</p>
                        <p className="font-semibold text-gray-700">
                            <a href="tel:+493012345678" className="text-gray-700 hover:underline">
                                06701 4499932
                            </a>
                        </p>
                        <p className="font-semibold text-gray-700 mt-1">
                            <a href="tel:+4915158124394" className="text-gray-700 hover:underline">
                                +49 151 58124394
                            </a>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link href="/" className="text-orange-500 hover:underline">
                        Zurück zur Startseite
                    </Link>
                </div>
            </div>
        </div>
    );
}
