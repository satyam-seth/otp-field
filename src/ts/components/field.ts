import Logger from '../utils/logger';
import { OTPFieldConfig } from './types';

export default class OTPField {
  config: OTPFieldConfig;

  // TODO: move it to config and set current value as default
  regex = /[^0-9]/g;

  private value = '';

  constructor(config: OTPFieldConfig) {
    if (config.boxCount <= 0) {
      throw new Error('Invalid config box count must be grater than zero.');
    }

    this.config = config;

    setInterval(() => {
      // console.log('value =>>> ', this.value);
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
    const pastedValue = pastedText.replace(this.regex, '');

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
      const boxId = this.getBoxId(currentBoxIndex + i);
      const box = document.getElementById(boxId) as HTMLInputElement;
      box.value = pastedValue[i];
    }

    Logger.instance.info('config.onPasteBlur', this.config.onPasteBlur);
    if (this.config.onPasteBlur) {
      Logger.instance.info('Blur box');
      e.target.blur();
    } else {
      Logger.instance.info('Focus box');
      const boxId = this.getBoxId(currentBoxIndex + maxLength - 1);
      const box = document.getElementById(boxId) as HTMLInputElement;
      box.focus();
    }
  }

  updateValue() {
    let value = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      const boxId = `${this.config.namespace}-box-${i}`;
      const box = document.getElementById(boxId) as HTMLInputElement;
      value += box.value;
    }

    Logger.instance.log('value', this.value, 'new value', value);
    this.value = value;
  }

  // eslint-disable-next-line class-methods-use-this
  onBoxFocus(e: any) {
    Logger.instance.info('focus', e);

    // if current box have value select all
    if (e.target.value.length === 1) {
      Logger.instance.log(
        'Select all value for current box, as value of current box not empty ->',
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
    const updatedValue = e.target.value.replace(this.regex, '');
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
    const boxId = this.getBoxId(index);

    const box = document.getElementById(boxId) as HTMLInputElement;
    Logger.instance.info('Focusing to Box', box);

    box.focus();
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
