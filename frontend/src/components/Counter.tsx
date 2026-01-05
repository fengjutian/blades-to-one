import React, { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <button 
      onClick={() => setCount(count + 1)}
      type="button"
    >
      count is {count}
    </button>
  );
};

export default Counter;