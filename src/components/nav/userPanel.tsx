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
import { AppDispatch, RootState } from "../../../feature/store/store";
import {
  displayUserById,
  setUserId,
  setUserInfo,
  userLogoutApi,
} from "../../../feature/reducers/userSlice";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";
import { NotificationService } from "../../../service/NotificationService";
import { IoIosLogIn } from "react-icons/io";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DropdownMenuDemo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const userId = useSelector((state:RootState)=>state.users.userId);
  console.log("userId",userId)
  const user = useSelector((state: RootState) =>
    displayUserById(state, userId )
  );
  console.log("user",user)
  useEffect(() => {
    const userId = localStorage.getItem("userId") || "";
    if (userId) {
      dispatch(setUserId(userId));
      dispatch(setUserInfo(user));
    } else {
      dispatch(setUserId("")); // Benutzer-ID in Redux zurücksetzen
      dispatch(setUserInfo(null)); // Benutzerinformationen in Redux zurücksetzen
    }
  }, [dispatch])



  const handleLogout = async () => {
    try {
      const response = await dispatch(userLogoutApi()).unwrap();
  
     
      dispatch(setUserId("")); // Benutzer-ID in Redux zurücksetzen
      dispatch(setUserInfo(null)); // Benutzerinformationen in Redux zurücksetzen
      localStorage.clear(); // optional: wenn du alles aus localStorage entfernen willst
  
      NotificationService.success(response.message);
  
      // Debugging Log: Sollte null sein
      console.log("User after logout:", null); 
  
      // Weiterleitung zur Login-Seite
      router.push("/login");
      
    
      
    } catch (error: any) {
      NotificationService.error(
        "Logout fehlgeschlagen: " +
          ((error as Error)?.message || "Unbekannter Fehler")
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
                    src={user?.profile_photo || "/userImage.png"}  // Fallback-Bild
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
