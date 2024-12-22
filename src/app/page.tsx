import { Message } from '@/components/message'

export default function Home() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
      <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-xl shadow-xl p-12 transform hover:scale-105 transition-all duration-300">
        <Message />
      </div>
    </div>
  )
}

