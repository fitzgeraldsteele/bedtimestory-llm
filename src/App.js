import React, { useState } from 'react';
import './styles.css';

const OPENAI_ENDPOINT = 'https://fsj-openai-test.openai.azure.com/openai/deployments/fisteele-gpt35-turbo/chat/completions?api-version=2023-03-15-preview';

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  async function callOpenAIEndpoint(name) {
    const systemMessage = `- You are a chatbot that can generate personalized bedtime stories for toddlers.
    - You ask the user for their name, age, favorite animal and color.
    - You also ask the user if they did something fun or interesting today. If they say yes, you ask them to tell you more about it. If they say no, you tell them that's okay and you will make up something fanciful and fun for them.
    - You also ask the user if they want to learn about a social-emotional skill in the story. If they say yes, you ask them to choose one from a list of five skills: self-awareness, self-regulation, social awareness, relationship skills, or responsible decision-making. If they say no, you randomly decide whether the story should emphasize a social-emotional skill, and which one.
    - You introduce a character called Butterfly Fairy who is a long time mentor, guide and friend for the user. She gives them a magical backpack that contains relics that help them learn and practice social-emotional skills. She also takes them to new lands where they can meet new creatures and people and get into situations where they have to use their skills to watch, learn, or help. She is always available when the user has questions, or appears when needed.
    - You use this information to create a short story with the user as the main hero who goes on an adventure that follows Campbell's Hero's Journey. The user's favorite animal is their sidekick who accompanies them on their journey.
    - You write the story in the style of a fairy tale, similar to Hans Christian Andersen or Grimm's Fairy Tales. You use elements of fantasy, magic, and moral lessons in your story. You also use elements of space travel in the solar system, such as rockets, planets, stars and aliens.
    - You use simple words, sentences and rhymes that are suitable for toddlers.
    - You end the story with a positive message and a good night wish.`;
    var userMessage = "The childs name is " + name + ".";

    let apiKey;
    if (process.env.NODE_ENV === 'production') {
      // Get API key from Azure Key Vault
      const response = await fetch('https://bedtimestory-kv.vault.azure.net/secrets/OPENAI-API-KEY?api-version=7.2', {
  
      });
  
      if (!response.ok) {
        throw new Error('Failed to retrieve API key from Azure Key Vault');
      }
  
      const { value } = await response.json();
      apiKey = value;
    } else {
      // Get API key from environment variable
      apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    }
  
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        "messages": [
          {
            "role": "system",
            "content": systemMessage
          },
          {
            "role": "user",
            "content": userMessage
          }
        ],
        "temperature": 0.5,
        "top_p": 0.95,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "max_tokens": 3704,
        "stop": null
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to call OpenAI endpoint: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const generatedText = await callOpenAIEndpoint(name);
    setMessage(generatedText);
  }

  function handleClear() {
    setMessage('');
  }

  return (
    <div className='container'>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={handleNameChange} required />
          </label>
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </form>
      </div>
      
      <div className='result'>
        {message && <p>{message}</p>}
      </div>
    </div>
      
    
  );
}

export default App;