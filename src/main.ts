// import * as readline from "node:readline";
import { readFileSync } from "fs";
import { TokenType, Token } from "./lexer/token";
import { Lexer } from "./lexer/lexer";

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

  console.log(tokens);
  // Lexer.printTokens(tokens);
}

// function repl() {

// }