import { ConfigFile } from '../types';

export const recoilDependencies = {
  recoil: '^0.7.7',
};

export const recoilConfig: ConfigFile = {
  path: 'src/store/recoil/index.ts',
  content: `import { atom, selector } from 'recoil';

export const counterState = atom({
  key: 'counterState',
  default: 0,
});

export const counterSelector = selector({
  key: 'counterSelector',
  get: ({ get }) => {
    const count = get(counterState);
    return {
      count,
      isPositive: count > 0,
      isNegative: count < 0,
    };
  },
});

// 비동기 selector 예제
export const asyncCounterSelector = selector({
  key: 'asyncCounterSelector',
  get: async ({ get }) => {
    const count = get(counterState);
    // API 호출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return count * 2;
  },
});`,
};

export const recoilMainConfig: ConfigFile = {
  path: 'src/main.tsx',
  content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);`,
};

export const recoilAppConfig: ConfigFile = {
  path: 'src/App.tsx',
  content: `import React from 'react';
import { Counter } from './components/Counter';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Recoil 카운터 데모</h1>
      </header>
      <main>
        <Counter />
      </main>
    </div>
  );
}

export default App;`,
};

export const recoilCounterConfig: ConfigFile = {
  path: 'src/components/Counter.tsx',
  content: `import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { counterState, counterSelector } from '../store/recoil';

export const Counter: React.FC = () => {
  const [count, setCount] = useRecoilState(counterState);
  const { isPositive, isNegative } = useRecoilValue(counterSelector);

  return (
    <div className="counter">
      <h2>카운터</h2>
      <div className="counter-display">
        <span className="counter-value">{count}</span>
      </div>
      <div className="counter-buttons">
        <button onClick={() => setCount(count - 1)}>감소</button>
        <button onClick={() => setCount(0)}>리셋</button>
        <button onClick={() => setCount(count + 1)}>증가</button>
        <button onClick={() => setCount(count + 5)}>+5</button>
      </div>
      <div className="counter-status">
        {isPositive && <span>양수</span>}
        {isNegative && <span>음수</span>}
        {count === 0 && <span>초기값</span>}
      </div>
    </div>
  );
};`,
};
