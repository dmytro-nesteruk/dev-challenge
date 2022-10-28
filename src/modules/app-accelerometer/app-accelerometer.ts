import { EventEmitter } from '../event-emitter';
import roseIcon from '../../assets/icons/windrose.svg';

interface IAppAccelerometerProps {
  eventEmitter: EventEmitter;
}

export class AppAccelerometer {
  private eventEmitter: EventEmitter;
  private container: HTMLDivElement;
  private image: HTMLImageElement;
  private btn: HTMLButtonElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private angle: number;
  private fps: number;

  private initAnimation: number;

  constructor({ eventEmitter }: IAppAccelerometerProps) {
    this.eventEmitter = eventEmitter;
    this.container = document.createElement('div');
    this.angle = 0;
    this.fps = 0;
    this.initAnimation = 1;
    this.image = new Image(200);
    this.btn = document.createElement('button');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.init();
  }

  get element() {
    return this.container;
  }

  private init = () => {
    this.canvas.addEventListener('click', this.getPermissionAndSubscribe);
    this.image.src = roseIcon;

    this.image.onload = () => {
      this.initCanvas();
    };

    this.container.append(this.btn);
    this.container.append(this.canvas);
    this.initAnimation = requestAnimationFrame(this.drawRose);
  };

  private initCanvas = () => {
    this.canvas.width = 200;
    this.canvas.height = 200;
    this.canvas.style.border = '1px solid red';

    this.ctx.drawImage(this.image, 40, 40, 120, 120);
    this.ctx.font = '24px serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('N', 120 - 20, 32);
    this.ctx.fillText('S', 120 - 20, 200 - 18);
    this.ctx.fillText('W', 24, 120 - 12);
    this.ctx.fillText('E', 200 - 28, 120 - 12);
  };

  private drawRose = () => {
    this.ctx.save();

    this.ctx.clearRect(0, 0, 200, 200);
    this.ctx.translate(100, 100);
    this.ctx.rotate(this.angle);
    this.ctx.translate(-100, -100);

    this.ctx.drawImage(this.image, 40, 40, 120, 120);
    this.ctx.font = '24px serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('N', 120 - 20, 32);
    this.ctx.fillText('S', 120 - 20, 200 - 18);
    this.ctx.fillText('W', 24, 120 - 12);
    this.ctx.fillText('E', 200 - 28, 120 - 12);

    this.ctx.restore();
    if (this.initAnimation) {
      this.angle += 0.01;
    }
    this.initAnimation = requestAnimationFrame(this.drawRose);
  };

  getPermissionAndSubscribe = () => {
    this.eventEmitter.notifySubscribers('DANGER_SUBMIT_CLICK', '');

    if (DeviceMotionEvent && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission();
      window.addEventListener('deviceorientation', this.calc);
      cancelAnimationFrame(this.initAnimation);
      requestAnimationFrame(this.drawRose);
    } else {
      console.log('Not supported');
    }
  };

  private calc = (e: DeviceOrientationEvent) => {
    this.fps += 1;
    if (this.fps <= 10) return;
    const { alpha, beta, gamma } = e;
    if (!alpha || !beta || !gamma) return;
    this.angle = this.compassHeading(alpha, beta, gamma);
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

    return compassHeading; // Compass Heading
  }
}
