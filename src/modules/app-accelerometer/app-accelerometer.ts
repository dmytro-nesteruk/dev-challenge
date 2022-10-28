import { EventEmitter } from '../event-emitter';
import roseIcon from '../../assets/icons/windrose.svg';

interface IAppAccelerometerProps {
  eventEmitter: EventEmitter;
}

export class AppAccelerometer {
  private eventEmitter: EventEmitter;
  private container: HTMLDivElement;
  private btn: HTMLButtonElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor({ eventEmitter }: IAppAccelerometerProps) {
    this.eventEmitter = eventEmitter;
    this.container = document.createElement('div');
    this.btn = document.createElement('button');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.init();
  }

  get element() {
    return this.container;
  }

  private init = () => {
    this.btn.innerText = 'Start';
    this.btn.addEventListener('click', this.getPermissionAndSubscribe);

    this.initCanvas();

    this.container.append(this.btn);
    this.container.append(this.canvas);
  };

  private initCanvas = () => {
    this.canvas.width = 200;
    this.canvas.height = 200;
    this.canvas.style.border = '1px solid red';

    const image = new Image(120, 120);
    image.src = roseIcon;

    image.onload = () => {
      this.ctx.drawImage(image, 40, 40, 120, 120);
      this.ctx.font = '24px serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('N', 120 - 20, 32);
      this.ctx.fillText('S', 120 - 20, 200 - 18);
      this.ctx.fillText('W', 24, 120 - 12);
      this.ctx.fillText('E', 200 - 28, 120 - 12);
    };
  };

  getPermissionAndSubscribe = () => {
    this.eventEmitter.notifySubscribers('DANGER_SUBMIT_CLICK', '');

    if (DeviceMotionEvent && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission();
      window.addEventListener('deviceorientation', this.update);
    } else {
      console.log('Not supported');
    }
  };

  private update = (e: DeviceOrientationEvent) => {
    const { alpha, beta, gamma } = e;
    if (!alpha || !beta || !gamma) return;
    const deg = this.compassHeading(alpha, beta, gamma);
    this.ctx.rotate(deg);
  };

  compassHeading(alpha: number, beta: number, gamma: number) {
    const degtorad = Math.PI / 180; // Degree-to-Radian conversion

    const _x = beta ? beta * degtorad : 0; // beta value
    const _y = gamma ? gamma * degtorad : 0; // gamma value
    const _z = alpha ? alpha * degtorad : 0; // alpha value

    const cY = Math.cos(_y);
    const cZ = Math.cos(_z);
    const sX = Math.sin(_x);
    const sY = Math.sin(_y);
    const sZ = Math.sin(_z);

    // Calculate Vx and Vy components
    const Vx = -cZ * sY - sZ * sX * cY;
    const Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    let compassHeading = Math.atan(Vx / Vy);

    // Convert compass heading to use whole unit circle
    if (Vy < 0) {
      compassHeading += Math.PI;
    } else if (Vx < 0) {
      compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
  }
}
