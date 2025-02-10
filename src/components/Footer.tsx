"use client";

import { FaPhoneFlip, FaTiktok } from "react-icons/fa6";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
import { useEffect, useState } from "react";
import Link from "next/link";

const Footer = () => {

    function useMediaQuery(query: string) {
        const [matches, setMatches] = useState(false);

        useEffect(() => {
            const media = window.matchMedia(query);
            if (media.matches !== matches) {
                setMatches(media.matches);
            }
            const listener = () => setMatches(media.matches);
            media.addEventListener("change", listener);
            return () => media.removeEventListener("change", listener);
        }, [matches, query]);

        return matches;
    }
    const isMediumScreen = useMediaQuery("(max-width: 640px)");

    return (
        <div className="font-VIGA bg-orange-500 py-4 px-4">
            <div className="flex flex-col gap-4 md:flex-row justify-between border-b-2 border-black shadow-sm pb-4">

                {/* Logo und Kontaktinformation */}
                <div>
                    <div>
                        <div className="flex items-center gap-3">
                            <img className="w-14 rounded-full" src="/logo.png" alt="Logo" />
                            <p className="text-xl">Service, Vermietung, An- und Verkauf</p>
                        </div>

                        <div className="flex items-center gap-4 my-4 cursor-pointer">
                            <p className="text-xl">Lets talk!</p>
                            <FaPhoneFlip className="text-xl text-yellow-500 animate-bounce" />
                        </div>

                        <div className="flex flex-col">
                            <a href="tel:+4915158124394" className="my-2 text-gray-800 cursor-pointer">
                                +49 151 58124394
                            </a>
                            <a href="tel:+49 6701 4499835" className="my-2 text-gray-800 cursor-pointer">
                                +49 6701 4499835
                            </a>
                            <a href="mailto:autoservice.aundo@gmail.com" className="mb-2 text-gray-800 cursor-pointer ">
                                autoservice.aundo@gmail.com
                            </a>
                        </div>

                        {/* Verlinkung zur Adresse auf Google Maps */}
                        <Link
                            href="https://www.google.com/maps/search/?api=1&query=Badenheimer+Str.+4,+55576+Sprendlingen,+Deutschland"
                            target="_blank"
                            className="text-gray-800 cursor-pointer flex flex-col gap-1"
                        >
                            <span>Badenheimer Str. 4,</span>
                            <span>55576 Sprendlingen,</span>
                            <span>Deutschland</span>
                        </Link>
                    </div>
                </div>

                {/* Trennlinie für mobile Ansicht */}
                <div className="md:hidden border-b-2" />

                {/* Newsletter-Anmeldung */}
                <div>
                    <div>
                        <p className="text-2xl">Schreiben Sie uns</p>
                        <div className="py-4">
                            <p className="text-gray-800">Haben Sie Fragen?</p>
                            <p> Kontaktieren Sie uns telefonisch oder per E-Mail.</p>
                            <p className="text-gray-800">Wir stehen Ihnen gerne zur Verfügung!</p>
                        </div>



                        {/* Social Media Icons */}
                        <div className="flex flex-col mt-6">
                            <p className="text-gray-800">
                                Folgen Sie uns auf Social Media
                            </p>
                            <div className="flex gap-8 text-2xl mt-2">

                                <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
                                <a href="https://www.instagram.com/aundoauto?igsh=MWxrM2Q1NWM2NXJ1MA== "
                                    target="_blank" rel="noopener noreferrer">
                                    <FaInstagram className="hover:text-blue-500 cursor-pointer" />
                                </a>

                                <IoLogoYoutube className="hover:text-blue-500 cursor-pointer" />


                                <a href="https://www.tiktok.com/@hazaraausdaykundi?_t=ZN-8siCi87IPSA&_r=1"
                                    target="_blank" rel="noopener noreferrer">
                                    <FaTiktok className="hover:text-blue-500 cursor-pointer" />
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hier die Karte einfügen */}
            <div className="mt-4 border-b-2 border-black pb-3">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2572.194882495442!2d7.982993676366877!3d49.857583771485054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bdf3c888fdbb75%3A0x7cfda4a4f6cc0a05!2sBadenheimer%20Str.%204%2C%2055576%20Sprendlingen!5e0!3m2!1sen!2sde!4v1734986086037!5m2!1sen!2sde"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"

                />

            </div>

            {/* Copyright-Text */}
            <div className="flex flex-col items-center text-center pt-2">
                <p>©2024 A & O. Alle Rechte vorbehalten.| <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link></p>
                <p>Powered by Ghulam & Khalil</p>
            </div>
        </div>
    );
};

export default Footer;
