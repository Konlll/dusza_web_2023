import React, { useState } from 'react';
import { FetchData } from "../custom_hooks/getUsers";
import { Form } from 'react-router-dom';
import '../styles/editIntroduction.css'

const IntroPage = () => {
  const [introductionText, setIntroductionText] = useState("");
  const [isIntroductionSubmitted, setIsIntroductionSubmitted] = useState(false);

  const handleTextChange = (event) => {
    setIntroductionText(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    setIsIntroductionSubmitted(true);
    let formData = new FormData();
    formData.append("text", introductionText);
    FetchData("/api/intro/update", "PUT", localStorage.getItem("access_token"),
      {
        text: introductionText
      })
      .then(data => console.log(data));
      location.reload()
  }
  return (
    <div className='edit-introduction'>
      <h1>Bemutatkozó oldal szerkesztése</h1>
      {!isIntroductionSubmitted && (
        <form method='POST' encType='multipart/form-data'>
          <textarea placeholder='Bemutatkozó szöveg' value={introductionText} onChange={handleTextChange} />
          <button type='submit' onClick={(e) => handleSubmit(e)}>Küldés</button>
        </form>
      )}
    </div>
  );
};

export default IntroPage;

