


const FahrerDetails = ({ formik }: { formik: any }) => (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <section className="p-4 bg-gray-200 rounded-md">
        <h2 className="font-bold text-xl mb-3">1. Fahrer-Details</h2>
        {["vorname", "nachname", "geburtsdatum", "email", "telefonnummer", "adresse", "postalCode", "stadt"].map((field) => (
          <div key={field} className="mb-4">
            <label
              className="block font-medium mb-1 capitalize"
              htmlFor={field}
            >
              {field === "postalCode" ? "Postleitzahl" : field === "stadt" ? "Stadt" : field}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              placeholder={field === "geburtsdatum" ? "JJJJ-MM-TT" : ""}
              className="w-full border-2 rounded-md p-3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field]}
            />
            {formik.touched[field] && formik.errors[field] && (
              <div className="text-red-500 text-sm">{formik.errors[field]}</div>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full text-white font-medium py-3 rounded-md bg-blue-600 hover:bg-blue-700"
        >
          Weiter zu PayPal
        </button>
      </section>
    </form>
  );
export default  FahrerDetails