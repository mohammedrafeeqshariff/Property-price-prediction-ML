import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AiChatBot = () => {
  const [question, setQuestion] = useState("");
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(false);
  const convosEndRef = useRef(null);

  const scrollToBottom = () => {
    convosEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [convos]);

  const generateAnswer = async () => {
    if (!question.trim()) return;  // prevents empty questions
    setLoading(true);
    try {
      let convo = {
        question,
        answer: {
          isLoading: true,
          data: ""
        }
      };
      setConvos(prev => [...prev, convo]);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_GOOGLE_CHAT_BOT_API}`,
        {
          contents: [
            {
              parts: [
                { "text": question }
              ]
            }
          ]
        }
      );

      const text = response.data.candidates[0].content.parts[0].text;
      const formattedText = text.split('**').map((part, index) => 
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
      );

      setConvos(prevConvos => {
        const newConvos = [...prevConvos];
        newConvos[newConvos.length - 1].answer = {
          isLoading: false,
          data: formattedText
        };
        return newConvos;
      });

    } catch (error) {
      console.log(error);
      setConvos(prevConvos => {
        const newConvos = [...prevConvos];
        newConvos[newConvos.length - 1].answer = {
          isLoading: false,
          data: "An error occurred. Please try again."
        };
        return newConvos;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      generateAnswer();
      setQuestion("")
    }
  };

  return (
    <div className="flex flex-col items-center p-6 w-full bg-gray-100 dark:bg-gray-900 min-h-screen text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Hello, Welcome to AI Chat</h1>
      <div className="w-full max-w-screen-lg space-y-4 mx-auto" style={{ margin: "0 10%", width: "60%" }}>
        {
          convos.map(
            (convo, index) => (
              <div key={index} className="flex flex-col w-full space-y-4">
                <div className="chat chat-start">
                  <div className="chat-bubble max-w-3/4 bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-lg break-words">
                    {convo.question}
                  </div>
                </div>
                <div className="chat chat-end">
                  <div className="chat-bubble bg-blue-500 dark:bg-blue-600 text-white p-4 rounded-lg break-words">
                    {
                      convo.answer.isLoading ?
                      <span className="loading loading-dots loading-xs"></span>
                      : <p>{convo.answer.data}</p>
                    }
                  </div>
                </div>
              </div>
            )
          )
        }
        <div ref={convosEndRef} />
      </div>
      <div className="w-full max-w-md mt-4">
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          onKeyDown={handleKeyDown}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white leading-loose tracking-wide"
          placeholder="Ask me anything..."
        />
        <div 
          className="btn bg-primary text-white w-full py-2 mb-6 cursor-pointer text-center rounded"
          onClick={generateAnswer}
        >
          Generate
        </div>
      </div>
    </div>
  );
}

export default AiChatBot;
