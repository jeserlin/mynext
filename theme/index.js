import { createMuiTheme } from '@material-ui/core/styles';

import typography from './typography';
import palette from './palette';
import mixins from './mixins';

export default createMuiTheme({
  typography,
  palette,
  mixins,
  spacing: 4,
});
