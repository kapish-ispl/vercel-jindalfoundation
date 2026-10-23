import React from 'react';

const controlKeys: string[] = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

export const restrictDigits = (e: React.KeyboardEvent<HTMLInputElement>): boolean => {
  const char = e.key;
  if (controlKeys.includes(char)) {
    return true;
  }
  if (!/^[0-9]$/.test(char)) {
    e.preventDefault();
    return false;
  }
  return true;
};

export const restrictEmailChars = (e: React.KeyboardEvent<HTMLInputElement>): boolean => {
  const char = e.key;
  const emailCharPattern = /^[a-zA-Z0-9._%+-@]$/;

  if (controlKeys.includes(char)) {
    return true;
  }
  if (!emailCharPattern.test(char)) {
    e.preventDefault();
    return false;
  }
  return true;
};

export const restrictLetters = (e: React.KeyboardEvent<HTMLInputElement>): boolean => {
  const char = e.key;
  if (/^[0-9]$/.test(char) || controlKeys.includes(char) || char === 'ArrowUp' || char === 'ArrowDown') {
    return true;
  }

  e.preventDefault();
  return false;
};

export const restrictSpecialChar = (e: React.KeyboardEvent<HTMLInputElement>): boolean => {
  const char = e.key;
  if (controlKeys.includes(char)) {
    return true;
  }
  if (!/^[^!@#$%^&*()_+`~=\[\]{};':"\\|<>\/?]+$/.test(char)) {
    e.preventDefault();
    return false;
  }
  return true;
};

export const validateMobile = (e: React.KeyboardEvent<HTMLInputElement | null>, ref: React.RefObject<HTMLInputElement | null>): void => {
  if (!ref.current) return;

  const startDigits = ['6', '7', '8', '9'];
  const inputValue = ref.current.value;
  const isDigit = /^[0-9]$/.test(e.key);

  let predictedValue = inputValue;
  if (isDigit) {
    predictedValue += e.key;
  }

  if ((!isDigit && !controlKeys.includes(e.key)) || (predictedValue.length === 1 && !startDigits.includes(predictedValue[0]))) {
    e.preventDefault();
  }
};

export const validateNumberLength = (e: React.KeyboardEvent<HTMLInputElement>, ref: React.RefObject<HTMLInputElement>, maxLength: number): void => {
  if (!ref.current) return;

  const isDigit = /^[0-9]$/.test(e.key);
  const inputValue = ref.current.value;

  if (isDigit && inputValue.length >= maxLength) {
    e.preventDefault();
    return;
  }

  if (!isDigit && !controlKeys.includes(e.key)) {
    e.preventDefault();
  }
};
export const handleCopyPaste = (event: React.ClipboardEvent<HTMLInputElement>): void => {
  event.preventDefault();
};
