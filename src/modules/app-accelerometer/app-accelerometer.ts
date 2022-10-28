import { EventEmitter } from '../event-emitter';

interface IAppAccelerometerProps {
  eventEmitter: EventEmitter;
}
export class AppAccelerometer {
  private eventEmitter: EventEmitter;
  private container: HTMLDivElement;
  private accelerometer: Accelerometer | undefined;
  constructor({ eventEmitter }: IAppAccelerometerProps) {
    this.eventEmitter = eventEmitter;
    this.container = document.createElement('div');
    this.accelerometer = undefined;
    this.init();
  }

  get element() {
    return this.container;
  }

  private init = () => {
    if ('Accelerometer' in window) {
      this.accelerometer = new Accelerometer();
      this.accelerometer.addEventListener('reading', () => this.update());
      this.accelerometer.start();
      this.eventEmitter.notifySubscribers('DANGER_TYPE_CHANGED', 'text');
    }
  };

  private update = () => {
    if (this.accelerometer) {
      this.container.innerText = this.accelerometer.x?.toString() as string;
    }
  };
}
