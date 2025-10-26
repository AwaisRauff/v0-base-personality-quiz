"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Loader2, ChevronRight } from "lucide-react"

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Your transaction count on Base?",
    options: [
      { text: "Less than 10", points: 1 },
      { text: "10-50 transactions", points: 3 },
      { text: "50+ transactions", points: 5 },
    ],
  },
  {
    id: 2,
    question: "Your favorite onchain action?",
    options: [
      { text: "Swapping tokens", points: 2 },
      { text: "Bridging assets", points: 1 },
      { text: "Minting NFTs", points: 4 },
    ],
  },
  {
    id: 3,
    question: "How often do you check gas prices?",
    options: [
      { text: "Every transaction", points: 5 },
      { text: "Sometimes", points: 3 },
      { text: "Never, YOLO", points: 1 },
    ],
  },
  {
    id: 4,
    question: "Your preferred DeFi protocol?",
    options: [
      { text: "Uniswap", points: 3 },
      { text: "Aave", points: 4 },
      { text: "I try them all", points: 5 },
    ],
  },
  {
    id: 5,
    question: "How much ETH do you typically hold?",
    options: [
      { text: "Less than 0.1 ETH", points: 1 },
      { text: "0.1 - 1 ETH", points: 3 },
      { text: "1+ ETH", points: 5 },
    ],
  },
  {
    id: 6,
    question: "Your trading strategy?",
    options: [
      { text: "Long-term hodler", points: 2 },
      { text: "Active trader", points: 4 },
      { text: "Yield farming", points: 3 },
    ],
  },
  {
    id: 7,
    question: "How do you feel about rugpulls?",
    options: [
      { text: "Terrified, I DYOR", points: 5 },
      { text: "Cautious but curious", points: 3 },
      { text: "Part of the game", points: 1 },
    ],
  },
  {
    id: 8,
    question: "Your ultimate onchain goal?",
    options: [
      { text: "Become a whale", points: 5 },
      { text: "Steady gains", points: 3 },
      { text: "Just exploring", points: 1 },
    ],
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnswer = (points: number) => {
    setSelectedAnswer(points)
  }

  const handleNext = async () => {
    if (selectedAnswer === null) return

    const newScores = [...scores, selectedAnswer]
    setScores(newScores)

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      // Quiz complete, go to results
      setIsLoading(true)
      const totalScore = newScores.reduce((a, b) => a + b, 0)
      setTimeout(() => {
        router.push(`/results?score=${totalScore}`)
      }, 500)
    }
  }

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100
  const question = QUIZ_QUESTIONS[currentQuestion]
  const totalScore = scores.reduce((a, b) => a + b, 0)

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Base Personality Quiz</h1>
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-8 text-white">{question.question}</h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedAnswer === option.points
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.points}
                  checked={selectedAnswer === option.points}
                  onChange={() => handleAnswer(option.points)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="ml-4 text-lg text-white">{option.text}</span>
              </label>
            ))}
          </div>

          {/* Score Display */}
          <div className="bg-white/5 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-400">Current Score</p>
            <p className="text-3xl font-bold text-purple-400">{totalScore} / 40</p>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading Results...
              </>
            ) : (
              <>
                {currentQuestion === QUIZ_QUESTIONS.length - 1 ? "See Results" : "Next Question"}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </Card>

        {/* Question Indicator */}
        <div className="flex gap-2 justify-center flex-wrap">
          {QUIZ_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index < currentQuestion ? "bg-purple-500" : index === currentQuestion ? "bg-blue-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
