import React from "react";

const Impressum = () => {
  return (
    <div className="container mx-auto max-w-3xl p-8 bg-gray-50 shadow-lg rounded-lg my-6">
      <h1 className="text-xl lg:text-4xl font-extrabold mb-8 text-orange-500 text-center">Impressum</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">1. Anbieter</h2>
        <div className="text-gray-700 mt-2 space-y-1">
          <p>AutoService A&U</p>
          <p>Badenheimer Str. 6</p>
          <p>55576 Sprendlingen</p>
          <p>Telefon: +49 151 58124394</p>
          <p>E-Mail: autoservice.aundo@gmail.com</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">2. Verantwortliche Person</h2>
        <p className="text-gray-700 mt-2">
          Omran Ahmadi, vertreten durch AutoService A&U.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">3. Inhaltliche Verantwortung</h2>
        <p className="text-gray-700 mt-2">
          Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Dennoch kann keine Haftung für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernommen werden.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">4. Haftung für Links</h2>
        <p className="text-gray-700 mt-2">
          Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">5. Urheberrecht</h2>
        <p className="text-gray-700 mt-2">
          Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>
      </section>
    </div>
  );
};

export default Impressum;
