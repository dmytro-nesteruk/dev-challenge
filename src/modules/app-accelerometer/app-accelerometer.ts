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
    if (DeviceMotionEvent && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission();
      window.addEventListener('devicemotion', this.update);
    } else {
      console.log('Not supported');
    }
  };

  private update = (e: DeviceMotionEvent) => {
    console.log('updated');
    console.log(e.acceleration?.x);
    console.log(e.acceleration?.y);
    console.log(e.acceleration?.z);

    this.container.innerText = e.acceleration?.x?.toString() as string;
  };
}