import React from 'react';

function Counter({ count, onIncrement }) {
  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment Count</button>
    </div>
  );
}

export default Counter;