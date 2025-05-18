import React, { useState } from 'react';

interface TestProps {
  name: string;
}

const Test: React.FC<TestProps> = ({ name }) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

export default Test;
