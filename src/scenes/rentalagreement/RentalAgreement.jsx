import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export default function RentalAgreement() {
  const { id } = useParams();
  const [text, setText] = useState([]);
  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_BASE_URL}/rentalagreement/${id}`
      );
      const string = response.data.split("\n");
      setText(string);
      const result = await axios.get(`${REACT_APP_BASE_URL}/idupload/${id}`);
      console.log(result.data);
      const location = result.data.location;
      if (location !== "Italy") googleTranslateElementInit();
    } catch (err) {
      console.log(err);
    }
  };

  const googleTranslateElementInit = () => {
    if (window.google && window.google.translate) {
      // Initialize Google Translate widget
      const translateElement = new window.google.translate.TranslateElement(
        {
          pageLanguage: "it", // Source language (Italian)
          includedLanguages: "en,it", // Include English and Italian for translation
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, // Simple dropdown layout
        },
        "google_translate_element"
      );

      // Programmatically select English as the language after initialization
      const interval = setInterval(() => {
        const iframe = document.querySelector("iframe.goog-te-menu-frame"); // Find the iframe containing the language menu
        if (iframe) {
          const doc = iframe.contentWindow.document; // Access the iframe's document
          const langSelector = doc.querySelector(
            ".goog-te-menu2-item span.text"
          ); // Find the language item text

          if (langSelector && langSelector.innerText === "English") {
            // If English is found, simulate a click on it
            langSelector.click();
            clearInterval(interval); // Stop the interval after the language is set
          }
        }
      }, 100); // Check every 100ms until the iframe is loaded and the language is available
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center">
      <div>
        <h1 className="text-center mt-5">Contratto di locazione</h1>
      </div>
      <div className="container mt-3" style={{ fontSize: "16px" }}>
        {text.map((subtext) => {
          if (subtext === "") return <br />;
          else return <p>{subtext}</p>;
        })}
      </div>
    </div>
  );
}
