# OTP Field Package

A customizable and easy-to-use OTP (One-Time Password) input field component for web applications. This package allows seamless integration of an OTP input field, with support for various features such as validation, theming, and accessibility.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [License](#license)

## Features

1. `Configurable box count`: Define the number of input boxes for the OTP field.
2. `Input validation`: Restricts input to single characters and validates them based on the configured value - type (numeric, alphabetic, alphabetic lower, alphabetic upper, alphanumeric, alphanumeric lower, alphanumeric upper) or a custom regular expression.
3. `User interaction handling`: Manages user interactions like input, paste, and keyboard events for smooth navigation and value management within the input boxes.
4. `Focus management`: Automatically focuses on the appropriate input box based on user actions.
5. `Clear function`: Clears all input boxes and resets the internal state.
6. `Destroy function`: Removes the OTP field element from the DOM.

## Installation

- Install the package via npm:

  ```sh
  npm i @satyam-seth/otp-field
  ```

- Install the package via npm:

  ```sh
  yarn add @satyam-seth/otp-field
  ```

## Usage

1. Import the `OTPField` class:

```typescript
import { OTPField } from 'otp-field';
```

2. Define the configuration for your OTP field:

```typescript
const otpFieldConfig = {
  namespace: 'otp', // Namespace for IDs (used for styling)
  boxCount: 6, // Number of input boxes
  // valueType: OTPValueType.NUMERIC, // Input type (numeric, alphabetic, alphanumeric)
  // customRegex: /your_custom_regex/, // Custom validation regex
  // onPasteBlur: true, // Blur the input box after pasting (default: true)
};
```

3. Create an instance of the OTPField class with the configuration:

```typescript
const otpField = new OTPField(otpFieldConfig);
```

4. Build the OTP field and append it to the desired element in your DOM:

```typescript
const containerElement = document.getElementById('otp-container');
otpField.build(containerElement);
```

5. Access the current OTP value entered by the user:

```typescript
const otpValue = otpField.value;
```

6. SCSS import for styling:

```scss
@import '../../node_modules/@satyam-seth/otp-field/src/scss/field';

@include otp-field;
```

- Note: You can apply CSS classes like `error`, `success`, and `warning` to the `div.otp-field` container for state-specific theming.

## API Reference

- `value`: Retrieves the current value of the OTP input field.
- `id`: Gets the unique identifier for the OTP field.
- `element`: Gets the DOM element associated with the OTP field.
- `focus()`: Sets focus on the first empty OTP input box. If all boxes are filled, focus is set to the last box.
- `clear()`: Clears all OTP input boxes and resets the stored field value.
- `build(parentElement: HTMLElement)`: Builds the OTP field and appends it to the specified parent element.
- `destroy()`: Removes the OTP field element from the DOM.

## License

This package is licensed under the MIT License. See the [LICENSE](https://github.com/satyam-seth/otp-field/blob/main/LICENSE) file for details.

## Contributing

Feel free to open issues or submit pull requests for improvements or bug fixes!
