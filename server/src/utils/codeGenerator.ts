export type CodeOptions = {
  prefix?: "ORD" | "TIC";
  includeDate?: boolean;
  length?: number;
  onlyNumbers?: boolean;
};

export class CodeGenerator {
  static generate(options: CodeOptions = {}): string {
    const {
      prefix,
      includeDate = true,
      length = 6,
      onlyNumbers = true,
    } = options;

    let codeParts: string[] = [];

    if (prefix) {
      codeParts.push(prefix);
    }

    if (includeDate) {
      const now = new Date();
      const dateStr = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("");
      codeParts.push(dateStr);
    }

    const chars = onlyNumbers
      ? "0123456789"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let randomStr = "";
    for (let i = 0; i < length; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codeParts.push(randomStr);

    return codeParts.join("-");
  }
}
