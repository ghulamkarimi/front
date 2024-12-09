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
import { displayUserById, userLogoutApi, userUpdated } from "../../../feature/reducers/userSlice"; // Verwende hier den benannten Export
import { FaRegCircleUser } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";
import { NotificationService } from "../../../service/NotificationService";
import { IoIosLogIn } from "react-icons/io";
import { useRouter } from "next/navigation";
import { socket } from "../../../service/index"; // Stelle sicher, dass der Socket-Client korrekt importiert wird
import { IUser } from "../../../interface";

const DropdownMenuDemo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => (userId ? displayUserById(state, userId) : null));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }

    // Verbinde mit dem WebSocket und lausche auf User-Updates
    socket.connect();

    // Lausche auf "userUpdated" Ereignis
    socket.on("userUpdated", (updatedUser: IUser) => {
      if (updatedUser._id === userId) {
        dispatch(userUpdated({ id: updatedUser._id, updatedUser })); // Verwende die korrekte Action
      }
    });

    // Lausche auf "userLoggedOut" Ereignis
    socket.on("userLoggedOut", (loggedOutUserId: string) => {
      if (loggedOutUserId === userId) {
        setUserId(null);
        NotificationService.success("Sie wurden erfolgreich ausgeloggt.");
      }
    });

    return () => {
      socket.off("userUpdated");
      socket.off("userLoggedOut");
      socket.disconnect();
    };
  }, [userId, dispatch]);

  const handleLogout = async () => {
    try {
      const response = await dispatch(userLogoutApi()).unwrap();
      NotificationService.success(response.message);
      // Informiere andere Clients über das Logout
      socket.emit("userLoggedOut", userId);
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
            {user && userId ? (
              <div className="flex items-center gap-4 lg:gap-6 lg:px-8 lg:py-1">
                <span className="flex items-center gap-2">
                  <img className="w-8 h-8 rounded-full" src={user?.profile_photo} alt="Profilbild" />
                  {user?.firstName}
                </span>
              </div>
            ) : (
              <span>Register/Login</span>
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="gap-20">
            <NavigationMenuLink
              className="flex items-center gap-4 lg:gap-10 px-4 lg:px-8 bg-white py-2 hover:bg-gray-200"
              href={user && userId ? "/meinProfile" : "/register"}
            >
              <span>
                {user?.profile_photo ? (
                  <img className="w-8 h-8 rounded-full" src={user.profile_photo} alt="Benutzerbild" />
                ) : (
                  <FaRegCircleUser className="lg:text-2xl" />
                )}
              </span>
              <span>{user && userId ? "Profil" : "Registrieren"}</span>
            </NavigationMenuLink>
            {!user && (
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
            {user && userId && (
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
