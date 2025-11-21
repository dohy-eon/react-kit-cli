import { ConfigFile } from '../types';

export const reduxDependencies = {
  '@reduxjs/toolkit': '^2.2.1',
  'react-redux': '^9.1.0',
};

export const reduxConfig: ConfigFile = {
  path: 'src/store/index.ts',
  content: `import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// reducer
import counterReducer from './features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 일반 useDispatch와 useSelector 대신 사용할 훅
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;`,
};

export const reduxSliceConfig: ConfigFile = {
  path: 'src/store/features/counter/counterSlice.ts',
  content: `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 카운터 상태 인터페이스
export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

// 초기 상태
const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

// 카운터 슬라이스 생성
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // 증가
    increment: (state) => {
      state.value += 1;
    },
    // 감소
    decrement: (state) => {
      state.value -= 1;
    },
    // 특정 값만큼 증가
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// 액션 생성자 내보내기
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// reducer 내보내기
export default counterSlice.reducer;`,
};

export const reduxAppConfig: ConfigFile = {
  path: 'src/App.tsx',
  content: `import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Counter } from './components/Counter';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <header>
          <h1>Redux 카운터 데모</h1>
        </header>
        <main>
          <Counter />
        </main>
      </div>
    </Provider>
  );
}

export default App;`,
};

export const reduxCounterConfig: ConfigFile = {
  path: 'src/components/Counter.tsx',
  content: `import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { increment, decrement, incrementByAmount } from '../store/features/counter/counterSlice';

export const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="counter">
      <h2>카운터</h2>
      <div className="counter-display">
        <span className="counter-value">{count}</span>
      </div>
      <div className="counter-buttons">
        <button onClick={() => dispatch(decrement())}>감소</button>
        <button onClick={() => dispatch(incrementByAmount(-count))}>리셋</button>
        <button onClick={() => dispatch(increment())}>증가</button>
        <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      </div>
    </div>
  );
};`,
};
