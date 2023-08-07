export enum ErrorCodes {
  // Lexer
  InvalidCharacter        = 'InvalidCharacter', 
  InvalidNumber           = 'InvalidNumber', 
  InvalidOperator         = 'InvalidOperator', 

  // Parser
  ExtraTrailingTokens     = 'ExtraTrailingTokens', 
  InvalidToken            = 'InvalidToken', 
  MissingCloseParenthesis = 'MissingCloseParenthesis', 
  MissingExpressions      = 'MissingExpressions', 
  MissingOpenParenthesis  = 'MissingOpenParenthesis', 
  NotANumber              = 'NotANumber', 

  // Evaluator

  // Implementation
  EmptyStack              = 'EmptyStack', 
  NonEmptyStack           = 'NonEmptyStack', 
}