import { applyReducerHash } from '../../Utilities/ReducerRegistry';
import notificationsReducer, { defaultState as notificationsDefault } from './notifications/notifications';

const notifications = applyReducerHash(notificationsReducer, notificationsDefault);

export { notifications };
