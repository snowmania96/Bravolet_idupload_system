import { Avatar, Button, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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

  //Set media query
  const matches = useMediaQuery("(min-width: 1000px)");
  const onClickSubmitButton = async (e) => {
    setSubmitText("Submitting...");
    localStorage.removeItem("groupInfo");
    e.preventDefault();
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

  useEffect(() => {
    googleTranslateElementInit();
  }, [location]);

  useEffect(() => {
    localStorage.setItem("groupInfo", JSON.stringify(groupInfo));
  }, [groupInfo]);

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

  const fetchReservationInfo = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BASE_URL}/idupload/${id}`);
      const location = response.data.location;
      console.log(location);
      if (location !== "Italy") setLocation(location);
      setReservationInfo(response.data.reservationInfo);
    } catch (err) {
      console.log(err);
      return navigate("/pagenotfound");
    }
  };

  console.log(groupInfo);
  return (
    <div>
      <div id="google_translate_element" style={{ display: "none" }}></div>
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
      <ToastContainer />
    </div>
  );
}
