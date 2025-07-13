import { createTranslator } from "@mioto/locale";
import de from "@mioto/locale/de" with { type: "json" };

export const t = createTranslator({ locale: "de", messages: de });
