export class MiddlewareListener {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners: any;
  constructor() {
    this.listeners = new Set();
  }

  getListeners() {
    return this.listeners;
  }

  getMiddleware() {
    return () => (next: (arg0: { type: string; payload: any }) => void) => (action) => {
      const preventBubble = this.callOnAction(action.type, action.payload);
      if (preventBubble) {
        next({ type: '@@config/action-stopped', payload: action });
      } else {
        next(action);
      }
    };
  }

  addNew(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  callOnAction(action, data) {
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
