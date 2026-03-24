export interface FormControl<T> {
  value: T;
  setValue(val: T): void;
}

export function createFormControl<T>(initial: T): FormControl<T> {
  let value = initial;

  return {
    get value() {
      return value;
    },
    setValue(val: T) {
      value = val;
    },
  };
}
