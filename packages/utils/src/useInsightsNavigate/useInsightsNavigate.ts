// @ts-ignore
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { buildInsightsPath } from '../helpers/urlPathHelpers';

const useInsightsNavigate = (app: string) => {
  const navigate = useNavigate();
  const chrome = useChrome();

  return (to: any) => navigate(buildInsightsPath(chrome, app, to));
};

export default useInsightsNavigate;
