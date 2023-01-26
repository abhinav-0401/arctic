import { NullValue, IntValue, RuntimeValue } from "./values";
import { BinaryExpr, IntLiteral, Program, Stmt } from "../parser/ast";

function evalProgram(program: Program): RuntimeValue {
  let lastEvaluated: RuntimeValue = { type: "null", value: "null" } as NullValue;
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }
  return lastEvaluated;
}

/**
 * Evaulate pure numeric operations with binary operators.
 */
function evalIntegralBinaryExpr(
  lhs: IntValue,
  rhs: IntValue,
  operator: string,
): IntValue {
  let result: number;
  if (operator == "+") {
    result = lhs.value + rhs.value;
  } else if (operator == "-") {
    result = lhs.value - rhs.value;
  } else if (operator == "*") {
    result = lhs.value * rhs.value;
  } else if (operator == "/") {
    // TODO: Division by zero checks
    result = lhs.value / rhs.value;
  } else {
    result = lhs.value % rhs.value;
  }

  return { value: result, type: "int" };
}

/**
 * Evaulates expressions following the binary operation type.
 */
function evalBinaryExpr(binop: BinaryExpr): RuntimeValue {
  const lhs = evaluate(binop.left);
  const rhs = evaluate(binop.right);

  // Only currently support numeric operations
  if (lhs.type == "int" && rhs.type == "int") {
    return evalIntegralBinaryExpr(
      lhs as IntValue,
      rhs as IntValue,
      binop.operator,
    );
  }

  // One or both are NULL
  return { type: "null", value: "null" } as NullValue;
}

export function evaluate(astNode: Stmt): RuntimeValue {
  switch (astNode.type) {
    case "IntLiteral":
      return new IntValue((astNode as IntLiteral).value);
    case "NullLiteral":
      return new NullValue();
    case "BinaryExpr":
      return evalBinaryExpr(astNode as BinaryExpr);
    case "Program":
      return evalProgram(astNode as Program);

    // Handle unimplimented ast types as error.
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode,
      );
      process.exit(2);
  }
}