import { OTPFieldConfig } from './types';
import { OTPValueType } from '../utils/types';
import { getOTPRegexForValueType } from '../utils/regex';

/**
 * A class representing an OTP (One-Time Password) input field, designed to handle
 * multiple input boxes for entering a series of characters, typically used for
 * verification processes such as two-factor authentication.
 *
 * This class provides functionalities for:
 * - Configuring the OTP input field with specific settings.
 * - Managing the state of individual input boxes.
 * - Validating and formatting input values.
 * - Handling user interactions such as input, paste, and keyboard events.
 * - Focusing on the appropriate input boxes based on user actions.
 *
 * Usage Example:
 * ```typescript
 * const otpFieldConfig: OTPFieldConfig = {
 *   boxCount: 6,           // Number of input boxes
 *   namespace: 'otp',      // Namespace for IDs
 * };
 *
 * const otpField = new OTPField(otpFieldConfig);
 * otpField.build(document.getElementById('otp-container'));
 * ```
 */
export default class OTPField {
  // Configuration for the OTP field
  config: OTPFieldConfig;

  // Current value of the OTP input fields
  private fieldValue = '';

  /**
   * Initializes the OTP input handler with the specified configuration.
   *
   * @param {OTPFieldConfig} config - The configuration object for the OTP field.
   * @throws {Error} If the `boxCount` in the config is less than or equal to zero.
   *
   * @remarks
   * This constructor sets up the OTP input field configuration. It ensures
   * that the `boxCount` (number of input boxes) is a valid positive integer.
   * If the `boxCount` is not greater than zero, it throws an error.
   */
  constructor(config: OTPFieldConfig) {
    if (config.boxCount <= 0) {
      throw new Error('Invalid config box count must be grater than zero.');
    }

    this.config = config;
  }

  /**
   * Creates the HTML structure (skeleton) for the OTP input field.
   *
   * @private
   * @returns {HTMLElement} - The parent `div` element containing the OTP input boxes.
   *
   * @remarks
   * This method generates a `div` element with the specified number of OTP input boxes
   * (as defined in the configuration). Each box is created by calling `this.getBox(i)`
   * and is appended to the parent `div`. The `div` is given an `id` and a CSS class
   * of 'otp-field' to allow for easy styling and manipulation.
   */
  private skeleton(): HTMLElement {
    const field = document.createElement('div');
    field.id = this.id;
    field.className = 'otp-field';

    // Create and append the OTP input boxes
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      field.appendChild(this.getBoxElement(i));
    }

