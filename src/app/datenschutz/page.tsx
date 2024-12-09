import React from "react";

const Datenschutz = () => {
  return (
    <div className="container mx-auto max-w-3xl p-8 bg-gray-50 shadow-lg rounded-lg my-6">
      <h1 className="text-xl lg:text-4xl font-extrabold mb-8 text-orange-500 text-center">Datenschutzerklärung</h1>

      <section className="mb-8">
        <h2 className="lg:text-2xl font-semibold text-orange-500">1. Allgemeine Hinweise</h2>
        <p className="text-gray-700 mt-2">
          Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und Zweck der Verarbeitung personenbezogener Daten bei der Nutzung unserer Website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">2. Verantwortliche Stelle</h2>
        <div className="text-gray-700 mt-2 space-y-1">
          <p>AutoService A&U</p>
          <p>Badenheimer Str. 6</p>
          <p>55576 Sprendlingen</p>
          <p>Telefon: +49 151 58124394</p>
          <p>E-Mail: autoservice.aundo@gmail.com</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">3. Datenerfassung auf unserer Website</h2>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-orange-400">Cookies</h3>
          <p className="text-gray-700 mt-1">
            Unsere Website verwendet teilweise Cookies, die auf Ihrem Rechner keinen Schaden anrichten. Sie dienen dazu, unser Angebot nutzerfreundlicher und sicherer zu machen.
          </p>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-orange-400">Server-Log-Dateien</h3>
          <p className="text-gray-700 mt-1">
            Der Provider der Seiten erhebt automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser übermittelt. Diese Daten sind nicht bestimmten Personen zuordenbar.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">4. Nutzung von Analyse-Tools</h2>
        <p className="text-gray-700 mt-2">
          Wir verwenden Analysetools wie Google Analytics, um die Nutzung unserer Website zu analysieren. Die Datenverarbeitung erfolgt nur mit Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">5. Rechte der betroffenen Person</h2>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-orange-400">Auskunft, Löschung, Berichtigung</h3>
          <p className="text-gray-700 mt-1">
            Sie haben jederzeit das Recht auf Auskunft über Ihre gespeicherten personenbezogenen Daten sowie das Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.
          </p>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-orange-400">Widerspruchsrecht</h3>
          <p className="text-gray-700 mt-1">
            Sie haben das Recht, gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen, sofern diese auf Art. 6 Abs. 1 lit. e oder f DSGVO basiert.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500">6. Änderungen dieser Datenschutzerklärung</h2>
        <p className="text-gray-700 mt-2">
          Wir behalten uns das Recht vor, diese Datenschutzerklärung anzupassen, um den aktuellen rechtlichen Anforderungen zu entsprechen oder Änderungen unserer Dienstleistungen umzusetzen.
        </p>
      </section>
    </div>
  );
};

export default Datenschutz;
