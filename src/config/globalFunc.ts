const controlKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

export const restrictDigits = (e: any) => {
  var char = e.key;
  // restrict digits and special characters
  if (/^[^0-9!@#$%^&*()_+`~\-=\[\]{};':"\\|,.<>\/?]+$/.test(char)) {
    return true;
  }
  return e.preventDefault();
};

export const restrictEmailChars = (e: any) => {
  const char = e.key;
  // Define a regex pattern for valid email characters
  const emailCharPattern = /^[a-zA-Z0-9._%+-@]+$/;

  // Check if the character matches the allowed email characters
  if (emailCharPattern.test(char)) {
    return true; // Allow the character
  }

  // Prevent the default action for invalid characters
  return e.preventDefault();
};

export const restrictLetters = (e: any) => {
  const char = e.key;

  // Allow digits, special characters, backspace, delete, arrow keys, and tab
  if (
    /^[0-9]+$/.test(char) ||
    char === 'Backspace' ||
    char === 'Delete' ||
    char === 'ArrowLeft' ||
    char === 'ArrowRight' ||
    char === 'ArrowUp' ||
    char === 'ArrowDown' ||
    char === 'Tab'
  ) {
    return true; // Allow the character
  }

  // Prevent default for letters
  return e.preventDefault();
};

export const restrictSpecialChar = (e: any) => {
  var char = e.key;
  // restrict digits and special characters
  if (/^[^!@#$%^&*()_+`~\=\[\]{};':"\\|<>\/?]+$/.test(char)) {
    return true;
  }
  return e.preventDefault();
};

export const validateMobile = (e: KeyboardEvent, ref: any) => {
  const startDigit = ['6', '7', '8', '9'];

  const inputValue = ref.current.value;

  const isDigit = /^[0-9]$/.test(e.key);

  let predictedValue = inputValue;
  if (isDigit) {
    predictedValue += e.key;
  } else if (e.key === 'Backspace' && inputValue?.length > 0) {
    predictedValue = inputValue.slice(0, -1);
  }

  if ((!isDigit && !controlKeys.includes(e.key)) || (predictedValue?.length === 1 && !startDigit.includes(predictedValue[0]))) {
    e.preventDefault();
  }
};

export const validateNumberLength = (e: KeyboardEvent, ref: any, Nlength: number) => {
  const controlKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
  const isDigit = /^[0-9]$/.test(e.key);

  const inputValue = ref.current.value;

  let predictedValue = inputValue;

  if (isDigit) {
    predictedValue += e.key;
  } else if (e.key === 'Backspace' && inputValue.length > 0) {
    predictedValue = inputValue.slice(0, -1);
  }

  if ((!isDigit && !controlKeys.includes(e.key)) || predictedValue.length > Nlength) {
    e.preventDefault();
  }
};

export const handleCopyPaste = (event: any) => {
  event.preventDefault();
};
