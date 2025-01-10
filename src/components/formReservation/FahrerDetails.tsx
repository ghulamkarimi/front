const FahrerDetails = ({ formik }: { formik: any }) => {
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      <section className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="font-bold text-2xl mb-6 text-gray-700">1. Fahrer-Details</h2>

        {["vorname", "nachname", "geburtsdatum", "email", "telefonnummer", "adresse", "postalCode", "stadt"].map(
          (field) => (
            <div key={field} className="mb-5">
              <label
                htmlFor={field}
                className="block text-gray-600 font-medium mb-2 capitalize"
              >
                {field === "postalCode" ? "Postleitzahl" : field === "stadt" ? "Stadt" : field}
              </label>
              <input
                id={field}
                name={field}
                type={field === "email" ? "email" : field === "telefonnummer" ? "tel" : "text"}
                placeholder={field === "geburtsdatum" ? "JJJJ-MM-TT" : ""}
                className="w-full border rounded-md p-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field]}
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="text-red-500 text-sm mt-1">{formik.errors[field]}</p>
              )}
            </div>
          )
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          Weiter zu PayPal
        </button>
      </section>
    </form>
  );
};

export default FahrerDetails;