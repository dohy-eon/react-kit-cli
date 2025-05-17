import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">테일윈드 CSS 테스트</h1>
          <p className="mt-2 text-gray-600">테일윈드 CSS가 정상적으로 적용되었습니다.</p>
          <div className="mt-4">
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600"
              onClick={() => setCount((count) => count + 1)}
            >
              카운트: {count}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App 