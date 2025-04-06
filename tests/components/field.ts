import { expect } from 'chai';
import { describe, it } from 'mocha';
import { OTPField } from '../../src/ts/components/field';
import { OTPFieldConfig } from '../../src/ts/components/types';

describe('Test OTPField component', () => {
  const validConfig: OTPFieldConfig = {
    namespace: 'test-namespace',
    boxCount: 6,
  };

  const invalidConfig: OTPFieldConfig = {
    namespace: 'test-namespace',
    boxCount: 0,
  };

  it('should not throw an error for valid config', () => {
    expect(() => new OTPField(validConfig)).to.not.throw();
  });

  it('should throw an error for invalid config', () => {
    expect(() => new OTPField(invalidConfig)).to.throw(
      Error,
      'Invalid config box count must be grater than zero.'
    );
  });
});
