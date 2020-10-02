import React, { useState, useCallback } from "react";
import styled from "styled-components";
import Head from "next/head";
import { format as formatDate } from "date-fns";
import styles from "../styles/Home.module.css";
import ExcelDropzone from "../components/ExcelDropzone";
import DatePicker from "../components/DatePicker";

const useFileUpload = () => {
  const [uploadState, setUploadState] = useState({
    status: null,
    errorMessage: null,
  });

  const setError = (error) =>
    setUploadState({ status: "error", errorMessage: error });

  const uploadFile = async (file, date) => {
    setUploadState({ status: "loading" });
    if (!file) {
      setError("That file isn't valid. Try again");
      return;
    }
    const formData = new FormData();
    formData.append("results", file);
    formData.append("date", date);
    fetch("/api/uploadResults", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          response
            .text()
            .then((error) =>
              setError(`Something went wrong on the server: ${error}`)
            );
          return;
        }
        setUploadState({ status: "success" });
      })
      .catch((error) => {
        setError(`Something went wrong: ${error.message}`);
      });
  };

  return [uploadState, uploadFile];
};

const DatePickerContainer = styled.div`
  margin: 30px;
`;

const renderUploadSection = () => {
  const [uploadState, uploadFile] = useFileUpload();
  const [date, setDate] = useState(new Date());

  const handleFileDrop = useCallback(([file]) => {
    uploadFile(file, formatDate(date, "dd/MM/yyyy"));
  });

  const { status, errorMessage } = uploadState;

  let text = null;

  switch (status) {
    default:
      text = (
        <>
          Select the trivia date, and upload an excel file to be processed.
          <br />
          Emails will be sent as soon as it has finished!
        </>
      );
      break;
    case "loading":
      text = "Uploading and processing...";
      break;
    case "success":
      text = "Finished! The teams should have their scorecards shortly.";
      break;
    case "error":
      text = errorMessage;
      break;
  }

  return (
    <>
      <p className={styles.description}>{text}</p>
      {!status || status === "error" ? (
        <>
          <DatePickerContainer>
            <DatePicker onChange={setDate} value={date} />
          </DatePickerContainer>
          <ExcelDropzone onDrop={handleFileDrop} />
        </>
      ) : null}
    </>
  );
};

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Locked Down Trivia</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Locked Down Trivia Scorecard Processor</h1>
        {renderUploadSection()}
      </main>
    </div>
  );
}
