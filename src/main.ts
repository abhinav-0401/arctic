import { readFileSync } from "fs";
import { Token } from "./lexer/token";
import { Lexer } from "./lexer/lexer";
import { Parser } from "./parser/parser";
import { evaluate } from "./runtime/interpreter";
import { Environment } from "./runtime/environment";
import { BooleanValue, IntValue, NullValue, RuntimeValue } from "./runtime/values";
import { VarDeclaration } from "./parser/ast";

main();

// the main function will either run a repl or take input from a file
function main(): void {
  const args: string[] = process.argv;

  if (args.length > 3) {
    console.log("Usage: node dist/main.js [file to run]");
  }

  if (args.length === 3) {
    runFile(args[2]);
  } else {
    // repl();
  }
}

function runFile(filename: string): void {
  const src: string = readFileSync(`./examples/${filename}`, "utf8");
  const lexer = new Lexer(src);
  const tokens: Token[] = lexer.lex(src);

  // console.log(tokens);
  // Lexer.printTokens(tokens);
  const parser = new Parser(tokens);
  const ast = parser.produceAST();
  console.log(ast.body);

  const globalEnv = new Environment();
  globalEnv.declareVar("bday", new IntValue(4));
  globalEnv.declareVar("true", new BooleanValue(true));
  globalEnv.declareVar("false", new BooleanValue(false));
  globalEnv.declareVar("null", new NullValue());
  globalEnv.declareVar("x", new IntValue(10));

  console.log("Program returned", evaluate(ast, globalEnv));
}

// function repl() {

// }