import * as muiconst from "@shared/constants/material-ui/Typography";

export type ALIGN =
  | typeof muiconst.ALIGN_CENTER
  | typeof muiconst.ALIGN_LEFT
  | typeof muiconst.ALIGN_RIGHT;

export type HEADING_VARIANTS = typeof muiconst.H1 | typeof muiconst.H2 | typeof muiconst.H3 | typeof muiconst.H4;
export type SUBTITLE_VARIANTS = typeof muiconst.SUBTITLE;
export type BODY_VARIANTS = typeof muiconst.BODY_1 | typeof muiconst.BODY_2 | typeof muiconst.BODY_NOTES;
export type LABEL_VARIANTS = typeof muiconst.LABEL;
export type CAPTION_VARIANTS = typeof muiconst.CAPTION;
export type VARIANTS = BODY_VARIANTS | LABEL_VARIANTS | CAPTION_VARIANTS;

export type WEIGHTS =
  | typeof muiconst.WEIGHT_LIGHT
  | typeof muiconst.WEIGHT_REGULAR
  | typeof muiconst.WEIGHT_MEDIUM
  | typeof muiconst.WEIGHT_SEMI_BOLD
  | typeof muiconst.WEIGHT_BOLD;

export type COLORS =
  | typeof muiconst.COLOR_PRIMARY
  | typeof muiconst.COLOR_LIGHT
  | typeof muiconst.COLOR_DARK
  | typeof muiconst.COLOR_DARKER