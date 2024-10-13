import { OTPValueType } from '../utils/types';

export interface OTPFieldConfig {
  namespace: string;

  boxCount: number;

  onPasteBlur?: boolean;

  valueType?: OTPValueType;

  customRegex?: RegExp;
}
