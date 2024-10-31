import { OTPValueType } from './types';

/**
 *
 * To get otp regex for given value type
 *
 * @param valueType {OTPValueType}
 * @returns {RegExp}
 *
 */
// eslint-disable-next-line import/prefer-default-export
export function getOTPRegexForValueType(valueType: OTPValueType): RegExp {
  switch (valueType) {
    case OTPValueType.NUMERIC:
      return /[^0-9]/g; // Match anything except digits

    case OTPValueType.ALPHABETIC:
      return /[^A-Za-z]/g; // Match anything except alphabetic characters

    case OTPValueType.ALPHABETIC_LOWER:
      return /[^a-z]/g; // Match anything except alphabetic lower characters

    case OTPValueType.ALPHABETIC_UPPER:
      return /[^A-Z]/g; // Match anything except alphabetic upper characters

    case OTPValueType.ALPHANUMERIC:
      return /[^A-Za-z0-9]/g; // Match anything except alphanumeric characters

    case OTPValueType.ALPHANUMERIC_LOWER:
      return /[^a-z0-9]/g; // Match anything except alphanumeric lower characters

    case OTPValueType.ALPHANUMERIC_UPPER:
      return /[^A-Z0-9]/g; // Match anything except alphanumeric upper characters

    // throw error for invalid type
    default:
      throw new Error('Invalid OTP field value type');
  }
}
