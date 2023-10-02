export enum ErrorCodes {
  // Lexer
  InvalidCharacter        = 'InvalidCharacter', 
  InvalidNumber           = 'InvalidNumber', 
  InvalidOperator         = 'InvalidOperator', 
  PositionNotationError   = 'PositionNotationError', 

  // Parser
  ExtraTrailingTokens     = 'ExtraTrailingTokens', 
  InvalidToken            = 'InvalidToken', 
  MissingCloseParenthesis = 'MissingCloseParenthesis', 
  MissingExpressions      = 'MissingExpressions', 
  MissingOpenParenthesis  = 'MissingOpenParenthesis', 
  NotANumber              = 'NotANumber', 
  StackOverflow           = 'StackOverFlow', 

  // Evaluator

  // Implementation
  EmptyStack              = 'EmptyStack', 
  NonEmptyStack           = 'NonEmptyStack', 
}