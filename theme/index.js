import { createTheme } from '@mui/material/styles';

import typography from './typography';
import palette from './palette';
import mixins from './mixins';
import shadows from './shadows';

export default createTheme({
  palette,
  typography,
  mixins,
  shadows,
  spacing: 4,
});
