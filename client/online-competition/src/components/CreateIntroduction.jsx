import React, { useState } from 'react';
import {FetchData} from "../custom_hooks/getUsers";
import {Form} from 'react-router-dom';
const IntroPage = () => {
  const [introductionText, setIntroductionText] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isIntroductionSubmitted, setIsIntroductionSubmitted] = useState(false);

  const handleTextChange = (event) => {
      setIntroductionText(event.target.value);
    };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    setUploadedImages([...uploadedImages, ...files]);
  };

  const handleDocumentUpload = (event) => {
    const files = event.target.files;
    setUploadedDocuments([...uploadedDocuments, ...files]);
  };

  const handleSubmit = () => {
    
    setIsIntroductionSubmitted(true);
    let formData = new FormData();
    console.log(...uploadedImages);

      uploadedImages.forEach(image => 
          {
              formData.append("files", image);
          });
        formData.append("text", introductionText);
    FetchData("/api/intro/update","PUT",localStorage.getItem("access_token"), 
        {
            text : introductionText
            })
          .then(data => console.log(data));
  }
  return (
    <div>
      <h1>Üdvözöljük a Bemutatkozó Oldalon!</h1>
      {!isIntroductionSubmitted && (
        <form  method='POST' action='/intro/create' encType='multipart/form-data'>
           <label>
            Bemutatkozó szöveg:
            <textarea value={introductionText} onChange={handleTextChange} />
          </label>
          <br />
          <label>
            Képek feltöltése:
            <input type="file" name="files" accept="image/*" multiple onChange={handleImageUpload} />
          </label>
          <br />
          <label>
            Dokumentumok feltöltése:
            <input type="file" accept=".pdf,.doc,.docx" multiple onChange={handleDocumentUpload} />
          </label>
          <br />
          <button type='submit' onClick={handleSubmit}>Bemutatkozás elküldése</button>
        </form>
      )}
    </div>
  );
};

export default IntroPage;

