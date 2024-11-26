import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const GoogleTranslate = (country) => {
  const isInitialized = useRef(false); // Keeps track of whether Google Translate has been initialized

  useEffect(() => {
    // // Function to check if the user is in Italy
    // const isUserInItaly = () => {
    //   const userLanguage = navigator.language || navigator.userLanguage; // Get browser language
    //   return userLanguage.startsWith("it"); // Italian (either 'it' or 'it-IT')
    // };

    // If the Google Translate script is already loaded and initialized, do nothing
    if (isInitialized.current) return;

    // Check if user is not in Italy
    if (country !== "Italy") {
      // Dynamically load the Google Translate script
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;

      // Callback to initialize Google Translate widget
      script.onload = () => {
        window.googleTranslateElementInit = () => {
          const translateElement = new window.google.translate.TranslateElement(
            {
              pageLanguage: "it", // Default language (Italian)
              includedLanguages: "en,it", // Available languages (English and Italian)
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE, // Dropdown layout
              autoDisplay: false, // Do not display the widget automatically
            },
            "google_translate_element"
          );

          // Automatically trigger translation to English
          setTimeout(() => {
            const iframe = document.querySelector(
              "iframe.VIpgJd-ZVi9od-xl07Ob-OEVmcd"
            );
            if (iframe) {
              const doc = iframe.contentWindow.document;
              const langSelector = doc.querySelector(
                "a.VIpgJd-ZVi9od-vH1Gmf-ibnC6b"
              );
              const lang = langSelector.querySelector("span.text");
              lang.click();
            }
          }, 3000); // Give it time to load fully
        };
      };

      // Handle script load error
      script.onerror = (err) => {
        console.error("Google Translate script failed to load", err);
      };

      // Append the script to the document body
      document.body.appendChild(script);
    }

    // Mark Google Translate as initialized
    isInitialized.current = true;

    // Cleanup function: remove the script when the component unmounts
    return () => {
      const scriptTags = document.querySelectorAll(
        'script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
      );
      scriptTags.forEach((scriptTag) => scriptTag.remove());
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div id="google_translate_element" style={{ display: "none" }}></div> // This is where the widget will appear (hidden by default)
  );
};

export default function RentalAgreement() {
  const { id } = useParams();
  const [text, setText] = useState([]);
  const [location, setLocation] = useState("Italy");
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
      const result = await axios.get(
        `${REACT_APP_BASE_URL}/idupload/fetch/${id}`
      );
      console.log(result.data);
      const location = result.data.location;
      if (location !== "Italy") setLocation(location);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center">
      <GoogleTranslate />
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
