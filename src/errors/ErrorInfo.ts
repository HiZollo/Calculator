import { ErrorCodes } from "./ErrorCodes";
import { ErrorTypes } from "./ErrorTypes";

export const Messages = {
  // Lexer
  [ErrorCodes.InvalidCharacter]: (char: string) => `Invalid Character ${char}.`, 
  [ErrorCodes.InvalidOperator]: (operator: string) => `Invalid Operator ${operator}.`, 
  [ErrorCodes.InvalidNumber]: (number: string) => `Invalid Number ${number}.`, 

  // Parser
  [ErrorCodes.ExtraTrailingTokens]: () => `There should not be any extra tokens in the end.`, 
  [ErrorCodes.InvalidToken]: (token: string) => `Invalid Token ${token}.`, 
  [ErrorCodes.MissingCloseParenthesis]: () => `Missing close parenthesis.`, 
  [ErrorCodes.MissingExpressions]: () => `Missing expressions. Nothing to parse.`, 
  [ErrorCodes.MissingOpenParenthesis]: () => `Missing open parenthesis.`, 
  [ErrorCodes.NotANumber]: (token: string) => `${token} cannot be parsed as a number.`, 

  // Evaluator

  // Implementation
  [ErrorCodes.EmptyStack]: () => `The stack is empty. This is probably caused by a bug in calculator itself.`, 
  [ErrorCodes.NonEmptyStack]: () => `Non-empty stack after parsing. This is probably caused by a bug in calculator itself.`, 
} as const;

export const Types = {
    // Lexer
    [ErrorCodes.InvalidCharacter]: ErrorTypes.LexerError, 
    [ErrorCodes.InvalidOperator]: ErrorTypes.LexerError, 
    [ErrorCodes.InvalidNumber]: ErrorTypes.LexerError, 
  
    // Parser
    [ErrorCodes.ExtraTrailingTokens]: ErrorTypes.ParserError, 
    [ErrorCodes.InvalidToken]: ErrorTypes.ParserError, 
    [ErrorCodes.MissingCloseParenthesis]: ErrorTypes.ParserError, 
    [ErrorCodes.MissingExpressions]: ErrorTypes.ParserError, 
    [ErrorCodes.MissingOpenParenthesis]: ErrorTypes.ParserError, 
    [ErrorCodes.NotANumber]: ErrorTypes.ParserError, 
  
    // Evaluator

    // Implementation
    [ErrorCodes.EmptyStack]: ErrorTypes.ImplementationError, 
    [ErrorCodes.NonEmptyStack]: ErrorTypes.ImplementationError, 
} as const;