"use client";
import React, { useState } from "react";
import ProfileComponent from "../../components/userInfos/profileComponent";
import PasswordComponent from "../../components/userInfos/PasswordComponent";
import BookingsComponent from "../../components/userInfos/BookingsComponent";
import LogoutComponent from "../../components/userInfos/LogoutComponent";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState("profile");

  const renderContent = () => {
    switch (selectedOption) {
      case "profile":
        return <ProfileComponent />;
      case "password":
        return <PasswordComponent />;
      case "bookings":
        return <BookingsComponent />;
      case "abmelden":
        return <LogoutComponent />;
      default:
        return <div>Willkommen! Bitte ein Thema auswählen.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-2 bg-gray-50">
      {/* Navbar klein halten */}
      <nav className="bg-gray-100 w-fit rounded-lg flex shadow mb-6">
        <ul className="flex gap-1 p-2">
          <li>
            <button
              className={`px-4 py-2 rounded ${selectedOption === "profile" ? "bg-blue-500 text-white" : ""
                }`}
              onClick={() => setSelectedOption("profile")}
            >
              Profil
            </button>
          </li>
          <li>
            <button
              className={`px-2 py-2 rounded ${selectedOption === "password" ? "bg-blue-500 text-white" : ""
                }`}
              onClick={() => setSelectedOption("password")}
            >
              Passwort
            </button>
          </li>
          <li>
            <button
              className={`px-4 py-2 rounded ${selectedOption === "bookings" ? "bg-blue-500 text-white" : ""
                }`}
              onClick={() => setSelectedOption("bookings")}
            >
              Buchungen
            </button>
          </li>
          <li>
            <button
              className={`px-4 py-2 rounded ${selectedOption === "abmelden" ? "bg-red-500 text-white" : ""
                }`}
              onClick={() => setSelectedOption("abmelden")}
            >
              Abmelden
            </button>
          </li>
        </ul>
      </nav>

      {/* Content breiter */}
      <main className="flex-1 w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg">
        <div>{renderContent()}</div>
      </main>
    </div>
  );
};

export default Page;
