import React, { useState } from 'react';

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

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
      </div>
    </div>
  );
};
