import { ConfigFile } from '../types';

export const zustandDependencies = {
  zustand: '^4.5.0',
};

// 스토어 파일 템플릿
export const zustandConfig: ConfigFile = {
  path: 'src/store/zustand/useCounterStore.ts',
  content: `import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  incrementBy: (amount: number) => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  incrementBy: (amount) => set((state) => ({ count: state.count + amount })),
  reset: () => set({ count: 0 }),
}));`,
};

// App.tsx 템플릿 (Provider가 필요 없음)
export const zustandAppConfig: ConfigFile = {
  path: 'src/App.tsx',
  content: `import React from 'react';
import { Counter } from './components/Counter';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Zustand 카운터 데모</h1>
      </header>
      <main>
        <Counter />
      </main>
    </div>
  );
}

export default App;`,
};

// Counter.tsx 템플릿
export const zustandCounterConfig: ConfigFile = {
  path: 'src/components/Counter.tsx',
  content: `import React from 'react';
import { useCounterStore } from '../store/zustand/useCounterStore';

export const Counter: React.FC = () => {
  const { count, increment, decrement, incrementBy, reset } = useCounterStore();

  return (
    <div className="counter">
      <h2>카운터</h2>
      <div className="counter-display">
        <span className="counter-value">{count}</span>
      </div>
      <div className="counter-buttons">
        <button onClick={decrement}>감소</button>
        <button onClick={reset}>리셋</button>
        <button onClick={increment}>증가</button>
        <button onClick={() => incrementBy(5)}>+5</button>
      </div>
    </div>
  );
};`,
};
