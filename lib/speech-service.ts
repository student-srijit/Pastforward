// Get available voices
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices())
      }
    }
  })
}

// Speak with a voice appropriate for the historical era
export async function speakHistoricalPost(text: string, era: string): Promise<boolean> {
  try {
    if (!("speechSynthesis" in window)) {
      throw new Error("Speech synthesis not supported")
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const voices = await getAvailableVoices()

    // Choose a voice based on the era
    let voice: SpeechSynthesisVoice | undefined
    let rate = 1
    let pitch = 1

    if (era.includes("Ancient") || era.includes("Medieval")) {
      // Deep voice for ancient/medieval
      voice = voices.find((v) => v.name.includes("Male") && v.lang.startsWith("en"))
      rate = 0.8 // Slower for ancient
      pitch = 0.9 // Deeper for ancient
    } else if (era.includes("Renaissance")) {
      // British accent for Renaissance
      voice = voices.find((v) => v.lang === "en-GB")
      rate = 0.9
    } else if (era.includes("Victorian") || era.includes("Industrial")) {
      // British accent for Victorian/Industrial
      voice = voices.find((v) => v.lang === "en-GB")
      rate = 0.95
    } else if (era.includes("Modern")) {
      // Default voice for modern
      voice = voices.find((v) => v.lang.startsWith("en"))
      rate = 1.1 // Faster for modern
    } else {
      // Default voice
      voice = voices.find((v) => v.lang.startsWith("en"))
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text)

    // Set voice if found
    if (voice) utterance.voice = voice

    // Set other properties
    utterance.rate = rate
    utterance.pitch = pitch

    // Speak the text
    window.speechSynthesis.speak(utterance)

    return true
  } catch (error) {
    console.error("Error speaking text:", error)
    return false
  }
}
