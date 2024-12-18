import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../feature/store/store";
import { displayUserById, userLogoutApi } from "../../../feature/reducers/userSlice";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";
import { NotificationService } from "../../../service/NotificationService";
import { IoIosLogIn } from "react-icons/io";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DropdownMenuDemo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const user = useSelector((state: RootState) => (userId ? displayUserById(state, userId) : null));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setCurrentUser(user);
    }
  }, [user, userId]);

  const handleLogout = async () => {
    try {
      const response = await dispatch(userLogoutApi()).unwrap();

      NotificationService.success(response.message);
      setCurrentUser(null); // Benutzerzustand leeren
      localStorage.clear();
      router.push("/login");
    } catch (error: any) {
      NotificationService.error(
        "Logout fehlgeschlagen: " + ((error as Error)?.message || "Unbekannter Fehler")
      );
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center bg-white gap-4 h-10 lg:gap-6 lg:py-2">
            {currentUser ? (
              <div className="flex items-center gap-4 lg:gap-6 lg:px-8 lg:py-1">
                <span className="flex items-center gap-2">
                  <Image
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    src={currentUser?.profile_photo}
                    priority
                    alt="Profilbild"
                  />
                  {currentUser?.firstName}
                </span>
              </div>
            ) : (
              <span>Register/Login</span>
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="gap-20">
            <NavigationMenuLink
              className="flex items-center gap-4 lg:gap-10 px-4 lg:px-8 bg-white py-2 hover:bg-gray-200"
              href={currentUser ? "/meinProfile" : "/register"}
            >
              <span>
                {currentUser?.profile_photo ? (
                  <Image
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    src={currentUser?.profile_photo || "/useerBild.png"}
                    alt="Benutzerbild"
                  />
                ) : (
                  <FaRegCircleUser className="lg:text-2xl" />
                )}
              </span>
              <span>{currentUser ? "Profil" : "Registrieren"}</span>
            </NavigationMenuLink>
            {!currentUser && (
              <NavigationMenuLink
                className="flex items-center gap-4 lg:gap-10 px-6 lg:px-8 bg-white py-2 hover:bg-gray-200"
                href="/login"
              >
                <span>
                  <IoIosLogIn className="lg:text-2xl" />
                </span>
                <span>Login</span>
              </NavigationMenuLink>
            )}
            {currentUser && (
              <NavigationMenuLink
                className="flex items-center gap-4 lg:gap-10 px-4 lg:px-8 bg-white py-2 hover:bg-gray-200 cursor-pointer"
                onClick={handleLogout}
              >
                <span>
                  <RiLogoutCircleLine className="text-xl lg:text-2xl" />
                </span>
                <span>Logout</span>
              </NavigationMenuLink>
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
      <NavigationMenuIndicator />
    </NavigationMenu>
  );
};

export default DropdownMenuDemo;
