import { Avatar, Button, Divider, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import IduploadAutocomplete from "../../components/IduploadAutocomplete";
import IduploadInputField from "../../components/IduploadInputField";
import IduploadSelectField from "../../components/IduploadSelectField";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import documenti from "./documenti.json";
import comuni from "./comuni.json";
import stati from "./stati.json";
import { green, pink } from "@mui/material/colors";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CleaaningServicesIcon from "@mui/icons-material/CleaningServices";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadForm from "../../components/UploadForm";
import axios from "axios";
import "dayjs/locale/it";
import { useNavigate, useParams } from "react-router-dom";
import image from "./check (1).png";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import useMediaQuery from "@mui/material/useMediaQuery";

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
                "a.VIpgJd-ZVi9od-vH1Gmf-ibnC6b span.text"
              );
              console.log(langSelector);
              langSelector.click();
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

export default function Idupload() {
  //Individual memberInfo
  const memberInfo = {
    surname: "",
    givenname: "",
    gender: "",
    dateOfBirth: dayjs("2024-01-01"),
    placeOfBirth: { Descrizione: "" },
    citizenship: { Descrizione: "" },
    documentType: { Descrizione: "" },
    documentNumber: "",
    placeOfReleaseDocument: { Descrizione: "" },
  };
  const [idUploaded, setIdUploaded] = useState(false);
  const [groupInfo, setGroupInfo] = useState(() => {
    const savedData = localStorage.getItem("groupInfo");
    if (savedData) {
      const temp = JSON.parse(savedData);
      for (let i = 0; i < temp.length; i++) {
        temp[i].dateOfBirth = dayjs(temp[i].dateOfBirth);
      }
      return temp;
    } else {
      return [memberInfo];
    }
  });
  const [submitText, setSubmitText] = useState("Submit");
  const [reservationInfo, setReservationInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState("Italy");
  const [modal, setModal] = useState(false);

  //Set media query
  const matches = useMediaQuery("(min-width: 1000px)");
  const onClickSubmitButton = async (e) => {
    e.preventDefault();
    setModal(true);
  };

  const onClickYesButton = async () => {
    setSubmitText("Submitting...");
    localStorage.removeItem("groupInfo");
    setModal(false);
    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/idupload/input/${id}`,
        { groupInfo, reservationInfo }
      );
      console.log(response.data);
      setLoading(true);
    } catch (err) {
      console.log(err);
      setSubmitText("Submit");
      toast.error(err.response.data, { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchReservationInfo();
    const savedData = localStorage.getItem("groupInfo");
    if (savedData) setIdUploaded(true);
  }, []);

  const fetchReservationInfo = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_BASE_URL}/idupload/get/${id}`
      );
      const location = response.data.location;
      console.log(location);
      if (location !== "Italy") setLocation(location);
      setReservationInfo(response.data.reservationInfo);
    } catch (err) {
      console.log(err);
      if (err.response.data === "You can upload once") {
        return navigate("/uploaded");
      }
      if (
        err.response.data === "You can upload before the next day of check in"
      ) {
        return navigate("/expirated");
      }
      return navigate("/pagenotfound");
    }
  };

  console.log(groupInfo);
  return (
    <div>
      <GoogleTranslate country={location} />
      <div
        className="jumbotron text-center w-100"
        style={{ textAlign: "center", height: "250px" }}
      >
        <Typography className="mt-1" variant="h1">
          Verifica dell'identità
        </Typography>
        <Typography className="mt-2" variant="h4">
          (TULPS art. 109)
        </Typography>
        <Typography className="mt-4" variant="h3">
          Carica il tuo documento di identità
        </Typography>
      </div>
      <div
        className="container"
        style={matches ? { width: "700px" } : { width: "100%" }}
      >
        {!loading ? (
          <form className="was-validated" onSubmit={onClickSubmitButton}>
            {idUploaded ? (
              <div>
                {groupInfo.map((member, id) => {
                  return (
                    <div>
                      {id === 0 ? (
                        <div className="d-flex justify-content-between mt-5">
                          <h3>Informazioni Personali</h3>
                          <Button
                            color="default"
                            onClick={() => {
                              setGroupInfo((prevGroupInfo) =>
                                prevGroupInfo.map((member, index) =>
                                  index === 0 ? memberInfo : member
                                )
                              );
                            }}
                          >
                            <CleaaningServicesIcon /> Chiara
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between mt-5">
                          <h4>Membro {id}</h4>

                          <Button
                            color="default"
                            onClick={() => {
                              setGroupInfo((prevGroupInfo) =>
                                prevGroupInfo.filter(
                                  (member, index) => index !== id
                                )
                              );
                            }}
                          >
                            <DeleteIcon /> Eliminare
                          </Button>
                        </div>
                      )}
                      <Divider
                        style={{
                          marginTop: "5px",
                          borderBottomWidth: "1px",
                          backgroundColor: "grey",
                        }}
                      />
                      <div className="d-flex flex-row justify-content-between">
                        <div className="mr-1 w-100">
                          <IduploadInputField
                            name={"givenname"}
                            fieldName={"Nome"}
                            value={groupInfo[id].givenname}
                            id={id}
                            setGroupInfo={setGroupInfo}
                            tooltipTitle={
                              "Nome, rispettare i caratteri previsti"
                            }
                          />
                        </div>
                        <div className="mr-1 w-100">
                          <IduploadInputField
                            name={"surname"}
                            fieldName={"Cognome"}
                            id={id}
                            value={groupInfo[id].surname}
                            setGroupInfo={setGroupInfo}
                            tooltipTitle={
                              "Cognome, rispettare i caratteri previsti"
                            }
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-row justify-content-between">
                        <div className="w-100 mt-3">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                              components={["DatePicker"]}
                              sx={{
                                paddingTop: "-8px",
                              }}
                            >
                              <DemoItem>
                                <label className="form-label">
                                  {"Data Nascita"}
                                </label>
                                <div>
                                  <DatePicker
                                    value={groupInfo[id].dateOfBirth}
                                    sx={
                                      matches
                                        ? { width: "331px" }
                                        : { width: "100%" }
                                    }
                                    slotProps={{ textField: { size: "small" } }}
                                    onChange={(e) => {
                                      setGroupInfo((prevGroupInfo) =>
                                        prevGroupInfo.map((member, index) =>
                                          index === id
                                            ? { ...member, dateOfBirth: e }
                                            : member
                                        )
                                      );
                                    }}
                                  />
                                </div>
                              </DemoItem>
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                        <div className="w-100 ml-1">
                          <IduploadSelectField
                            name={"gender"}
                            fieldName={"Sesso"}
                            value={groupInfo[id].gender}
                            selectItems={["Maschio", "Femmina"]}
                            id={id}
                            setGroupInfo={setGroupInfo}
                          />
                        </div>
                      </div>

                      <IduploadAutocomplete
                        fieldName={"Cittadinanza"}
                        items={stati}
                        value={groupInfo[id].citizenship}
                        name={"citizenship"}
                        id={id}
                        setGroupInfo={setGroupInfo}
                        tooltipTitle={"Cittadinanza, Selezionare lo Stato"}
                      />
                      <IduploadAutocomplete
                        fieldName={"Comune Nascita"}
                        items={comuni}
                        name={"placeOfBirth"}
                        value={groupInfo[id].placeOfBirth}
                        id={id}
                        setGroupInfo={setGroupInfo}
                        tooltipTitle={
                          "Luogo di Nascita, Selezionare il comune italiano o lo stato estero"
                        }
                      />
                      {id === 0 && (
                        <div>
                          <IduploadAutocomplete
                            fieldName={"Luogo Rilascio Documento"}
                            items={comuni}
                            value={groupInfo[id].placeOfReleaseDocument}
                            name={"placeOfReleaseDocument"}
                            id={id}
                            setGroupInfo={setGroupInfo}
                            tooltipTitle={
                              "Luogo Documento, Selezionare il comune italiano o lo stato estero"
                            }
                          />
                          <div
                            className={
                              matches
                                ? "d-flex flex-row justify-content-between"
                                : "d-flex flex-column justify-content-between"
                            }
                          >
                            <div className={matches ? "mr-1 w-100" : "w-100"}>
                              <IduploadAutocomplete
                                fieldName={"Tipo Documento"}
                                items={documenti}
                                name={"documentType"}
                                value={groupInfo[id].documentType}
                                id={id}
                                setGroupInfo={setGroupInfo}
                                tooltipTitle={
                                  "Selezionare il tipo di Documento"
                                }
                              />
                            </div>
                            <div className={matches ? "ml-1 w-100" : "w-100"}>
                              <IduploadInputField
                                name={"documentNumber"}
                                fieldName={"Numero Documento"}
                                id={id}
                                setGroupInfo={setGroupInfo}
                                value={groupInfo[id].documentNumber}
                                tooltipTitle={"Numero del Documento"}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="d-flex flex-column  mt-5">
                  <div className="d-flex justify-content-center">
                    <Button
                      onClick={() =>
                        setGroupInfo((prevGroupInfo) => [
                          ...prevGroupInfo,
                          memberInfo,
                        ])
                      }
                    >
                      <Avatar sx={{ bgcolor: green[500] }}>
                        <GroupAddIcon />
                      </Avatar>
                    </Button>
                  </div>
                  <div className="text-center">Aggiungi un altro ospite</div>
                </div>
                <div className="mt-5 mb-5">
                  <button
                    className="btn"
                    type="submit"
                    disabled={submitText === "Submit" ? false : true}
                    style={{
                      backgroundColor: "#00756a",
                      color: "white",
                      width: "100%",
                      height: "40px",
                      marginBottom: "50px",
                    }}
                  >
                    {submitText}
                  </button>
                </div>
              </div>
            ) : (
              <UploadForm
                setIdUploaded={setIdUploaded}
                setGroupInfo={setGroupInfo}
                id={id}
              />
            )}
          </form>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <div>
              <h4>Grazie!</h4>
            </div>
            <div className="mt-3">
              <img src={image} width={"70px"} />
            </div>
            <div className="mt-5 text-center">
              <h4>Le tue informazioni sono state inviate con successo.</h4>
            </div>
          </div>
        )}
      </div>
      {modal && (
        <div className="Modal">
          <div
            className="Modal-Background"
            onClick={() => setModal(false)}
          ></div>
          <div className="Modal-Content text-center">
            <div className="Modal-Header">
              <span className="Close" onClick={() => setModal(false)}>
                &times;
              </span>
            </div>

            <div className="Modal-Body">
              <h4 className="mt-4">
                Sei sicuro di aver aggiunto tutti gli invitati a questo modulo?
              </h4>
            </div>

            <div className="Modal-Footer mt-2">
              <button
                className="btn mr-2 mt-2"
                style={{
                  width: "75px",
                  backgroundColor: "#00756a",
                  color: "white",
                }}
                onClick={onClickYesButton}
              >
                SÌ
              </button>
              <button
                className="btn ml-2 mt-2"
                style={{
                  width: "75px",
                  backgroundColor: "#6c757d",
                  color: "white",
                }}
                onClick={() => setModal(false)}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
