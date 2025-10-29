// src/components/GeminiResponse.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Summary.css';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function Summary() {
  const [planData, setPlanData] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioRef] = useState(new Audio());
  const user = auth.currentUser;
  const { planId } = useParams(); // Get planId from route params

  // Function to create a structured prompt from the plan data
  const createAIPrompt = (data) => {
    if (!data) return '';

    const responsesSummary = data.responses.map(r => 
      `- ${r.name}: ${r.response}
        Notes: "${r.notes || 'No additional notes provided'}"
      `
    ).join('\n');

    const prompt = `
Please analyze this travel plan and provide travel recommendations based on the location:

PLAN DETAILS:
Name: ${data.plan.planName}
Location: ${data.plan.location || 'Not specified'}
Budget: ${data.plan.budget ? `$${data.plan.budget}` : 'Not specified'}
Dates: ${data.plan.dates || 'Not specified'}
Description: ${data.plan.description || 'Not provided'}

RESPONSE STATISTICS:
- Total Invited: ${data.plan.invitedCount}
- Total Responses: ${data.stats.totalResponses}
- Going: ${data.stats.going}
- Maybe: ${data.stats.maybe}
- Not Going: ${data.stats.notGoing}
- Response Rate: ${data.stats.responseRate.toFixed(1)}%

INDIVIDUAL RESPONSES AND NOTES:
${responsesSummary}

Please consider all individual responses and their notes carefully in your analysis.

Based on this information, please provide:
1. A summary of the current plan status
2. Recommendations for improving the plan
3. Potential scheduling or budget adjustments based on responses
4. Recommendations for activities suitable for the location and interests expressed in the notes

Do so in a clear and concise manner. Friendly but professional. Keep emojis to a minimum. Please write in markdown format.
Avoid the use of special characters like # or *. Make the response no more than 350 words
`;

    return prompt.trim();
  };

  useEffect(() => {
    const fetchPlanAndResponses = async () => {
      if (!planId || !user) {
        setError('Missing plan ID or user not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        const planRef = doc(db, 'users', user.uid, 'plans', planId);
        const planDoc = await getDoc(planRef);

        if (!planDoc.exists()) {
          setError('Plan not found');
          setIsLoading(false);
          return;
        }

        // Get plan data
        const plan = {
          id: planDoc.id,
          ...planDoc.data()
        };

        // Get all responses for this plan
        const responsesRef = collection(db, 'users', user.uid, 'plans', planId, 'responses');
        const responsesSnapshot = await getDocs(responsesRef);
        const responses = responsesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Fetched responses:', responses); // Debug log

        // Combine plan and responses data
        const combinedData = {
          plan: {
            id: plan.id,
            planName: plan.planName,
            location: plan.location,
            budget: plan.budget,
            dates: plan.dates,
            description: plan.description,
            createdAt: plan.createdAt,
            createdBy: plan.createdBy,
            invitedCount: plan.invitedCount || 0
          },
          responses: responses,
          stats: {
            totalResponses: responses.length,
            going: responses.filter(r => r.response && r.response.toLowerCase() === 'going').length,
            maybe: responses.filter(r => r.response && r.response.toLowerCase() === 'maybe').length,
            notGoing: responses.filter(r => r.response && r.response.toLowerCase() === 'cant-go').length,
            responseRate: (responses.length / (plan.invitedCount || 1)) * 20
          }
        };

        // Debug logs
        console.log('Plan data:', plan);
        console.log('Stats:', combinedData.stats);
        console.log('Response counts:', {
          total: responses.length,
          going: responses.filter(r => r.response && r.response.toLowerCase() === 'going').length,
          maybe: responses.filter(r => r.response && r.response.toLowerCase() === 'maybe').length,
          notGoing: responses.filter(r => r.response && r.response.toLowerCase() === 'cant-go').length,
        });

        setPlanData(combinedData);
        // Generate and set the AI prompt
        const prompt = createAIPrompt(combinedData);
        setAiPrompt(prompt);
        console.log('AI Prompt generated:', prompt); // For debugging
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching plan data:', err);
        setError('Failed to load plan data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPlanAndResponses();
  }, [planId, user]);





    

  // Function to handle generating AI response using Gemini API
  const handleGenerate = async () => {
    if (!aiPrompt || isGenerating) return; // Prevent empty or multiple requests

    setIsGenerating(true);
    setStreamingResponse(''); // Clear previous response
    setError(null); // Clear any previous errors

    // Check if API key is available
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      console.warn('No API key found, falling back to simulation mode');
      handleGenerateFallback();
      return;
    }

    try {
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

      // Start a chat session
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });

      // Send the prompt and get streaming response
      const result = await chat.sendMessageStream(aiPrompt);

      // Process the streaming response
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setStreamingResponse(prev => prev + chunkText);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setError(error.message || 'Failed to generate AI response. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback function for development/testing without API key
  // Function to handle text-to-speech conversion
  const handleTextToSpeech = async (text) => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      setError('ElevenLabs API key not found. Unable to generate speech.');
      return;
    }

    try {
      // Stop any currently playing audio
      audioRef.pause();
      setIsPlaying(false);

      // Voice ID for "Josh"
      const voiceId = 'yoZ06aMxZJJ28mfd3POQ';

      // Call ElevenLabs API directly
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      // Get the audio data as a blob
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);

      // Update audio source and play
      setAudioURL(url);
      audioRef.src = url;
      audioRef.addEventListener('ended', () => setIsPlaying(false));
      await audioRef.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error generating speech:', error);
      setError('Failed to generate speech. Please try again.');
    }
  };

  // Function to toggle audio playback
  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    } else if (audioURL) {
      audioRef.play();
      setIsPlaying(true);
    }
  };

  const handleGenerateFallback = () => {
    if (!aiPrompt || isGenerating) return;

    setIsGenerating(true);
    setStreamingResponse('');
    setError(null);

    // Fallback response for testing
    const fallbackResponse = `Based on the plan details and responses, here's my analysis:

1. Current Plan Status:
   - Strong interest with ${planData.stats.going} confirmed attendees
   - ${planData.stats.maybe} potential additional participants
   - Overall positive response rate at ${planData.stats.responseRate.toFixed(1)}%

2. Suggestions for "Maybe" Responses:
   - Consider flexible payment options
   - Provide alternative dates if possible
   - Share more detailed itinerary

3. Plan Improvements:
   - Create a shared expense tracking system
   - Establish a communication channel for updates
   - Consider group transportation options

4. Adjustments Based on Responses:
   - Look into group discounts for activities
   - Consider splitting into smaller groups for certain activities
   - Create a flexible schedule to accommodate different arrival times

5. Next Steps:
   - Send detailed itinerary to confirmed participants
   - Set up a group chat for coordination
   - Begin collecting deposits if applicable
   - Schedule a virtual meetup for planning details`;

    const words = fallbackResponse.split(' ');
    let currentWordIndex = 0;

    const intervalId = setInterval(() => {
      if (currentWordIndex < words.length) {
        setStreamingResponse(prev => prev + (currentWordIndex > 0 ? ' ' : '') + words[currentWordIndex]);
        currentWordIndex++;
      } else {
        clearInterval(intervalId);
        setIsGenerating(false);
      }
    }, 50);
  };

  return (
    <div className="gemini-page">
      <div className="gemini-container">
        <h1>AI Generated Summary</h1>
        <div className="response-area">
          {isLoading && (
            <div className="loading-state">
              <h3>Loading plan data...</h3>
              <span className="cursor"></span>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}
          
          {!isLoading && !error && planData && (
            <>
              <h3>Plan Summary: {planData.plan.planName}</h3>
              <div className="response-output">
                <div className="stats-section">
                  <p>Total Responses: {planData.stats.totalResponses} out of 5</p>
                  <p>Going: {planData.stats.going}</p>
                  <p>Maybe: {planData.stats.maybe}</p>
                  <p>Not Going: {planData.stats.notGoing}</p>
                  <p>Response Rate: {planData.stats.responseRate.toFixed(1)}%</p>
                </div>
                <div className="prompt-section">
                  <h4>Generated AI Prompt:</h4>
                  <pre className="ai-prompt">
                    {aiPrompt}
                  </pre>
                  <button 
                    className="generate-button" 
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiPrompt}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Analysis'}
                  </button>
                </div>
                {streamingResponse && (
                  <div className="response-section">
                    <div className="response-header">
                      <h4>AI Analysis:</h4>
                      <div className="audio-controls">
                        {!audioURL && !isGenerating && (
                          <button
                            className="audio-button"
                            onClick={() => handleTextToSpeech(streamingResponse)}
                            title="Generate speech"
                          >
                            🔊 Listen
                          </button>
                        )}
                        {audioURL && (
                          <button
                            className="audio-button"
                            onClick={toggleAudio}
                            title={isPlaying ? 'Pause' : 'Play'}
                          >
                            {isPlaying ? '⏸️' : '▶️'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={`response-text ${isGenerating ? 'typing' : ''}`}>
                      {streamingResponse}
                      {isGenerating && <span className="cursor" />}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Summary;