import type { FC } from "react";
import Value from "./value";

const ValueContainer: FC = () => {
  return (
    <div>
      <h4>Число:</h4>
      <Value />
    </div>
  );
};

export default ValueContainer;
