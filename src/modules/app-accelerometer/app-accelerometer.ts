import { EventEmitter } from '../event-emitter';

interface IAppAccelerometerProps {
  eventEmitter: EventEmitter;
}

export class AppAccelerometer {
  private eventEmitter: EventEmitter;
  private container: HTMLDivElement;
  private btn: HTMLButtonElement;
  constructor({ eventEmitter }: IAppAccelerometerProps) {
    this.eventEmitter = eventEmitter;
    this.container = document.createElement('div');
    this.btn = document.createElement('button');
    this.btn.innerText = 'click';
    this.btn.addEventListener('click', this.init);
    this.container.append(this.btn);
  }

  get element() {
    return this.container;
  }

  private init = () => {
    this.eventEmitter.notifySubscribers('DANGER_TYPE_CHANGED', 'sd');
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
