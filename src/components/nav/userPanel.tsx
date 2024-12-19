import React, { useEffect } from "react";
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
import { AppDispatch,RootState } from "../../../feature/store/store";
import { displayUserById, setUserId, setUserInfo, userLogoutApi } from "../../../feature/reducers/userSlice";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";
import { NotificationService } from "../../../service/NotificationService";
import { IoIosLogIn } from "react-icons/io";
import { useRouter } from "next/navigation";
import Image from "next/image";


const DropdownMenuDemo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const userId = localStorage.getItem("userId");
  const user = useSelector((state: RootState) => displayUserById(state, userId || ""));

  console.log("user",user)
  console.log("userId",userId)

  useEffect(() => {
   dispatch(setUserId(userId))
  }, [userId, dispatch]);

  useEffect(() => {
    if (!userId) {
      // Zustand leeren und aus dem Speicher entfernen, falls der Benutzer sich abmeldet
      dispatch(setUserInfo(null));
      dispatch(setUserId(""))
    }
  }, [userId, dispatch]);

  const handleLogout = async () => {
    try {
      const response = await dispatch(userLogoutApi()).unwrap();

      NotificationService.success(response.message);

   

      dispatch(setUserId(""));
      dispatch(setUserInfo(null));
      localStorage.clear()
      
      // Zur Aktualisierung des Benutzerbilds und Benutzerpanels
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
            {user ? (
              <div className="flex items-center gap-4 lg:gap-6 lg:px-8 lg:py-1">
                <span className="flex items-center gap-2">
                  <Image
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    src={user?.profile_photo}
                    priority
                    alt="Profilbild"
                  />
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
              href={user ? "/meinProfile" : "/register"}
            >
              <span>
                {user?.profile_photo ? (
                  <Image
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    src={user?.profile_photo || "/useerBild.png"}
                    alt="Benutzerbild"
                  />
                ) : (
                  <FaRegCircleUser className="lg:text-2xl" />
                )}
              </span>
              <span>{user ? "Profil" : "Registrieren"}</span>
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
            {user && (
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
