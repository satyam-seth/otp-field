import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getOTPRegexForValueType, OTPValueType } from '../../src/ts/main';

describe('Test getOTPRegexForValueType function', () => {
  it('should return valid regex for valid value type', () => {
    const numericRegex = getOTPRegexForValueType(OTPValueType.NUMERIC);
    expect(numericRegex.toString()).to.equal('/[^0-9]/g');

    const alphabeticRegex = getOTPRegexForValueType(OTPValueType.ALPHABETIC);
    expect(alphabeticRegex.toString()).to.equal('/[^A-Za-z]/g');

    const alphabeticLowerRegex = getOTPRegexForValueType(
      OTPValueType.ALPHABETIC_LOWER
    );
    expect(alphabeticLowerRegex.toString()).to.equal('/[^a-z]/g');

    const alphabeticUpperRegex = getOTPRegexForValueType(
      OTPValueType.ALPHABETIC_UPPER
    );
    expect(alphabeticUpperRegex.toString()).to.equal('/[^A-Z]/g');

    const alphanumericRegex = getOTPRegexForValueType(
      OTPValueType.ALPHANUMERIC
    );
    expect(alphanumericRegex.toString()).to.equal('/[^A-Za-z0-9]/g');

    const alphanumericLowerRegex = getOTPRegexForValueType(
      OTPValueType.ALPHANUMERIC_LOWER
    );
    expect(alphanumericLowerRegex.toString()).to.equal('/[^a-z0-9]/g');

    const alphanumericUpperRegex = getOTPRegexForValueType(
      OTPValueType.ALPHANUMERIC_UPPER
    );
    expect(alphanumericUpperRegex.toString()).to.equal('/[^A-Z0-9]/g');
  });

  it('should throw error for invalid value type', () => {
    // @ts-ignore
    expect(() => getOTPRegexForValueType('invalid')).to.throw(
      Error,
      'Invalid OTP field value type'
    );
  });
});
