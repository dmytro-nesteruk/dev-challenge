export enum EventEmitterEvents {
  'DANGER_TYPE_CHANGED' = 'DANGER_TYPE_CHANGED',
  'DANGER_SUBMIT_CLICK' = 'DANGER_SUBMIT_CLICK',
}
export type EventEmitterEventsTypes = keyof typeof EventEmitterEvents;

interface ISubscriber {
  event: EventEmitterEventsTypes;
  callback: (data?: any) => void;
}
export class EventEmitter {
  subscribers: Array<ISubscriber>;
  constructor() {
    this.subscribers = [];
  }

  subscribe = (subscriber: ISubscriber) => {
    this.subscribers.push(subscriber);
  };

  notifySubscribers = (event: EventEmitterEventsTypes, data: any) => {
    if (this.subscribers.length) {
      this.subscribers.forEach((subscriber) => {
        if (subscriber.event === event) {
          subscriber.callback(data);
        }
      });
    }
  };

  unsubscribe = (subscriber: ISubscriber) => {
    if (this.subscribers.length) {
      this.subscribers.filter(({ event, callback }) => {
        return event !== subscriber.event && callback !== subscriber.callback;
      });
    }
  };
}
