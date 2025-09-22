const persianMap: Record<string, string> = {
  آ: "a",
  ا: "a",
  ب: "b",
  پ: "p",
  ت: "t",
  ث: "s",
  ج: "j",
  چ: "ch",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "z",
  ر: "r",
  ز: "z",
  ژ: "zh",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "z",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "gh",
  ک: "k",
  گ: "g",
  ل: "l",
  م: "m",
  ن: "n",
  و: "v",
  ه: "h",
  ی: "y",
};

export function makeSlug(text: string): string {
  if (!text) return "";

  let slug = "";
  for (const char of text) {
    if (persianMap[char]) {
      slug += persianMap[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      slug += char.toLowerCase();
    } else {
      slug += "-";
    }
  }

  slug = slug.replace(/-+/g, "-");

  slug = slug.replace(/^-|-$/g, "");

  return slug.toLowerCase();
}
