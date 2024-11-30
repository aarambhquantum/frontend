import Typography from '@atoms/typography/Typography';
import { BODY_1, CAPTION, H1, H2, H3, H4, LABEL, SUBTITLE, WEIGHT_BOLD } from '@shared/constants/material-ui/Typography';

export const TypographyPage = () => {
  return (
    <>
      <Typography variant={H1} fontWeight={WEIGHT_BOLD}>
        Heading - H1
      </Typography>
      <Typography variant={H2}>
        Heading - H2
      </Typography>
      <Typography variant={H3}>
        Heading - H3
      </Typography>
      <Typography variant={H4}>
        Heading - H4
      </Typography>
      <Typography variant={SUBTITLE}>
        Subtitle
      </Typography>
      <Typography variant={BODY_1}>
        Body - 1
      </Typography>
      <Typography variant={LABEL}>
        Label
      </Typography>
      <Typography variant={CAPTION}>
        Caption
      </Typography>
    </>
  )
};
