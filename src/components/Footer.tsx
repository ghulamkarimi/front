"use client";

import { FaPhoneFlip } from "react-icons/fa6";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fadeIn } from "@/utils/motin";




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
                <motion.div
                    variants={fadeIn("left", 0.8)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ margin: "100px" }}
                >
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
                            <a href="mailto:autoservice.aundo@gmail.com" className="mb-2 text-gray-800 cursor-pointer ">
                                autoservice.aundo@gmail.com
                            </a>
                        </div>

                        {/* Verlinkung zur Adresse auf Google Maps */}
                        <Link
                            href="https://www.google.com/maps/search/?api=1&query=Badenheimer+Str.+6,+55576+Sprendlingen,+Deutschland"
                            target="_blank"
                            className="text-gray-800 cursor-pointer flex flex-col gap-1"
                        >
                            <span>Badenheimer Str. 6,</span>
                            <span>55576 Sprendlingen,</span>
                            <span>Deutschland</span>
                        </Link>
                    </div>
                </motion.div>

                {/* Trennlinie für mobile Ansicht */}
                <div className="md:hidden border-b-2" />

                {/* Newsletter-Anmeldung */}
                <motion.div
                    variants={isMediumScreen ? fadeIn("left", 0.8) : fadeIn("right", 0.8)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ margin: "100px" }}
                >
                    <div>
                        <p className="text-2xl">Newsletter</p>
                        <div className="py-4">
                            <p className="text-gray-800">Abonnieren Sie unseren Newsletter</p>
                            <p className="text-gray-800">Erhalten Sie Infos und Ressourcen kostenlos!</p>
                        </div>

                        <div className="flex justify-between rounded-full w-full py-3 px-4 bg-white my-2">
                            <input
                                placeholder="Ihre E-Mail eingeben"
                                className="rounded-full outline-none w-full md:w-[300px]"
                                type="email"
                            />
                            <button className="bg-blue-500 text-white py-1 px-3 rounded-full">
                                Senden
                            </button>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex gap-8 text-2xl mt-6">
                            <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
                            <FaInstagram className="hover:text-blue-500 cursor-pointer" />
                            <IoLogoYoutube className="hover:text-blue-500 cursor-pointer" />
                            <FaTwitter className="hover:text-blue-500 cursor-pointer" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Hier die Karte einfügen */}
            <div className="mt-4 border-b-2 border-black pb-3">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2582.394179634875!2d7.874873615705454!3d49.82730307939562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8d9b8e3d8f6e3%3A0x2b9d7b3d8f4a1f3b!2sBadenheimer%20Str.%206%2C%2055576%20Sprendlingen!5e0!3m2!1sde!2sde!4v1632888541996!5m2!1sde!2sde"
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


