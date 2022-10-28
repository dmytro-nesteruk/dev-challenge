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
      this.accelerometer.start();
      this.eventEmitter.notifySubscribers('DANGER_TYPE_CHANGED', 'text');
    } else {
      console.log('Accelerometer not supported');
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.update);
    } else {
      console.log('Not supported');
    }
  };

  private update = (e: DeviceMotionEvent) => {
    this.container.innerText = e.acceleration?.x?.toString() as string;
  };
}
