import { EventEmitter } from '../event-emitter';

interface IAppAccelerometerProps {
  eventEmitter: EventEmitter;
}
export class AppAccelerometer {
  private eventEmitter: EventEmitter;
  private container: HTMLDivElement;
  constructor({ eventEmitter }: IAppAccelerometerProps) {
    this.eventEmitter = eventEmitter;
    this.container = document.createElement('div');
    this.init();
  }

  get element() {
    return this.container;
  }

  private init = () => {
    if ('Accelerometer' in window) {
      const accelerometer = new Accelerometer();
      accelerometer.onreading = (e) => console.log(e);
      accelerometer.start();
    }
  };

  private update = (e: DeviceMotionEvent) => {
    console.log(e);
    this.container.innerText = e.acceleration?.x?.toString() as string;
  };
}
