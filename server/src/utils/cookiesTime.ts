import ms from "ms";

export const parseDuration = (value: string) =>
  ms(value as unknown as ms.StringValue);
