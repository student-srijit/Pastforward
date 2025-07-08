/**
 * Free API Alternatives for PastForward
 *
 * This file contains information about free alternatives to paid APIs
 * that can be used in the PastForward project.
 */

/**
 * Free Alternatives to OpenAI API
 */
export const freeImageGenerationApis = [
  {
    name: "Stable Diffusion API",
    description: "Free and open-source image generation model that can be self-hosted",
    website: "https://github.com/Stability-AI/stablediffusion",
    implementation: `
    // Example using Replicate's hosted Stable Diffusion (free tier available)
    async function generateImage(prompt) {
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Token \${process.env.REPLICATE_API_TOKEN}\`,
        },
        body: JSON.stringify({
          version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
          input: { prompt: prompt },
        }),
      });
      
      const prediction = await response.json();
      return prediction;
    }
    `,
  },
  {
    name: "Hugging Face Inference API",
    description: "Free tier available for various AI models including image generation",
    website: "https://huggingface.co/inference-api",
    implementation: `
    // Example using Hugging Face's free inference API
    async function generateImage(prompt) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: \`Bearer \${process.env.HUGGINGFACE_API_KEY}\`,
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      
      // The response is the image binary
      const imageBlob = await response.blob();
      return URL.createObjectURL(imageBlob);
    }
    `,
  },
  {
    name: "Stability AI",
    description: "Offers a free tier with limited usage",
    website: "https://stability.ai/",
    implementation: `
    // Example using Stability AI's API (free tier available)
    async function generateImage(prompt) {
      const engineId = "stable-diffusion-v1-5";
      const apiHost = "https://api.stability.ai";
      
      const response = await fetch(
        \`\${apiHost}/v1/generation/\${engineId}/text-to-image\`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: \`Bearer \${process.env.STABILITY_API_KEY}\`,
          },
          body: JSON.stringify({
            text_prompts: [{ text: prompt }],
            cfg_scale: 7,
            height: 512,
            width: 512,
            samples: 1,
            steps: 30,
          }),
        }
      );
      
      const responseJSON = await response.json();
      return responseJSON.artifacts[0].base64;
    }
    `,
  },
]

/**
 * Free Alternatives to ElevenLabs API
 */
export const freeTtsApis = [
  {
    name: "Web Speech API",
    description: "Built into modern browsers, completely free",
    website: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API",
    implementation: `
    // Example using the Web Speech API (client-side only)
    function speakText(text, voice = null, rate = 1, pitch = 1) {
      return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
          reject(new Error('Speech synthesis not supported'));
          return;
        }
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice if provided
        if (voice) {
          const voices = window.speechSynthesis.getVoices();
          const selectedVoice = voices.find(v => v.name === voice);
          if (selectedVoice) utterance.voice = selectedVoice;
        }
        
        // Set other properties
        utterance.rate = rate;
        utterance.pitch = pitch;
        
        // Handle events
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(\`Speech synthesis error: \${event.error}\`));
        
        // Speak
        window.speechSynthesis.speak(utterance);
      });
    }
    
    // Get available voices
    function getAvailableVoices() {
      return new Promise((resolve) => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve(voices);
        } else {
          window.speechSynthesis.onvoiceschanged = () => {
            resolve(window.speechSynthesis.getVoices());
          };
        }
      });
    }
    `,
  },
  {
    name: "Google Cloud Text-to-Speech",
    description: "Free tier includes 4 million characters per month",
    website: "https://cloud.google.com/text-to-speech",
    implementation: `
    // Example using Google Cloud Text-to-Speech (free tier available)
    // Requires @google-cloud/text-to-speech package
    
    import textToSpeech from '@google-cloud/text-to-speech';
    
    async function generateSpeech(text, voiceName = 'en-US-Standard-D', languageCode = 'en-US') {
      // Creates a client
      const client = new textToSpeech.TextToSpeechClient();
    
      // Construct the request
      const request = {
        input: { text: text },
        // Select the language and voice
        voice: { languageCode: languageCode, name: voiceName },
        // Select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
      };
    
      // Performs the text-to-speech request
      const [response] = await client.synthesizeSpeech(request);
      return response.audioContent;
    }
    `,
  },
  {
    name: "Mozilla TTS",
    description: "Open-source TTS system that can be self-hosted for free",
    website: "https://github.com/mozilla/TTS",
    implementation: `
    // Example using a self-hosted Mozilla TTS server
    async function generateSpeech(text, speaker_id = null) {
      const url = new URL('http://your-mozilla-tts-server:5002/api/tts');
      
      const params = {
        text: text,
      };
      
      if (speaker_id) {
        params.speaker_id = speaker_id;
      }
      
      url.search = new URLSearchParams(params).toString();
      
      const response = await fetch(url);
      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    }
    `,
  },
]

