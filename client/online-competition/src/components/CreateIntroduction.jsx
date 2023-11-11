import React, { useState } from 'react';

const IntroPage = () => {
  const [introductionText, setIntroductionText] = useState('');
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
    // Itt lehetne a beküldött adatokat továbbítani a szerver felé vagy lokalizáltan tárolni
    // Jelenleg csak az állapotok frissülnek
    setIsIntroductionSubmitted(true);
  };

  return (
    <div>
      <h1>Üdvözöljük a Bemutatkozó Oldalon!</h1>
      {!isIntroductionSubmitted && (
        <div>
          <label>
            Bemutatkozó szöveg:
            <textarea value={introductionText} onChange={handleTextChange} />
          </label>
          <br />
          <label>
            Képek feltöltése:
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          </label>
          <br />
          <label>
            Dokumentumok feltöltése:
            <input type="file" accept=".pdf,.doc,.docx" multiple onChange={handleDocumentUpload} />
          </label>
          <br />
          <button onClick={handleSubmit}>Bemutatkozás elküldése</button>
        </div>
      )}
      {isIntroductionSubmitted && (
        <div>
          <h2>Bemutatkozás Elküldve!</h2>
          <p>{introductionText}</p>
          <div>
            <h3>Feltöltött Képek:</h3>
            {uploadedImages.map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} />
            ))}
          </div>
          <div>
            <h3>Feltöltött Dokumentumok:</h3>
            {uploadedDocuments.map((document, index) => (
              <div key={index}>{document.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntroPage;

