import type { FC } from "react";
import { decrementCount, incrementCount } from "../store/use-counter-store";

const ButtonsContainer: FC = () => {
  return (
    <div className="card">
      <button onClick={incrementCount()}>Увеличить число</button>
      <button onClick={decrementCount()}>Уменьшить число</button>
    </div>
  );
};

export default ButtonsContainer;
