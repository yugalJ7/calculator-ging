import React from "react";
import { ACTION } from "./App";

export const OperationButton = ({ operation, dispatch }) => {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTION.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
};
