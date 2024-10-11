import { LinkProps, useNavigate } from 'react-router-dom';
import { buildInsightsPath } from '../helpers/urlPathHelpers';

const useInsightsNavigate = (app: string, forcePreview?: boolean) => {
  // FIXME: These are circular dependencies and have to be removed
  // FIXME: The hooks should be moved to a different package!
  const navigate = useNavigate();
  // eslint-disable-next-line rulesdir/no-chrome-api-call-from-window
  const chrome = window.insights.chrome;

  return (to: LinkProps['to'], preview?: boolean) => navigate(buildInsightsPath(chrome, app, to, preview || forcePreview));
};

export default useInsightsNavigate;
