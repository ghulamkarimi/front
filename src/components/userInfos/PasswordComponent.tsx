import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../feature/store/store";
import { NotificationService } from "../../../service/NotificationService";
import { changePasswordApi } from "../../../feature/reducers/userSlice";
import { AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";

const PasswordComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState({
    newPassword: false,
    confirmPassword: false,
  });

  const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  const formik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Ungültige E-Mail-Adresse")
        .required("E-Mail ist erforderlich"),
      newPassword: Yup.string()
        .required("Neues Passwort ist erforderlich")
        .matches(
          passwordStrengthRegex,
          "Mindestens 8 Zeichen, Groß-/Kleinbuchstaben und Zahl erforderlich."
        ),
      confirmPassword: Yup.string()
        .required("Passwort-Bestätigung ist erforderlich")
        .oneOf([Yup.ref("newPassword")], "Passwörter stimmen nicht überein"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(changePasswordApi(values)).unwrap();
        NotificationService.success("Passwort erfolgreich geändert!");
        router.push("/login");
        resetForm();
      } catch (error: any) {
        NotificationService.error(
          error || "Fehler beim Ändern des Passworts. Bitte versuchen Sie es erneut."
        );
      }
    },
  });

  const togglePasswordVisibility = (field: "newPassword" | "confirmPassword") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <AiOutlineLock className="text-6xl text-blue-500 mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-gray-800">Passwort ändern</h2>
          <p className="text-sm text-gray-600">
            Geben Sie Ihre E-Mail und das neue Passwort ein, um es zu ändern.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-Mail
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ihre E-Mail-Adresse"
                className={`mt-2 block w-full px-4 py-3 border rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            <div className="h-6">
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>
          </div>

          {/* New Password Field */}
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Neues Passwort
            </label>
            <div className="relative">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Neues Passwort"
                className={`mt-2 block w-full px-4 py-3 border rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <span
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showPassword.newPassword ? (
                  <AiOutlineEyeInvisible className="text-gray-500" />
                ) : (
                  <AiOutlineEye className="text-gray-500" />
                )}
              </span>
            </div>
            <div className="h-5">
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="text-red-500 text-sm">{formik.errors.newPassword}</p>
              )}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Passwort bestätigen
            </label>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Neues Passwort bestätigen"
                className={`mt-2 block w-full px-4 py-3 border rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <span
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showPassword.confirmPassword ? (
                  <AiOutlineEyeInvisible className="text-gray-500" />
                ) : (
                  <AiOutlineEye className="text-gray-500" />
                )}
              </span>
            </div>
            <div className="h-5">
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={formik.handleReset}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              Ändern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordComponent;
