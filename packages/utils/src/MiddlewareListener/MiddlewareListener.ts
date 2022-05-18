import { Dispatch, AnyAction } from 'redux';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class MiddlewareListener {
  [x: string]: any;
  constructor() {
    this.listeners = new Set();
  }

  getListeners() {
    return this.listeners;
  }

  getMiddleware() {
    return () => (next: Dispatch<AnyAction>) => (action: { type: any; payload: any }) => {
      const preventBubble = this.callOnAction(action.type, action.payload);
      if (preventBubble) {
        next({ type: '@@config/action-stopped', payload: action });
      } else {
        next(action);
      }
    };
  }

  addNew(listener: Record<string, never>) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  callOnAction(action: any, data: any) {
    let stopBubble = false;
    const preventBubble = () => (stopBubble = true);
    const listeners = Array.from(this.listeners);
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].on === action && listeners[i].hasOwnProperty('callback') && listeners[i].callback({ data, preventBubble });
    }

    return stopBubble;
  }
}

export default MiddlewareListener;
