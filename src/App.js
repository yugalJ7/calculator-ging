import { useReducer } from "react";
import "./style.css";
import { DigitButton } from "./DigitButton";
import { OperationButton } from "./OperationButton";

export const ACTION = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          currentOperand: action.payload.digit,
          overwrite: false,
        };
      }
      if (action.payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (action.payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      };
    case ACTION.CLEAR:
      return {};
    case ACTION.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: null,
      };
    case ACTION.EVALUATE:
      // console.log(action.payload.operation);
      console.log(state.currentOperand);
      console.log(state.previousOperand);
      console.log(state);
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
      };
    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
};

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  // convert string into numbers
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let calculation = "";
  switch (operation) {
    case "+":
      calculation = prev + current;
      break;
    case "-":
      calculation = prev - current;
      break;
    case "*":
      calculation = prev * current;
      break;
    case "÷":
      calculation = prev / current;
      break;
  }

  return calculation.toString();
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const functionOperand = (operand) => {
  if (operand == null) return null;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-output">
          {functionOperand(previousOperand)} {operation}
        </div>
        <div className="current-output">{functionOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two clear-btn"
        onClick={() => dispatch({ type: ACTION.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>
        DEL
      </button>

      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />

      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two equal-btn"
        onClick={() => dispatch({ type: ACTION.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
