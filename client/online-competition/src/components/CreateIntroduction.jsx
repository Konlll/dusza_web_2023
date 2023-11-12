import React, { useState } from 'react';
import { FetchData } from "../custom_hooks/getUsers";
import { Form } from 'react-router-dom';
import '../styles/editIntroduction.css'

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
    <div className='edit-introduction'>
      <h1>Bemutatkozó oldal szerkesztése</h1>
      {!isIntroductionSubmitted && (
        <form method='POST' encType='multipart/form-data'>
          <textarea placeholder='Bemutatkozó szöveg' value={introductionText} onChange={handleTextChange} />
          <div className='filesUpload'>
            <label htmlFor='images'>Képek feltöltése:</label>
            <input type="file" id='images' name="files" accept="image/*" multiple onChange={handleImageUpload} />
          </div>
          <div className='filesUpload'>
            <label htmlFor='documents'>Dokumentumok feltöltése:</label>
            <input type="file" id='documents' accept=".pdf,.doc,.docx" name='files' multiple onChange={handleDocumentUpload} />
          </div>
          <button type='submit' onClick={handleSubmit}>Küldés</button>
        </form>
      )}
    </div>
  );
};

export default IntroPage;

