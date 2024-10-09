import { OTPFieldConfig } from './types';

export default class OTPField {
  config: OTPFieldConfig;

  // TODO: move it to config and set current value as default
  regex = /[^0-9]/g;

  value = '';

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

  private getBox(index: number) {
    const box = document.createElement('input');
    box.id = `${this.config.namespace}-box-${index}`;
    box.type = 'text';
    box.maxLength = 1;
    box.autocomplete = 'off';
    box.setAttribute('data-index', index.toString());

    // TODO: once box is focused user now can able to click on 0 selection position
    box.addEventListener('change', this.onBoxChange.bind(this));
    box.addEventListener('input', this.onBoxInput.bind(this));
    box.addEventListener('keydown', this.onBoxKeyDown.bind(this));
    box.addEventListener('focus', this.onBoxFocus.bind(this));
    // box.addEventListener('paste', this.onBoxPaste.bind(this));

    return box;
  }

  // TODO: after paste only first box is focused
  // TODO: not working in paste in middle
  // onBoxPaste(e: any) {
  //   e.preventDefault();

  //   const pastedText: string = e.clipboardData.getData('text');
  //   const value = pastedText.replace(this.regex, '');

  //   const currentValueLength = this.value.length;
  //   for (
  //     let i = currentValueLength;
  //     i < this.config.boxCount && i < value.length;
  //     // eslint-disable-next-line no-plusplus
  //     i++
  //   ) {
  //     const boxId = `${this.config.namespace}-box-${i}`;
  //     const box = document.getElementById(boxId) as HTMLInputElement;
  //     box.value = value[i - currentValueLength];
  //   }
  // }

  // eslint-disable-next-line no-unused-vars
  onBoxChange(e: any) {
    // console.log('change', e);
    let value = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      const boxId = `${this.config.namespace}-box-${i}`;
      const box = document.getElementById(boxId) as HTMLInputElement;
      value += box.value;
    }

    // console.log('value', this.value, 'new value', value);
    this.value = value;
  }

  onBoxFocus(e: any) {
    // console.log('focus', e);
    const currentBoxIndex = parseInt(e.target.getAttribute('data-index'), 10);
    // console.log('focus', currentBoxIndex);

    // 4,3
    if (
      currentBoxIndex === this.value.length ||
      currentBoxIndex === this.value.length - 1
    ) {
      return;
    }

    const focusBoxId = `${this.config.namespace}-box-${this.config.boxCount === this.value.length ? this.value.length - 1 : this.value.length}`;
    // console.log('update focus', focusBoxId);
    const focusBox = document.getElementById(focusBoxId)!;
    focusBox.focus();
  }

  onBoxKeyDown(e: any) {
    // console.log('keydown', e);
    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowDown'
    ) {
      e.preventDefault(); // Prevent default action of arrow keys
    }

    if (e.key === 'Backspace' && e.target.value === '') {
      const currentBoxIndex = parseInt(e.target.getAttribute('data-index'), 10);

      if (currentBoxIndex > 0) {
        const prevBoxId = `${this.config.namespace}-box-${currentBoxIndex - 1}`;
        const nextBox = document.getElementById(prevBoxId)!;
        nextBox.focus();
      }
    }
  }

  onBoxInput(e: any) {
    // console.log('input', e);

    e.target.value = e.target.value.replace(this.regex, '');

    if (e.target.value === '') return;

    const currentBoxIndex = parseInt(e.target.getAttribute('data-index'), 10);

    if (currentBoxIndex + 1 < this.config.boxCount) {
      const nextBoxId = `${this.config.namespace}-box-${currentBoxIndex + 1}`;
      // console.log(nextBoxId);
      const nextBox = document.getElementById(nextBoxId)!;
      nextBox.focus();
    }
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
