import React from "react";

export default function Uploaded() {
  return (
    <div className="container m-auto text-center">
      <h2 className="mt-5">
        {navigator.language.startsWith("it")
          ? "Hai già caricato il tuo ID. Puoi caricare il tuo ID solo una volta."
          : "You have already uploaded your ID. You can only upload your ID once."}
      </h2>
    </div>
  );
}
