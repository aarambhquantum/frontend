import { Typography as MUITypography } from "@mui/material";
import { type TypographyProps } from "@mui/material/Typography/Typography";
import { COLOR_PRIMARY } from "@shared/constants/material-ui";
import React from "react";

interface Props extends TypographyProps {
  className?: string;
}

const Typography = ({
  children,
  className,
  ...rest
}: Props): React.ReactElement => {
  return (
    <MUITypography color={COLOR_PRIMARY} {...rest} classes={{ root: className }} >
      {children}
    </MUITypography>
  );
};

export default Typography;
