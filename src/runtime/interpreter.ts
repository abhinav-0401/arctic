import { NullValue, IntValue, BooleanValue , RuntimeValue, ReturnValue } from "./values";
import { 
  BinaryExpr, Expr, Identifier, IntLiteral, FunCall, IfExpr,                    // Expressions
  Program, Stmt, VarAssignment, VarDeclaration, FunDeclaration, PrintStmt,     // Statements  
  ReturnStmt
} from "../parser/ast";
import { Environment } from "./environment";

function evalProgram(program: Program, env: Environment): RuntimeValue {
  let lastEvaluated: RuntimeValue = new NullValue();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
    if (lastEvaluated.type === "return") {
      // @ts-ignore
      const returnValue: RuntimeValue | undefined = (lastEvaluated as ReturnValue).value;
      if (returnValue) {
        lastEvaluated = returnValue;
      } else {
        lastEvaluated = new NullValue();
      }

      break;
    }
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
  let lhs: RuntimeValue = evaluate(binop.left, env)
  let rhs: RuntimeValue = evaluate(binop.right, env);

  if (lhs.type === "return") {
    lhs = (lhs as ReturnValue).value;
  }

  if (rhs.type === "return") {
    rhs = (rhs as ReturnValue).value;
  }

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
  // console.log("evalFunCall");
  const funBody: Stmt[] = env.lookupFun(node.identifier);
  // create a new environment for the function
  const funEnv: Environment = new Environment();

  // set the new environment for the function
  env.setFunEnv(node.identifier, funEnv);
  funEnv.setParentEnv(env);

  let lastEvaluated: RuntimeValue;
  for (const funStmt of funBody) {
    if (funStmt.type !== "ReturnStmt") {
      // console.log(funStmt);
      lastEvaluated = evaluate(funStmt, funEnv);
      if (lastEvaluated.type === "return") {
        // @ts-ignore
        const returnValue: RuntimeValue | undefined = (lastEvaluated as ReturnValue).value;
        if (returnValue) {
          lastEvaluated = returnValue;
        } else {
          lastEvaluated = new NullValue();
        }
        break;
      }
    } else {
      const expr: Expr | undefined = (funStmt as ReturnStmt).value;
      if (expr) {
        lastEvaluated = evaluate(expr, funEnv);
      } else {
        lastEvaluated = new NullValue();
      }
      break;
    }
  }

  // destroy the function environment
  env.destroyFunEnv(node.identifier);

  // @ts-ignore
  return lastEvaluated;
}

function evalIfExpr(node: IfExpr, env: Environment): RuntimeValue {
  // console.log("inside evalIfExpr");
  const ifEnv: Environment = new Environment();
  ifEnv.setParentEnv(env);

  let lastEvaluated: RuntimeValue = new NullValue();
  const conditionValue: RuntimeValue = evaluate(node.condition, env);
  
  if (conditionValue.type !== "boolean") {
    throw "If Expression's condition must evaluate to a boolean value";
  } else if ((conditionValue as BooleanValue).value) {
    for (const ifBlockStmt of node.ifBlock) {
      if (ifBlockStmt.type !== "ReturnStmt") {
        lastEvaluated = evaluate(ifBlockStmt, ifEnv);
      } else {
        lastEvaluated = evalReturnStmt(ifBlockStmt as ReturnStmt, env); 
      }     
    }
  } else if (node.elseBlock) {
    for (const elseBlockStmt of node.elseBlock) {
      lastEvaluated = evaluate(elseBlockStmt, ifEnv);
    }
  }

  return lastEvaluated;
}

function evalReturnStmt(node: ReturnStmt, env: Environment): ReturnValue {
  if (node.value) {
    return new ReturnValue(evaluate(node.value, env));
  } else {
    return new ReturnValue(new NullValue());
  }
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
    case "IfExpr":
      return evalIfExpr(astNode as IfExpr, env);
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
      return evalReturnStmt(astNode as ReturnStmt, env);
    // Handle unimplimented ast types as error.
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode,
      );
      process.exit(2);
  }
}