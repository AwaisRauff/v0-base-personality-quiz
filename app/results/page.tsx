"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Loader2, Share2, Zap } from "lucide-react"
import Confetti from "react-confetti"

const PERSONALITIES = [
  {
    range: [0, 10],
    name: "Shadow Holder",
    emoji: "🥷",
    description:
      "Stealthy & patient. You prefer to observe the market before making moves. A true believer in long-term strategy.",
    color: "from-slate-600 to-slate-800",
  },
  {
    range: [11, 20],
    emoji: "🧭",
    name: "Explorer",
    description:
      "Curious wanderer. You love discovering new protocols and opportunities. Always learning, always exploring.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    range: [21, 30],
    emoji: "🔥",
    name: "Gas Guzzler",
    description: "High-energy trader. You're constantly active on Base, executing trades and chasing opportunities.",
    color: "from-orange-500 to-red-600",
  },
  {
    range: [31, 35],
    emoji: "🏦",
    name: "DeFi Dabbler",
    description:
      "Protocol pro. You understand the intricacies of DeFi and navigate multiple protocols with confidence.",
    color: "from-green-500 to-emerald-600",
  },
  {
    range: [36, 40],
    emoji: "🐋",
    name: "Whale Warrior",
    description: "Chain dominator. You're a major player on Base, commanding significant capital and influence.",
    color: "from-purple-600 to-pink-600",
  },
]

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const [personality, setPersonality] = useState<(typeof PERSONALITIES)[0] | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Find personality based on score
    const found = PERSONALITIES.find((p) => score >= p.range[0] && score <= p.range[1])
    setPersonality(found || PERSONALITIES[0])

    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [score])

  const handleMintAndShare = async () => {
    setIsSending(true)
    try {
      if (!window.ethereum) {
        alert("Please connect your wallet first")
        setIsSending(false)
        return
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      })

      if (!accounts || accounts.length === 0) {
        alert("Please connect your wallet first")
        setIsSending(false)
        return
      }

      // Send 0.00001 ETH
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: "0x0000000000000000000000000000000000000000", // Burn address
            value: "0x2386f26fc10000", // 0.00001 ETH in wei
            gas: "0x5208", // 21000 gas
          },
        ],
      })

      alert(`Transaction sent! Hash: ${txHash}`)

      // Share to clipboard
      const shareText = `I'm a ${personality?.name} ${personality?.emoji} on Base! Score: ${score}/40. Discover your personality: ${window.location.origin}`
      navigator.clipboard.writeText(shareText)
      alert("Share text copied to clipboard!")
    } catch (error) {
      console.error("Error:", error)
      alert("Transaction failed or was cancelled")
    } finally {
      setIsSending(false)
    }
  }

  if (!personality) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
      )}

      <div className="max-w-2xl w-full">
        {/* Results Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Quiz Complete! 🎊</h1>
          <p className="text-gray-400">Here's your onchain personality</p>
        </div>

        {/* Personality Card */}
        <Card className={`bg-gradient-to-br ${personality.color} border-0 p-8 mb-8 shadow-2xl`}>
          <div className="text-center">
            {/* Emoji */}
            <div className="text-8xl mb-4">{personality.emoji}</div>

            {/* Name */}
            <h2 className="text-4xl font-bold text-white mb-2">{personality.name}</h2>

            {/* Score */}
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-6 inline-block">
              <p className="text-sm text-white/80">Your Score</p>
              <p className="text-5xl font-bold text-white">{score}/40</p>
            </div>

            {/* Description */}
            <p className="text-lg text-white/90 max-w-md mx-auto mb-8">{personality.description}</p>

            {/* Personality GIF Placeholder */}
            <div className="bg-white/10 backdrop-blur rounded-lg p-8 mb-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">{personality.emoji}</div>
                <p className="text-white/60">Your personality visualization</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Score Breakdown */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {PERSONALITIES.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="text-white">{p.name}</span>
                </div>
                <span className="text-sm text-gray-400">
                  {p.range[0]}-{p.range[1]} pts
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleMintAndShare}
            disabled={isSending}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Mint & Share (0.00001 ETH)
              </>
            )}
          </button>

          <button
            onClick={() => router.push("/")}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Take Again
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Share your personality and challenge your friends! 🚀</p>
        </div>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}

declare global {
  interface Window {
    ethereum?: any
  }
}
