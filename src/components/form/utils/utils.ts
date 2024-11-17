type ValidatorFunction = (
  value: string,
  formData?: Record<string, any>
) => string;

export const required =
  (errorMessage?: string): ValidatorFunction =>
  (value: string): string =>
    value?.length > 0 ? "" : errorMessage || "Required";

export const min =
  (minValue: number, errorMessage?: string): ValidatorFunction =>
  (value: string): string =>
    value.length >= minValue
      ? ""
      : errorMessage || `Must be at least ${minValue} characters long`;

export const max =
  (maxValue: number, errorMessage?: string): ValidatorFunction =>
  (value: string): string =>
    value.length <= maxValue
      ? ""
      : errorMessage || `Must be at most ${maxValue} characters long`;

export const email =
  (errorMessage?: string): ValidatorFunction =>
  (value: string): string =>
    new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ).test(value)
      ? ""
      : errorMessage || "Please enter a valid email";

export const crossCheck =
  (
    func: (value: string, refValue?: string) => boolean,
    refField: string,
    message: string
  ): ValidatorFunction =>
  (value: string, formData?: Record<string, any>): string =>
    func(value, formData?.[refField]) ? "" : message;
