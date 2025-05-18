import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          React + Tailwind
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <p className="text-gray-600 mb-6">
            카운터: {count}
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            클릭
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
