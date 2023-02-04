import { NullValue, IntValue, RuntimeValue } from "./values";
import { 
  BinaryExpr, Expr, Identifier, IntLiteral, FunCall,                          // Expressions
  Program, Stmt, VarAssignment, VarDeclaration, FunDeclaration, PrintStmt,     // Statements  
  ReturnStmt
} from "../parser/ast";
import { Environment } from "./environment";

function evalProgram(program: Program, env: Environment): RuntimeValue {
  let lastEvaluated: RuntimeValue = new NullValue();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

function evalIntegralBinaryExpr(lhs: IntValue, rhs: IntValue, operator: string): IntValue {
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

  return new IntValue(result);
}

function evalBinaryExpr(binop: BinaryExpr, env: Environment): RuntimeValue {
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);

  // Only currently support numeric operations
  if (lhs.type == "int" && rhs.type == "int") {
    return evalIntegralBinaryExpr(
      lhs as IntValue,
      rhs as IntValue,
      binop.operator,
    );
  }

  // One or both are NULL
  return new NullValue();
}

function evalIdentifier(identifier: Identifier, env: Environment): RuntimeValue {
  const identVal = env.lookupVar(identifier.symbol);
  return identVal;
}

function evalVarDeclaration(node: VarDeclaration, env: Environment): RuntimeValue {
  if (node.value) {
    const value: RuntimeValue = evaluate(node.value, env);
    env.declareVar(node.identifier, value);
    return value;
  }

  env.declareVar(node.identifier, new NullValue());
  return new NullValue();
}

function evalValAssignment(node: VarAssignment, env: Environment): RuntimeValue {
  const value: RuntimeValue = evaluate(node.value, env);
  return env.assignVar(node.identifier, value);
}

function evalFunDeclaration(node: FunDeclaration, env: Environment): RuntimeValue {
  env.declareFun(node.identifier, node.body);

  return new NullValue();
}

function evalFunCall(node: FunCall, env: Environment): RuntimeValue {
  const funBody: Stmt[] = env.lookupFun(node.identifier);
  // create a new environment for the function
  const funEnv: Environment = new Environment();

  // set the new environment for the function
  env.setFunEnv(node.identifier, funEnv);
  funEnv.setParentEnv(env);

  let lastEvaluated: RuntimeValue = new NullValue();
  for (const funStmt of funBody) {
    if (funStmt.type !== "ReturnStmt") {
      lastEvaluated = evaluate(funStmt, funEnv);
    } else {
      lastEvaluated = evaluate((funStmt as ReturnStmt).value, funEnv);
      break;
    }
  }

  // destroy the function environment
  env.destroyFunEnv(node.identifier);

  return lastEvaluated;
}

function evalPrintStmt(node: PrintStmt, env: Environment): RuntimeValue {
  console.log((evaluate(node.argument, env) as IntValue).value);

  return new NullValue();
}

export function evaluate(astNode: Stmt, env: Environment): RuntimeValue {
  switch (astNode.type) {
    case "Identifier":
      return evalIdentifier(astNode as Identifier, env);
    case "IntLiteral":
      return new IntValue((astNode as IntLiteral).value);
    case "NullLiteral":
      return new NullValue();
    case "BinaryExpr":
      return evalBinaryExpr(astNode as BinaryExpr, env);
    case "VarDeclaration":
      return evalVarDeclaration(astNode as VarDeclaration, env);
    case "VarAssignment":
      return evalValAssignment(astNode as VarAssignment, env);
    case "FunDeclaration":
      return evalFunDeclaration(astNode as FunDeclaration, env);
    case "FunCall":
      return evalFunCall(astNode as FunCall, env);
    case "PrintStmt":
      return evalPrintStmt(astNode as PrintStmt, env);
    case "Program":
      return evalProgram(astNode as Program, env);
    case "ReturnStmt":
      console.error(
        "Cannot have return stmt outside of function body",
        astNode,
      );
      process.exit(2);
    // Handle unimplimented ast types as error.
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode,
      );
      process.exit(2);
  }
}