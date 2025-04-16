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

      // Assert that box element is appended in skeleton
      expect(skeleton.querySelector(`#${validConfig.namespace}-box-${i}`)).to
        .exist;
    }
  });

  it('getBoxElement should return correct html element', () => {
    // Create OTPField instance
    validConfig.boxCount = 1;
    const field = new OTPField(validConfig);

    // Create stub for onBoxInput
    const onBoxInputStub = sinon
      // @ts-ignore
      .stub(field, 'onBoxInput')
      // eslint-disable-next-line no-unused-vars, no-console
      .callsFake((e: Event) => console.log('Fake onBoxInput called'));

    // Create stub for onBoxKeyDown
    const onBoxKeyDownStub = sinon
      // @ts-ignore
      .stub(field, 'onBoxKeyDown')
      // eslint-disable-next-line no-unused-vars, no-console
      .callsFake((e: Event) => console.log('Fake onBoxKeyDown called'));

    // Create stub for onBoxFocus
    const onBoxFocusStub = sinon
      // @ts-ignore
      .stub(field, 'onBoxFocus')
      // eslint-disable-next-line no-unused-vars, no-console
      .callsFake((e: Event) => console.log('Fake onBoxFocus called'));

    // Create stub for onBoxPaste
    const onBoxPasteStub = sinon
      // @ts-ignore
      .stub(field, 'onBoxPaste')
      // eslint-disable-next-line no-unused-vars, no-console
      .callsFake((e: Event) => console.log('Fake onBoxPaste called'));

    // eslint-disable-next-line
    const boxElement = field['getBoxElement'](0);  // bypass private;

    // Assert that the boxElement is an HTMLInputElement
    expect(boxElement).to.be.instanceOf(HTMLInputElement);

    // Assert that the boxElement element has the correct tag name
    expect(boxElement.tagName).to.be.equal('INPUT');

    // Assert that the boxElement element has the correct id
    expect(boxElement.id).to.be.equal(`${validConfig.namespace}-box-0`);

    // Assert that the boxElement element has the correct class name
    expect(boxElement.className).to.be.equal('otp-box');

    // Assert that the boxElement element has the correct type
    expect(boxElement.type).to.be.equal('text');

    // Assert that the boxElement element has the correct maxLength
    expect(boxElement.maxLength).to.be.equal(1);

    // Assert that the boxElement element has the autocomplete
    expect(boxElement.autocomplete).to.be.equal('off');

    // Assert that the boxElement element has the data-index attribute
    expect(boxElement.getAttribute('data-index')).to.be.equal('0');

    // Simulate a input event on the boxElement
    const inputEvent = new Event('input');
    boxElement.dispatchEvent(inputEvent);

    // Assert that the onBoxInputStub called once
    expect(onBoxInputStub.calledOnce).to.be.true;

    // Simulate a keyDown event on the boxElement
    const keyDownEvent = new Event('keydown');
    boxElement.dispatchEvent(keyDownEvent);

    // Assert that the onBoxKeyDownStub called once
    expect(onBoxKeyDownStub.calledOnce).to.be.true;

    // Simulate a focus event on the boxElement
    const focusEvent = new Event('focus');
    boxElement.dispatchEvent(focusEvent);

    // Assert that the onBoxFocusStub called once
    expect(onBoxFocusStub.calledOnce).to.be.true;

    // Simulate a paste event on the boxElement
    const pasteEvent = new Event('paste');
    boxElement.dispatchEvent(pasteEvent);

    // Assert that the onBoxPasteStub called once
    expect(onBoxPasteStub.calledOnce).to.be.true;
  });

  it('value getter should return the correct value', () => {
    const field = new OTPField(validConfig);

    // Assert that the field value initially empty string
    expect(field.value).to.equal('');

    // eslint-disable-next-line
    field['fieldValue'] = '123456';

    // Assert that the field value return correct value
    expect(field.value).to.equal('123456');
  });

  it('isDisabled getter should return the correct value', () => {
    const field = new OTPField(validConfig);

    // Assert that the field isDisabled return correct value
    expect(field.isDisabled).to.equal(false);
  });

  it('id getter should return the correct value', () => {
    const field = new OTPField(validConfig);

    // Assert that the field id return correct value
    expect(field.id).to.equal('otp-field-test-namespace');
  });

  it('element should retrieve button HTMLElement', () => {
    const field = new OTPField(validConfig);

    // Expected button id
    const fieldId = `otp-field-${validConfig.namespace}`;

    // Create spy for document getElementById
    const getElementByIdSpy = sinon.spy(document, 'getElementById');

    // Call the build method
    field.build(document.body);

    // Call element
    const result = field.element;

    // Assert that getElementById call with expected id
    expect(getElementByIdSpy.calledOnceWith(fieldId)).to.be.true;

    // Assert that the result is an HTMLElement
    expect(result).to.be.an.instanceOf(HTMLElement);

    // Assert that result HTMLElement has expected id
    expect(result.id).to.equal(fieldId);
  });
});
