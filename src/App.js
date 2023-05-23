import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [definitions, setDefinitions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    fetchDefinitions();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchDefinitions();
    }
  };

  const fetchDefinitions = () => {
    if (!inputValue) {
      setErrorMessage('Please enter a word.');
      setDefinitions([]);
      return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDefinitions(data);
          setErrorMessage('');
        } else {
          setDefinitions([]);
          setErrorMessage('No Definitions Found');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setDefinitions([]);
        setErrorMessage('An error occurred. Please try again later.');
      });
  };

  return (
    <div className="App">
      <h1>Dictionary App</h1>
      <div className="search-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter a word"
        />
        <button onClick={handleButtonClick}>Search</button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {definitions.length > 0 && (
        <div>
          <h2>{definitions[0].word}</h2>
          {definitions[0].phonetic && (
            <p className="phonetic">{definitions[0].phonetic}</p>
          )}
          {definitions[0].meanings.map((meaning, index) => (
            <div key={index} className="meaning">
              <h3>{meaning.partOfSpeech}</h3>
              {meaning.definitions.map((definition, index) => (
                <p key={index}>{definition.definition}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
