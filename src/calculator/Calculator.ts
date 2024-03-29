import { Lexer, Parser, Evaluator } from "./";


export class Calculator {
  public lexer: Lexer;
  public parser: Parser;
  public evaluator: Evaluator;

  constructor(parserOptimize: boolean = false) {
    this.lexer = new Lexer();
    this.parser = new Parser(parserOptimize);
    this.evaluator = new Evaluator();
  }

  public calculate(str: string): number {
    const tokens = this.lexer.lex(str);
    const expression = this.parser.parse(tokens);
    const result = this.evaluator.evaluate(expression);
    return result;
  }
}