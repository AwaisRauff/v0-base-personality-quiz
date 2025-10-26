"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const isPreviewEnvironment = () => {
    if (typeof window === "undefined") return false
    return window.location.hostname.includes("vusercontent.net") || window.location.hostname.includes("v0.app")
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      if (isPreviewEnvironment()) {
        setIsPreviewMode(true)
        setWalletAddress("0x1234...5678 (Demo Mode)")
        setTimeout(() => router.push("/quiz"), 500)
        return
      }

      if (!window.ethereum) {
        alert("Please install MetaMask or another Web3 wallet")
        setIsConnecting(false)
        return
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      // Switch to Base chain (8453)
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }], // 8453 in hex
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Chain not added, add it
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x2105",
                chainName: "Base",
                rpcUrls: ["https://mainnet.base.org"],
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://basescan.org"],
              },
            ],
          })
        }
      }

      setWalletAddress(accounts[0])
      // Navigate to quiz after successful connection
      setTimeout(() => router.push("/quiz"), 500)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      alert("Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Hero Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-5xl shadow-2xl">
            🎉
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Discover Your Base Onchain Personality!
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">
          Answer 8 quick questions about your onchain behavior and unlock your unique Base personality. Share your
          results and prove your status on the blockchain! 🚀
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">8</div>
            <div className="text-sm text-gray-400">Questions</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">5</div>
            <div className="text-sm text-gray-400">Personalities</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-400">2min</div>
            <div className="text-sm text-gray-400">Time</div>
          </div>
        </div>

        {/* Connect Wallet Button */}
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>🔗 {isPreviewMode ? "Start Quiz (Demo Mode)" : "Connect Wallet to Start"}</>
          )}
        </button>

        {walletAddress && (
          <p className="mt-4 text-sm text-gray-400">
            Connected: {walletAddress}
            {isPreviewMode && <span className="ml-2 text-yellow-400">(Preview Mode)</span>}
          </p>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500">Built on Base • Powered by Onchain Data • No backend required</p>
        </div>
      </div>
    </main>
  )
}

declare global {
  interface Window {
    ethereum?: any
  }
}
