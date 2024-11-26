import React from "react";

export default function Expirated() {
  return (
    <div className="container m-auto text-center">
      <h2 className="mt-5">
        {navigator.language.startsWith("it")
          ? "Puoi caricare il tuo documento d'identità solo prima del giorno successivo al Check In."
          : "You can only upload your ID before the next day of the Check In."}
      </h2>
    </div>
  );
}
