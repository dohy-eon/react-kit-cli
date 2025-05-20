import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Counter } from './components/Counter';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h1 className="text-3xl font-bold text-center mb-8">Redux 카운터 테스트</h1>
                  <Counter />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
