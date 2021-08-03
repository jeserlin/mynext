import { createMuiTheme } from '@material-ui/core/styles';

import typography from './typography';
import palette from './palette';
import mixins from './mixins';
import shadows from './shadows';

export default createMuiTheme({
  typography,
  palette,
  mixins,
  shadows,
  spacing: 4,
});
