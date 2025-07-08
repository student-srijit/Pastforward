"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type HistoricalContextProps = {
  era: string
  location?: string
}

export function HistoricalContext({ era, location }: HistoricalContextProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Extract era name without dates
  const eraParts = era?.split("(") || []
  const eraName = eraParts[0]?.trim() || ""

  const contextData: Record<string, { description: string; keyEvents: string[]; learnMoreUrl: string }> = {
    "Ancient Egypt": {
      description:
        "Ancient Egypt was a civilization in Northeast Africa concentrated along the lower Nile River. For almost 30 centuries—from its unification around 3100 B.C. to its conquest by Alexander the Great in 332 B.C.—ancient Egypt was the preeminent civilization in the Mediterranean world.",
      keyEvents: [
        "3100 BCE: Unification of Upper and Lower Egypt",
        "2630-2611 BCE: Construction of the Great Pyramid of Giza",
        "1332-1323 BCE: Reign of Tutankhamun",
        "30 BCE: Death of Cleopatra VII, end of the Ptolemaic Dynasty",
      ],
      learnMoreUrl: "https://en.wikipedia.org/wiki/Ancient_Egypt",
    },
    "Roman Empire": {
      description:
        "The Roman Empire was the post-Republican period of ancient Rome, with a government headed by emperors and large territorial holdings around the Mediterranean Sea in Europe, Africa, and Asia.",
      keyEvents: [
        "27 BCE: Octavian becomes Augustus, first Emperor of Rome",
        "64 CE: Great Fire of Rome during Nero's reign",
        "80 CE: Completion of the Colosseum",
        "395 CE: Division into Western and Eastern Roman Empires",
        "476 CE: Fall of the Western Roman Empire",
      ],
      learnMoreUrl: "https://en.wikipedia.org/wiki/Roman_Empire",
    },
    "Medieval Europe": {
      description:
        "The Middle Ages, or Medieval Period, spanned from the 5th to the late 15th century. It began with the fall of the Western Roman Empire and merged into the Renaissance and the Age of Discovery.",
      keyEvents: [
        "476 CE: Fall of the Western Roman Empire",
        "800 CE: Charlemagne crowned Emperor of the Romans",
        "1066 CE: Norman Conquest of England",
        "1347-1351 CE: Black Death pandemic",
        "1453 CE: Fall of Constantinople",
      ],
      learnMoreUrl: "https://en.wikipedia.org/wiki/Middle_Ages",
    },
    Renaissance: {
      description:
        "The Renaissance was a period of European cultural, artistic, political, and scientific rebirth after the Middle Ages. Beginning in Florence, Italy, it spread across Europe and marked the transition from the medieval world to modernity.",
      keyEvents: [
        "1397: Giovanni de Medici founds the Medici Bank in Florence",
        "1450s: Gutenberg develops the printing press",
        "1503-1506: Leonardo da Vinci paints the Mona Lisa",
        "1508-1512: Michelangelo paints the Sistine Chapel ceiling",
        "1543: Copernicus publishes heliocentric theory",
      ],
      learnMoreUrl: "https://en.wikipedia.org/wiki/Renaissance",
    },
    "Industrial Revolution": {
      description:
        "The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, in the period from about 1760 to 1820-1840. This transition included going from hand production methods to machines.",
      keyEvents: [
        "1712: Thomas Newcomen builds the first commercially successful steam engine",
        "1764: James Hargreaves invents the spinning jenny",
        "1781: James Watt patents the steam engine",
        "1793: Eli Whitney invents the cotton gin",
        "1830: Opening of the Liverpool and Manchester Railway",
      ],
      learnMoreUrl: "https://en.wikipedia.org/wiki/Industrial_Revolution",
    },
    "Indian Independence Movement": {
      description:
        "The Indian independence movement was a series of historic events with the ultimate aim of ending British rule in India. The movement spanned from the mid-1850s to India's independence on August 15, 1947.",
      keyEvents: [
        "1857: Indian Rebellion, also known as the First War of Independence",
        "1885: Formation of the Indian National Congress",
        "1919: Jallianwala Bagh massacre",
        "1930: Salt March led by Mahatma Gandhi",
        "1947: Independence and Partition of India",
      ],
      learnMoreUrl: "https://en.wikipedia.org/wiki/Indian_independence_movement",
    },
  }

  const defaultContext = {
    description: `${eraName} was a significant period in history with unique cultural, social, and political characteristics.`,
    keyEvents: ["Various significant events occurred during this period."],
    learnMoreUrl: `https://en.wikipedia.org/wiki/${eraName.replace(/\s+/g, "_")}`,
  }

  const context = contextData[eraName] || defaultContext

  return (
    <div className="relative">
      <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs" onClick={() => setIsOpen(true)}>
        <Info className="h-3 w-3" />
        Historical Context
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 mt-2 w-80 md:w-96 p-4 rounded-lg shadow-lg",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              "right-0 md:left-0",
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{eraName}</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {location && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Location: {location}</p>}

            <p className="text-sm mb-3">{context.description}</p>

            <div className="mb-3">
              <h4 className="font-medium text-sm mb-1">Key Events:</h4>
              <ul className="text-xs space-y-1 list-disc pl-4">
                {context.keyEvents.map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            </div>

            <a
              href={context.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 text-timeline-600 hover:text-timeline-700"
            >
              Learn more <ExternalLink className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