/**
 * Free AI Text Generation Alternatives
 */
export const freeTextGenerationApis = [
  {
    name: "Hugging Face Inference API",
    description: "Free tier available for various AI models including text generation",
    website: "https://huggingface.co/inference-api",
    implementation: `
    // Example using Hugging Face's free inference API with a large language model
    async function generateText(prompt) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-xxl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: \`Bearer \${process.env.HUGGINGFACE_API_KEY}\`,
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      
      const result = await response.json();
      return result[0].generated_text;
    }
    `,
  },
  {
    name: "Ollama",
    description: "Run large language models locally for free",
    website: "https://ollama.ai/",
    implementation: `
    // Example using Ollama (self-hosted, completely free)
    async function generateText(prompt, model = "llama2") {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false,
        }),
      });
      
      const result = await response.json();
      return result.response;
    }
    `,
  },
  {
    name: "Gemini API",
    description: "Google's Gemini API offers a free tier with generous limits",
    website: "https://ai.google.dev/",
    implementation: `
    // Example using Google's Gemini API (free tier available)
    import { GoogleGenerativeAI } from "@google/generative-ai";

    async function generateText(prompt) {
      // Initialize the Gemini API with your API key
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      // For text-only input, use the gemini-pro model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    }
    `,
  },
]

/**
 * Implementation example for PastForward using free APIs
 */
export const pastForwardImplementation = `
// Example implementation for PastForward using free APIs

// 1. For text generation (historical posts)
import { GoogleGenerativeAI } from "@google/generative-ai";

async function generateHistoricalPost(params) {
  const { era, location, characterType, platform, customPrompt, creativity } = params;
  
  // Create a prompt for the AI
  const prompt = \`Create a \${platform} post for a \${characterType} from \${era} in \${location}.
  \${customPrompt ? \`Additional context: \${customPrompt}\` : ""}
  
  The post should be historically accurate but presented in a social media format with appropriate hashtags.
  Use language appropriate to the era but understandable to modern readers.
  Include relevant historical details and context.
  Create hashtags that blend historical terminology with modern social media conventions.
  The tone should match both the character type and the historical context.
  Creativity level: \${creativity}% (higher means more creative liberty, lower means stricter historical accuracy).
  Platform: \${platform} (adapt the content to fit this platform's style).
  
  Return the result as a JSON object.\`;
  
  try {
    // Initialize the Gemini API with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Parse the JSON response
    const text = response.text();
    const jsonMatch = text.match(/({.*})/s);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse JSON from response");
    }
  } catch (error) {
    console.error("Error generating post with AI:", error);
    return mockGeneratePost(params); // Fallback to mock implementation
  }
}

// 2. For image generation (optional feature)
async function generateHistoricalImage(prompt, era) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Bearer \${process.env.HUGGINGFACE_API_KEY}\`,
        },
        body: JSON.stringify({
          inputs: \`A historical image from \${era}: \${prompt}\`,
        }),
      }
    );
    
    // The response is the image binary
    const imageBlob = await response.blob();
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error("Error generating image:", error);
    return "/placeholder.svg?height=400&width=400"; // Fallback to placeholder
  }
}

// 3. For text-to-speech (historical voices)
function speakHistoricalPost(text, era) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select appropriate voice based on era
    getAvailableVoices().then(voices => {
      // Choose a voice based on the era (this is simplified)
      let voice;
      
      if (era.includes("Ancient") || era.includes("Medieval")) {
        // Deep voice for ancient/medieval
        voice = voices.find(v => v.name.includes("Male") && v.lang.startsWith("en"));
      } else if (era.includes("Renaissance")) {
        // British accent for Renaissance
        voice = voices.find(v => v.lang === "en-GB");
      } else {
        // Default voice
        voice = voices.find(v => v.lang.startsWith("en"));
      }
      
      if (voice) utterance.voice = voice;
      
      // Adjust rate and pitch based on era
      if (era.includes("Ancient")) {
        utterance.rate = 0.8; // Slower for ancient
        utterance.pitch = 0.9; // Deeper for ancient
      } else if (era.includes("Modern")) {
        utterance.rate = 1.1; // Faster for modern
      }
      
      // Handle events
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(\`Speech synthesis error: \${event.error}\`));
      
      // Speak
      window.speechSynthesis.speak(utterance);
    });
  });
}

// Get available voices
function getAvailableVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
}
`
