import React, { useState } from 'react';

export default function CreateNewFormPage() {
  const [formName, setFormName] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [buttonText, setButtonText] = useState('');
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form>
        <button type="submit">create new form</button>

        <label>Form Name</label>
        <input
          type="text"
          placeholder="Enter your form name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />

        <label>Button Theme</label>
        <div>
          <div>
            <label>Purple</label>
            <button>Next</button>
          </div>
          <div>
            <label>Black</label>
            <button>Next</button>
          </div>
          <div>
            <label>Pink</label>
            <button>Next</button>
          </div>
          <div>
            <label>Green</label>
            <button>Next</button>
          </div>
        </div>
        
        <label>Redirect url after user submits the form</label>
        <input
          type="text"
          placeholder="Form submit url"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
        />
        
        <label>Form Submit button text</label>
        <input
          type="text"
          placeholder="Form submit button text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
        />
      </form>
    </div>
  );
}
