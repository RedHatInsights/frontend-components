import { AnyAction, Dispatch } from 'redux';

export type Listener<T = any> = {
  callback: (data: { data: T; preventBubble: () => boolean }) => void;
  on: string;
};
export class MiddlewareListener {
  listeners: Set<Listener>;
  constructor() {
    this.listeners = new Set<Listener>();
  }

  getListeners() {
    return this.listeners;
  }

  getMiddleware() {
    return () => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
      const preventBubble = this.callOnAction(action.type, action.payload);
      if (preventBubble) {
        next({ type: '@@config/action-stopped', payload: action });
      } else {
        next(action);
      }
    };
  }

  addNew(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  callOnAction(action: string, data: unknown) {
    let stopBubble = false;
    const preventBubble = () => (stopBubble = true);
    const listeners = Array.from(this.listeners);
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].on === action && listeners[i].callback({ data, preventBubble });
    }

    return stopBubble;
  }
}

export default MiddlewareListener;
