import { z } from "zod";

export const ThemeObject = z
  .object({
    "colors-gray1": z.string(),
    "colors-gray2": z.string(),
    "colors-gray3": z.string(),
    "colors-gray4": z.string(),
    "colors-gray5": z.string(),
    "colors-gray6": z.string(),
    "colors-gray7": z.string(),
    "colors-gray8": z.string(),
    "colors-gray9": z.string(),
    "colors-gray10": z.string(),
    "colors-gray11": z.string(),
    "colors-gray12": z.string(),
    "colors-primary1": z.string(),
    "colors-primary2": z.string(),
    "colors-primary3": z.string(),
    "colors-primary4": z.string(),
    "colors-primary5": z.string(),
    "colors-primary6": z.string(),
    "colors-primary7": z.string(),
    "colors-primary8": z.string(),
    "colors-primary9": z.string(),
    "colors-primary10": z.string(),
    "colors-accent1": z.string(),
    "colors-accent2": z.string(),
    "colors-accent3": z.string(),
    "colors-accent4": z.string(),
    "colors-accent5": z.string(),
    "colors-accent6": z.string(),
    "colors-accent7": z.string(),
    "colors-accent8": z.string(),
    "colors-accent9": z.string(),
    "colors-accent10": z.string(),
    "colors-accent11": z.string(),
    "colors-accent12": z.string(),
    "colors-danger1": z.string(),
    "colors-danger2": z.string(),
    "colors-danger3": z.string(),
    "colors-danger4": z.string(),
    "colors-danger5": z.string(),
    "colors-danger6": z.string(),
    "colors-danger7": z.string(),
    "colors-danger8": z.string(),
    "colors-danger9": z.string(),
    "colors-danger10": z.string(),
    "colors-danger11": z.string(),
    "colors-danger12": z.string(),
    "colors-success1": z.string(),
    "colors-success2": z.string(),
    "colors-success3": z.string(),
    "colors-success4": z.string(),
    "colors-success5": z.string(),
    "colors-success6": z.string(),
    "colors-success7": z.string(),
    "colors-success8": z.string(),
    "colors-success9": z.string(),
    "colors-success10": z.string(),
    "colors-success11": z.string(),
    "colors-success12": z.string(),
    "colors-warning1": z.string(),
    "colors-warning2": z.string(),
    "colors-warning3": z.string(),
    "colors-warning4": z.string(),
    "colors-warning5": z.string(),
    "colors-warning6": z.string(),
    "colors-warning7": z.string(),
    "colors-warning8": z.string(),
    "colors-warning9": z.string(),
    "colors-warning10": z.string(),
    "colors-warning11": z.string(),
    "colors-warning12": z.string(),
    "colors-info1": z.string(),
    "colors-info2": z.string(),
    "colors-info3": z.string(),
    "colors-info4": z.string(),
    "colors-info5": z.string(),
    "colors-info6": z.string(),
    "colors-info7": z.string(),
    "colors-info8": z.string(),
    "colors-info9": z.string(),
    "colors-info10": z.string(),
    "colors-info11": z.string(),
    "colors-info12": z.string(),
    "colors-black": z.string(),
    "colors-white": z.string(),
    "colors-layer1": z.string(),
    "colors-layer2": z.string(),
    "colors-layer3": z.string(),
    "colors-layer4": z.string(),
    "colors-layer5": z.string(),
    "colors-shadow": z.string(),
    space1: z.string(),
    space2: z.string(),
    space3: z.string(),
    space4: z.string(),
    space5: z.string(),
    space6: z.string(),
    space7: z.string(),
    space8: z.string(),
    space9: z.string(),
    space10: z.string(),
    space11: z.string(),
    space12: z.string(),
    "fontSize-extraLargeHeading": z.string(),
    "fontSize-largeHeading": z.string(),
    "fontSize-mediumHeading": z.string(),
    "fontSize-smallHeading": z.string(),
    "fontSize-extraSmallHeading": z.string(),
    "fontSize-largeText": z.string(),
    "fontSize-mediumText": z.string(),
    "fontSize-smallText": z.string(),
    "fontSize-extraSmallText": z.string(),
    "letterSpacing-extraLargeHeading": z.string(),
    "letterSpacing-largeHeading": z.string(),
    "letterSpacing-mediumHeading": z.string(),
    "letterSpacing-smallHeading": z.string(),
    "letterSpacing-extraSmallHeading": z.string(),
    "letterSpacing-largeText": z.string(),
    "letterSpacing-mediumText": z.string(),
    "letterSpacing-smallText": z.string(),
    "letterSpacing-extraSmallText": z.string(),
    "lineHeight-extraLargeHeading": z.string(),
    "lineHeight-largeHeading": z.string(),
    "lineHeight-mediumHeading": z.string(),
    "lineHeight-smallHeading": z.string(),
    "lineHeight-extraSmallHeading": z.string(),
    "lineHeight-largeText": z.string(),
    "lineHeight-mediumText": z.string(),
    "lineHeight-smallText": z.string(),
    "lineHeight-extraSmallText": z.string(),
    "fontWeight-extraLargeHeading": z.number(),
    "fontWeight-largeHeading": z.number(),
    "fontWeight-mediumHeading": z.number(),
    "fontWeight-smallHeading": z.number(),
    "fontWeight-extraSmallHeading": z.number(),
    "fontWeight-largeText": z.number(),
    "fontWeight-mediumText": z.number(),
    "fontWeight-smallText": z.number(),
    "fontWeight-extraSmallText": z.number(),
    "fontFamily-sans": z.string(),
    "fontFamily-serif": z.string(),
    "fontFamily-heading": z.string(),
    "fontFamily-text": z.string(),
    "radius-none": z.string(),
    "radius-sm": z.string(),
    "radius-md": z.string(),
    "radius-lg": z.string(),
    "radius-xl": z.string(),
    "radius-2xl": z.string(),
    "radius-3xl": z.string(),
    "radius-4xl": z.string(),
    "radius-full": z.string(),
  })
  .partial();

export const ThemeResponsive = z.object({
  mobile: ThemeObject,
  desktop: ThemeObject,
});

export const Theme = z.union([ThemeObject, ThemeResponsive]);

export type TTheme = z.infer<typeof Theme>;
