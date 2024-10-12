import Logger from '../utils/logger';
import { OTPFieldConfig, OTPValueType } from './types';

export default class OTPField {
  config: OTPFieldConfig;

  private fieldValue = '';

  get value() {
    return this.fieldValue;
  }

  // eslint-disable-next-line class-methods-use-this
  private getOTPRegexForValueType(type: OTPValueType): RegExp {
    switch (type) {
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
        return /[^A-Za-z0-9]/g; // Match anything except alphanumeric upper characters

      default:
        throw new Error('Invalid OTP field value type');
    }
  }

  getOtpRegex(): RegExp {
    if (this.config.customRegex) {
      return this.config.customRegex;
    }

    return this.getOTPRegexForValueType(
      this.config.valueType ?? OTPValueType.NUMERIC
    );
  }

  applyRegex(value: string) {
    return value.replace(this.getOtpRegex(), '');
  }

  focus() {
    let focusBoxIndex = this.config.boxCount - 1;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      if (this.getBoxValue(i) === '') {
        focusBoxIndex = i;
        break;
      }
    }

    this.focusBox(focusBoxIndex);
  }

  clear() {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      this.setBoxValue(i, '');
    }

    this.fieldValue = '';
    this.focusBox(0);
  }

  constructor(config: OTPFieldConfig) {
    if (config.boxCount <= 0) {
      throw new Error('Invalid config box count must be grater than zero.');
    }

    this.config = config;

    setInterval(() => {
      Logger.instance.info('value =>>> ', this.fieldValue);
    }, 1000);
  }

  private skeleton(): HTMLElement {
    const field = document.createElement('div');
    field.id = this.id;
    field.className = 'otp-field';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      field.appendChild(this.getBox(i));
    }

    return field;
  }

  private getBoxId(index: number) {
    return `${this.config.namespace}-box-${index}`;
  }

  // eslint-disable-next-line class-methods-use-this
  private getBoxIndex(box: HTMLInputElement) {
    const dataIndex = box.getAttribute('data-index');
    if (dataIndex) {
      return parseInt(dataIndex, 10);
    }

    Logger.instance.log('box', box);
    throw new Error('Unable to get `data-index` attribute for box');
  }

  private getBox(index: number) {
    const box = document.createElement('input');
    box.id = this.getBoxId(index);
    box.type = 'text';
    box.maxLength = 1;
    box.autocomplete = 'off';
    box.setAttribute('data-index', index.toString());

    box.addEventListener('input', this.onBoxInput.bind(this));
    box.addEventListener('keydown', this.onBoxKeyDown.bind(this));
    box.addEventListener('focus', this.onBoxFocus.bind(this));
    box.addEventListener('paste', this.onBoxPaste.bind(this));

    return box;
  }

  onBoxPaste(e: any) {
    e.preventDefault();

    const pastedText: string = e.clipboardData.getData('text');
    const pastedValue = this.applyRegex(pastedText);

    Logger.instance.log('pasted value', pastedValue);

    const currentBoxIndex = this.getBoxIndex(e.target);

    Logger.instance.log('Current box index', currentBoxIndex);

    const maxLength = Math.min(
      this.config.boxCount - currentBoxIndex,
      pastedValue.length
    );

    Logger.instance.log('maxLength', maxLength);

    for (
      let i = 0;
      i < maxLength;
      // eslint-disable-next-line no-plusplus
      i++
    ) {
      this.setBoxValue(currentBoxIndex + i, pastedValue[i]);
    }

    Logger.instance.info('config.onPasteBlur', this.config.onPasteBlur);
    if (this.config.onPasteBlur) {
      Logger.instance.info('Blur box');
      e.target.blur();
    } else {
      Logger.instance.info('Focus box');
      this.focusBox(currentBoxIndex + maxLength - 1);
    }

    this.updateValue();
  }

  updateValue() {
    let value = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      value += this.getBoxValue(i);
    }

    Logger.instance.log('value', this.fieldValue, 'new value', value);
    this.fieldValue = value;
  }

  // eslint-disable-next-line class-methods-use-this
  onBoxFocus(e: any) {
    Logger.instance.info('focus', e);

    // if current box have value select all
    if (e.target.value.length === 1) {
      Logger.instance.log(
        'Select all value for current box, as value of current box not empty',
        e.target.value
      );
      e.target.selectionStart = 0;
      e.target.selectionEnd = 1;
    }
  }

  onBoxKeyDown(e: any) {
    Logger.instance.log('keydown', e);

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      Logger.instance.info('Key:ArrowLeft-ArrowUp move focus to prev box');
      e.preventDefault();
      this.focusPrevBox(e.target);
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      Logger.instance.info('Key:ArrowRight-ArrowUp move focus to next box');
      this.focusNextBox(e.target);
    }

    if (
      e.key === 'Backspace' &&
      (e.target.value === '' || e.target.selectionEnd === 0)
    ) {
      Logger.instance.log('Key:Backspace move focus to prev box');
      this.focusPrevBox(e.target);
    }

    if (
      e.key === 'Delete' &&
      (e.target.value === '' ||
        (e.target.selectionStart !== 0 && e.target.selectionEnd === 1))
    ) {
      Logger.instance.log('Key:Delete move focus to next box');
      this.focusNextBox(e.target);
    }
  }

  onBoxInput(e: any) {
    Logger.instance.info('input', e);

    Logger.instance.log('Entered Value', e.target.value);

    // replace unwanted values
    const updatedValue = this.applyRegex(e.target.value);
    Logger.instance.log('updatedValue Value', updatedValue);

    e.target.value = updatedValue;

    Logger.instance.log('Value updated', updatedValue);

    // if current box value is empty do nothing
    if (e.target.value !== '') {
      Logger.instance.info(
        'target box value is not empty move focus to next box'
      );
      this.focusNextBox(e.target);
    }

    this.updateValue();
  }

  focusNextBox(currentBox: HTMLInputElement) {
    const currentBoxIndex = this.getBoxIndex(currentBox);
    Logger.instance.info('currentBoxIndex', currentBoxIndex);
    Logger.instance.log('config boxCount', this.config.boxCount);

    Logger.instance.log(
      'we need to jump to next box',
      currentBoxIndex + 1 < this.config.boxCount
    );

    // if current box index is less than no of box count
    if (currentBoxIndex + 1 < this.config.boxCount) {
      Logger.instance.log('Focusing to next box at index', currentBoxIndex + 1);
      this.focusBox(currentBoxIndex + 1);
    }
  }

  focusPrevBox(currentBox: HTMLInputElement) {
    const currentBoxIndex = this.getBoxIndex(currentBox);
    Logger.instance.info('currentBoxIndex', currentBoxIndex);

    Logger.instance.log(
      'we need to jump to prev box',
      currentBoxIndex - 1 >= 0
    );

    // if current box index is grater than or equal to zero
    if (currentBoxIndex - 1 >= 0) {
      Logger.instance.log('Focusing to next box at index', currentBoxIndex + 1);
      this.focusBox(currentBoxIndex - 1);
    }
  }

  focusBox(index: number) {
    const box = this.getBoxAtIndex(index);
    Logger.instance.info('Focusing to Box', box);

    box.focus();
  }

  private setBoxValue(index: number, value: string) {
    Logger.instance.log(`Setting box at index ${index} value to ${value}`);

    const box = this.getBoxAtIndex(index);
    box.value = value;
  }

  private getBoxValue(index: number) {
    Logger.instance.log(`Getting box at index ${index} value`);

    const box = this.getBoxAtIndex(index);
    return box.value;
  }

  private getBoxAtIndex(index: number) {
    const boxId = this.getBoxId(index);
    const box = document.getElementById(boxId);

    if (box === null) {
      throw new Error(`Unable to get box at index ${index}`);
    }

    return box as HTMLInputElement;
  }

  get id(): string {
    return `otp-field-${this.config.namespace}`;
  }

  get element(): HTMLElement {
    return document.getElementById(this.id)!;
  }

  destroy(): void {
    this.element.remove();
  }

  build(parentElement: HTMLElement) {
    parentElement.appendChild(this.skeleton());
  }
}
