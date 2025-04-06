/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import { OTPField } from '../../src/ts/components/field';
import { OTPFieldConfig } from '../../src/ts/components/types';

const jsdom = require('jsdom-global');

describe('Test OTPField component', () => {
  const validConfig: OTPFieldConfig = {
    namespace: 'test-namespace',
    boxCount: 6,
  };

  const invalidConfig: OTPFieldConfig = {
    namespace: 'test-namespace',
    boxCount: 0,
  };

  let cleanup: any;

  beforeEach(() => {
    cleanup = jsdom();
  });

  afterEach(() => {
    // cleanup jsdom
    cleanup();

    // Restore the spies
    sinon.restore();
  });

  it('should not throw an error for valid config', () => {
    expect(() => new OTPField(validConfig)).to.not.throw();
  });

  it('should throw an error for invalid config', () => {
    expect(() => new OTPField(invalidConfig)).to.throw(
      Error,
      'Invalid config box count must be grater than zero.'
    );
  });

  it('should has correct id', () => {
    // Create OTPField instance
    const field = new OTPField(validConfig);

    // Assert that id is correct
    expect(field.id).to.equal('otp-field-test-namespace');
  });

  it('skeleton should return correct html element', () => {
    // Create OTPField instance
    const field = new OTPField(validConfig);

    // Create spy for getBoxElement method
    // @ts-ignore
    const getBoxElementSpy = sinon.spy(field, 'getBoxElement');

    // Access skeleton
    // eslint-disable-next-line
    const skeleton = field['skeleton'](); // bypass private;

    // Assert that the skeleton is an HTMLElement
    expect(skeleton).to.be.instanceOf(HTMLElement);

    // Assert that the skeleton has the correct tag name
    expect(skeleton.tagName).to.be.equal('DIV');

    // Assert that the skeleton has the correct class name
    expect(skeleton.className).to.be.equal('otp-field');

    // Assert that the spy was called exactly 4 times with specific arguments
    expect(getBoxElementSpy.callCount).to.be.equal(validConfig.boxCount);

    for (let i = 0; i < validConfig.boxCount; i += 1) {
      expect(getBoxElementSpy.getCall(i).args[0]).to.be.equal(i);

      // Assert that titleElement is appended in skeleton
      expect(skeleton.querySelector(`#${validConfig.namespace}-box-${i}`)).to
        .exist;
    }
  });
});
