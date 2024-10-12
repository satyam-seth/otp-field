/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-shadow, import/prefer-default-export
export enum OTPValueType {
  // Match anything except digits
  NUMERIC,

  // Match anything except alphabetic characters
  ALPHABETIC,

  // Match anything except alphabetic lower characters
  ALPHABETIC_LOWER,

  // Match anything except alphabetic upper characters
  ALPHABETIC_UPPER,

  // Match anything except alphanumeric characters
  ALPHANUMERIC,

  // Match anything except alphanumeric lower characters
  ALPHANUMERIC_LOWER,

  // Match anything except alphanumeric upper characters
  ALPHANUMERIC_UPPER,
}
