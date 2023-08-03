export enum ErrorCodes {
  // Lexer
  InvalidCharacter        = 'InvalidCharacter', 
  InvalidOperator         = 'InvalidOperator', 
  TwoDecimalPoints        = 'TwoDecimalPoints', 

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