    return field;
  }

  /**
   * Creates and returns an OTP input box element.
   *
   * @private
   * @param {number} index - The index of the OTP input box.
   * @returns {HTMLInputElement} - The generated OTP input box element.
   *
   * @remarks
   * This method creates a single OTP input box (HTML `input` element) and sets its properties:
   * - `id`: A unique ID for the input box, generated by `getBoxId(index)`.
   * - `type`: Set to `'text'` to allow text input.
   * - `maxLength`: Restricts the input to a single character.
   * - `autocomplete`: Disabled to prevent suggestions from the browser.
   * - `data-index`: A custom attribute to store the index of the box for easy reference.
   *
   * It also attaches event listeners for handling user interaction:
   * - `input`: To handle when the user types in the box.
   * - `keydown`: To manage key-based interactions (e.g., arrow keys, backspace).
   * - `focus`: To handle behavior when the input box gains focus.
   * - `paste`: To manage paste events (e.g., pasting OTP from clipboard).
   */
  private getBoxElement(index: number) {
    const box = document.createElement('input');

    box.id = this.getBoxId(index); // Assign unique ID and basic attributes
    box.type = 'text'; // Text input field
    box.maxLength = 1; // Restrict to 1 character
    box.autocomplete = 'off'; // Disable browser autocomplete
    box.setAttribute('data-index', index.toString()); // Store index as `data-index`

    // Add event listeners to handle user interactions
    box.addEventListener('input', this.onBoxInput.bind(this)); // Handle input event
    box.addEventListener('keydown', this.onBoxKeyDown.bind(this)); // Handle keydown event
    box.addEventListener('focus', this.onBoxFocus.bind(this)); // Handle focus event
    box.addEventListener('paste', this.onBoxPaste.bind(this)); // Handle paste event

    return box;
  }

  /**
   * Retrieves the current value of the OTP input field.
   *
   * @returns {string} - The concatenated OTP value stored in the `fieldValue`.
   *
   * @remarks
   * This getter returns the internal `fieldValue`, which represents
   * the OTP as a single string. The `fieldValue` is typically updated
   * whenever the user inputs values into the OTP input boxes.
   */
  get value() {
    return this.fieldValue;
  }

  /**
   * Gets the unique identifier for the OTP field.
   *
   * @returns {string} The unique ID of the OTP field in the format `otp-field-{namespace}`.
   *
   * @remarks
   * This getter constructs the ID based on the `namespace` specified in the
   * configuration, ensuring that each OTP field instance has a unique identifier
   * that can be used in the DOM for identification and manipulation.
   */
  get id(): string {
    return `otp-field-${this.config.namespace}`;
  }

  /**
   * Gets the DOM element associated with the OTP field.
   *
   * @returns {HTMLElement} The DOM element of the OTP field.
   *
   * @throws {Error} Throws an error if the element cannot be found.
   *
   * @remarks
   * This getter retrieves the DOM element corresponding to the unique ID of the OTP field.
   * It uses the ID generated from the `id` getter to locate the element in the DOM.
   * If the element does not exist, an error is thrown to indicate that the OTP field
   * has not been properly initialized or added to the DOM.
   */
  get element(): HTMLElement {
    const elem = document.getElementById(this.id);

    if (elem === null) {
      throw new Error(`Element with ID ${this.id} not found in the DOM.`);
    }

    return elem;
  }

  /**
   * Sets focus on the first empty OTP input box.
   * If all boxes are filled, focus is set to the last box.
   *
   * @remarks
   * The function loops through all input boxes to find the first
   * empty one, determined by `getBoxValue(i) === ''`.
   * If it finds an empty box, it focuses on that box.
   * If all boxes are filled, it focuses on the last box.
   */
  focus() {
    let focusBoxIndex = this.config.boxCount - 1;

    // Loop through each OTP input box
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      // Check if the box is empty
      if (this.getBoxValue(i) === '') {
        focusBoxIndex = i; // Set the index to the first empty box
        break; // Exit the loop after finding the first empty box
      }
    }

    this.focusBox(focusBoxIndex);
  }

  /**
   * Clears all OTP input boxes and resets the stored field value.
   *
   * @remarks
   * The function loops through all OTP input boxes, setting each one to an empty string.
   * After clearing all boxes, it resets the `fieldValue` to an empty string
   * and sets focus on the first input box.
   */
  clear() {
    // Loop through each OTP input box and clear its value
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      this.setBoxValue(i, ''); // Set each box value to an empty string
    }

    // Clear the internal field value
    this.fieldValue = '';

    // Focus on the first input box
    this.focusBox(0);
  }

  /**
   * Removes the OTP field element from the DOM.
   *
   * @returns {void}
   *
   * @remarks
   * This method is responsible for cleaning up the OTP field by removing its
   * associated DOM element. This can be useful for managing memory and ensuring
   * that no references to the element remain after it is no longer needed.
   *
   * Note that this method does not perform any additional cleanup for
   * event listeners or other resources associated with the OTP field.
   * It is recommended to ensure that any necessary cleanup is performed
   * before calling this method.
   */
  destroy(): void {
    this.element.remove();
  }

  /**
   * Builds the OTP field and appends it to the specified parent element.
   *
   * @param {HTMLElement} parentElement - The parent element to which the OTP field will be appended.
   *
   * @returns {void}
   *
   * @remarks
   * This method constructs the OTP field using the `skeleton` method and appends
   * it to the provided `parentElement`. It is responsible for adding the OTP field
   * to the DOM, making it visible and ready for user interaction.
   *
   * Ensure that the `parentElement` is a valid DOM element and is attached
   * to the document. This method does not perform checks on the parent element's
   * state or existence.
   */
  build(parentElement: HTMLElement) {
    parentElement.appendChild(this.skeleton());
  }

  /**
   * Returns a regular expression to filter OTP input values
   * based on the configured value type (numeric, alphabetic, or alphanumeric).
   * If a custom regex is provided in the configuration, that is used instead.
   *
   * @returns {RegExp} A regular expression to match the valid characters
   *                   for the OTP input according to the value type.
   */
  private getOtpRegex(): RegExp {
    // If a custom regex is specified in the config, return that
    if (this.config.customRegex) {
      return this.config.customRegex;
    }

    // Otherwise, return a regex based on the specified or default value type
    return getOTPRegexForValueType(
      this.config.valueType ?? OTPValueType.NUMERIC
    );
  }

  /**
   * Applies the OTP validation regex to the given input string and
   * removes any characters that do not match the valid pattern.
   *
   * @param {string} value - The input string to be sanitized according to the OTP type.
   * @returns {string} - A new string with invalid characters removed.
   */
  private applyRegex(value: string) {
    return value.replace(this.getOtpRegex(), '');
  }

  /**
   * Generates a unique ID for an OTP input box based on the provided index.
   *
   * @private
   * @param {number} index - The index of the OTP input box.
   * @returns {string} - A unique ID string for the OTP input box.
   *
   * @remarks
   * This method creates a unique ID by combining the `namespace` from the configuration
   * with the index of the input box. This ensures that each OTP input box has a
   * distinct and predictable ID (e.g., 'namespace-box-0', 'namespace-box-1').
   */
  private getBoxId(index: number) {
    return `${this.config.namespace}-box-${index}`;
  }

  /**
   * Retrieves the OTP input box at the specified index.
   *
   * @private
   * @param {number} index - The index of the OTP input box to retrieve.
   * @returns {HTMLInputElement} The input box element at the specified index.
   *
   * @throws {Error} Throws an error if the box cannot be found at the given index.
   *
   * @remarks
   * This method constructs the box ID using the provided index, queries the DOM
   * for the input box element, and returns it. If the input box does not exist,
   * an error is thrown to alert about the invalid index.
   */
  private getBoxAtIndex(index: number) {
    // Get the ID of the input box at the specified index
    const boxId = this.getBoxId(index);

    // Query the DOM for the input box
    const box = document.getElementById(boxId);

    // Throw an error if the box is not found
    if (box === null) {
      throw new Error(`Unable to get box at index ${index}`);
    }

    return box as HTMLInputElement;
  }

  /**
   * Retrieves the index of a given OTP input box from its `data-index` attribute.
   *
   * @private
   * @param {HTMLInputElement} box - The OTP input box element.
   * @returns {number} - The index of the input box as an integer.
   *
   * @throws {Error} If the `data-index` attribute is missing or cannot be parsed.
   *
   * @remarks
   * This method extracts the index of an OTP input box from its `data-index` attribute.
   * If the attribute is not found or is invalid, it throws an error.
   * The index is typically used to identify the position of the input box within the
   * OTP field (e.g., first box, second box).
   */
  // eslint-disable-next-line class-methods-use-this
  private getBoxIndex(box: HTMLInputElement) {
    const dataIndex = box.getAttribute('data-index');

    if (dataIndex) {
      // Convert the `data-index` attribute value to an integer
      return parseInt(dataIndex, 10);
    }

    throw new Error('Unable to get `data-index` attribute for box');
  }

  /**
   * Updates the overall value of the OTP field by concatenating the values
   * of all individual input boxes.
   *
   * @private
   *
   * @remarks
   * This method iterates through each OTP input box and retrieves its value,
   * appending each value to a single string. The resulting string represents
   * the complete OTP entered by the user and is stored in the `fieldValue` property.
   * This method is typically called after user interactions (like input, paste, etc.)
   * to ensure the field value accurately reflects the current state of the input boxes.
   */
  private updateValue() {
    // Initialize an empty string to hold the concatenated value
    let concatenatedValue = '';

    // Concatenate the values from each OTP input box
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.config.boxCount; i++) {
      concatenatedValue += this.getBoxValue(i); // Append the value of each box
    }

    // Update the fieldValue property with the concatenated value
    this.fieldValue = concatenatedValue;
  }

  /**
   * Focuses on the OTP input box at the specified index.
   *
   * @private
   * @param {number} index - The index of the OTP input box to focus on.
   *
   * @remarks
   * This method retrieves the input box at the given index and sets the focus to it,
   * allowing the user to enter their OTP at the specified position in the sequence.
   */
  private focusBox(index: number) {
    // Retrieve the input box at the specified index
    const box = this.getBoxAtIndex(index);

    // Set focus on the retrieved input box
    box.focus();
  }

  /**
   * Focuses on the next OTP input box in the sequence.
   *
   * @private
   * @param {HTMLInputElement} currentBox - The currently focused OTP input box.
   *
   * @remarks
   * This method checks if there is a next input box in the OTP field configuration.
   * If a next box exists, it focuses on that box, allowing for seamless input entry.
   */
  private focusNextBox(currentBox: HTMLInputElement) {
    // Get the index of the current box
    const currentBoxIndex = this.getBoxIndex(currentBox);

    // If the current box index is less than the total number of boxes
    if (currentBoxIndex + 1 < this.config.boxCount) {
      this.focusBox(currentBoxIndex + 1); // Focus on the next box
    }
  }

  /**
   * Focuses on the previous OTP input box in the sequence.
   *
   * @private
   * @param {HTMLInputElement} currentBox - The currently focused OTP input box.
   *
   * @remarks
   * This method checks if there is a previous input box in the OTP field configuration.
   * If a previous box exists, it focuses on that box, enabling users to navigate back in their input.
   */
  private focusPrevBox(currentBox: HTMLInputElement) {
    // Get the index of the current box
    const currentBoxIndex = this.getBoxIndex(currentBox);

    // If the current box index is greater than or equal to zero
    if (currentBoxIndex - 1 >= 0) {
      this.focusBox(currentBoxIndex - 1); // Focus on the previous box
    }
  }

  /**
   * Sets the value of the OTP input box at the specified index.
   *
   * @private
   * @param {number} index - The index of the OTP input box to set the value for.
   * @param {string} value - The value to set for the input box.
   *
   * @remarks
   * This method retrieves the input box at the given index and assigns the specified value to it,
   * updating the displayed input for the user.
   */
  private setBoxValue(index: number, value: string) {
    // Retrieve the input box at the specified index
    const box = this.getBoxAtIndex(index);

    // Set the value of the retrieved input box
    box.value = value;
  }

  /**
   * Retrieves the value of the OTP input box at the specified index.
   *
   * @private
   * @param {number} index - The index of the OTP input box to retrieve the value from.
   * @returns {string} The current value of the input box.
   *
   * @remarks
   * This method fetches the input box at the given index and returns its current value,
   * allowing for access to the user's input in the OTP field.
   */
  private getBoxValue(index: number) {
    // Retrieve the input box at the specified index
    const box = this.getBoxAtIndex(index);

    // Return the value of the retrieved input box
    return box.value;
  }

  /**
   * Handles the paste event in an OTP input box.
   *
   * @private
   * @param {ClipboardEvent} e - The paste event triggered when the user pastes text into the input box.
   *
   * @remarks
   * This method processes the pasted text by:
   * 1. Preventing the default paste behavior.
   * 2. Applying the defined regex to the pasted text to ensure only valid characters are inserted.
   * 3. Inserting the processed text across multiple OTP boxes, starting from the currently focused box.
   *
   * If the `onPasteBlur` configuration is enabled (or left undefined), the input box is blurred after pasting.
   * Otherwise, the focus moves to the last box that receives a pasted character. After updating the values,
   * the overall OTP value is updated.
   */
  private onBoxPaste(e: ClipboardEvent) {
    // Prevent the default paste behavior
    e.preventDefault();

    // Get the pasted text and apply regex to ensure only valid characters are used
    const pastedText: string = e.clipboardData!.getData('text');
    const pastedValue = this.applyRegex(pastedText); // Apply filtering via regex

    // Determine the index of the currently focused input box
    const currentBoxIndex = this.getBoxIndex(e.target as HTMLInputElement);

    // Calculate the maximum number of boxes the pasted text can fill
    const maxLength = Math.min(
      this.config.boxCount - currentBoxIndex, // Remaining boxes from the current one
      pastedValue.length // Length of the pasted value
    );

    // Insert the pasted characters into the OTP boxes
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < maxLength; i++) {
      this.setBoxValue(currentBoxIndex + i, pastedValue[i]);
    }

    // Determine whether to blur the input box or focus the last one filled
    if (
      this.config.onPasteBlur === true ||
      this.config.onPasteBlur === undefined
    ) {
      (e.target as HTMLInputElement).blur(); // Blur the box after pasting
    } else {
      this.focusBox(currentBoxIndex + maxLength - 1); // Focus the last filled box
    }

    // Update the overall OTP value after pasting
    this.updateValue();
  }

  /**
   * Handles the focus event for an OTP input box.
   *
   * @private
   * @param {FocusEvent} e - The focus event triggered when the input box gains focus.
   *
   * @remarks
   * This method is called when an OTP input box is focused. If the current box already
   * contains a value (i.e., its length is 1), this method selects the existing value.
   * This allows users to easily overwrite the value if they wish to enter a new character.
   */
  // eslint-disable-next-line class-methods-use-this
  private onBoxFocus(e: FocusEvent) {
    // Check if the current box has a value of length 1
    if ((e.target as HTMLInputElement).value.length === 1) {
      // Set the start of the selection to the beginning
      (e.target as HTMLInputElement).selectionStart = 0;

      // Set the end of the selection to the end of the value
      (e.target as HTMLInputElement).selectionEnd = 1;
    }
  }

  /**
   * Handles the keydown event for an OTP input box.
   *
   * @private
   * @param {KeyboardEvent} e - The keydown event triggered when a key is pressed while the input box is focused.
   *
   * @remarks
   * This method captures key presses to provide custom navigation and deletion behavior within the OTP input boxes:
   * - Arrow keys allow the user to navigate between boxes.
   * - The Backspace key allows moving to the previous box if the current box is empty or the cursor is at the start.
   * - The Delete key allows moving to the next box if the current box is empty or if the user is trying to delete the only character.
   */
  private onBoxKeyDown(e: KeyboardEvent) {
    // Navigate to the previous box on ArrowLeft or ArrowUp key press
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); // Prevent default behavior
      this.focusPrevBox(e.target as HTMLInputElement); // Focus the previous box
    }

    // Navigate to the next box on ArrowRight or ArrowDown key press
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent default behavior
      this.focusNextBox(e.target as HTMLInputElement); // Focus the next box
    }

    // Handle Backspace key
    if (
      e.key === 'Backspace' &&
      // If box is empty or selection is at the start
      ((e.target as HTMLInputElement).value === '' ||
        (e.target as HTMLInputElement).selectionEnd === 0)
    ) {
      this.focusPrevBox(e.target as HTMLInputElement); // Move focus to the previous box
    }

    // Handle Delete key
    if (
      e.key === 'Delete' &&
      // If box is empty or selection covers the only character
      ((e.target as HTMLInputElement).value === '' ||
        ((e.target as HTMLInputElement).selectionStart !== 0 &&
          (e.target as HTMLInputElement).selectionEnd === 1))
    ) {
      this.focusNextBox(e.target as HTMLInputElement); // Move focus to the next box
    }
  }

  /**
   * Handles the input event for an OTP input box.
   *
   * @private
   * @param {InputEvent} e - The input event triggered when the value of the input box changes.
   *
   * @remarks
   * This method is called whenever a user inputs a character into an OTP input box.
   * It performs the following actions:
   * - Applies a regex to filter out unwanted characters.
   * - If the input box is not empty after filtering, it automatically focuses on the next box.
   * - Updates the overall value of the OTP field to reflect the current state.
   */
  private onBoxInput(e: Event) {
    // Replace unwanted values using the regex
    const updatedValue = this.applyRegex((e.target as HTMLInputElement).value);

    // Set the input box value to the filtered value
    (e.target as HTMLInputElement).value = updatedValue;

    // If the current box value is not empty, focus on the next box
    if ((e.target as HTMLInputElement).value !== '') {
      // Automatically focus the next input box
      this.focusNextBox(e.target as HTMLInputElement);
    }

    // Update the overall OTP value
    this.updateValue();
  }
}
