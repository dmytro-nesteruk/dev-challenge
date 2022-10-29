import { EventEmitter } from '../event-emitter';
import roseIcon from '../../assets/icons/windrose.svg';

interface IAppAccelerometerProps {
  eventEmitter: EventEmitter;
}
type Quaternion = [number, number, number, number];
const DOE = DeviceOrientationEvent as any;
const DME = DeviceMotionEvent as any;

export class AppAccelerometer {
  private eventEmitter: EventEmitter;
  private container: HTMLDivElement;
  private image: HTMLImageElement;
  private btn: HTMLButtonElement;
  private canvas: HTMLCanvasElement;
  private textEl: HTMLSpanElement;
  private ctx: CanvasRenderingContext2D;
  private angle: number;
  private rotation: number;

  private initAnimation: number;

  constructor({ eventEmitter }: IAppAccelerometerProps) {
    this.eventEmitter = eventEmitter;
    this.container = document.createElement('div');
    this.angle = 0;
    this.rotation = 0;
    this.initAnimation = 1;
    this.image = new Image(200);
    this.btn = document.createElement('button');
    this.canvas = document.createElement('canvas');
    this.textEl = document.createElement('span');
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
    this.container.append(this.textEl);
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

    if (DOE) {
      const isSafari = typeof DOE.requestPermission === 'function';

      if (isSafari) {
        DOE.requestPermission();
      }

      window.addEventListener('deviceorientation', this.handleOrientation);
      cancelAnimationFrame(this.initAnimation);
      requestAnimationFrame(this.drawRose);
    } else {
      console.log('Not supported');
    }

    if (DME) {
      const isSafari = typeof DME.requestPermission === 'function';
      if (isSafari) {
        DOE.requestPermission();
      }

      window.addEventListener('devicemotion', this.handleMotion);
    }
  };

  private handleOrientation = (e: DeviceOrientationEvent) => {
    const isAbsolute = e.absolute || 'webkitCompassHeading' in e;

    if (!isAbsolute) {
      console.log('Your browser or device not support absolute orientation');
    }

    const event = e as DeviceOrientationEvent & { webkitCompassHeading: number };
    const heading = event.webkitCompassHeading != null ? 360 - event.webkitCompassHeading : event.alpha;

    if ('screen' in window && 'orientation' in window.screen) {
      const orientatiionAngle = window.screen.orientation.angle;
      const quaternion = this.toQuaternion(heading, e.beta, e.gamma);

      this.angle = this.fromQuaternionToCompassHeading(this.deviceToScreen(quaternion, orientatiionAngle));
      return;
    } else {
      // if (this.rotation) {
      //   const quaternion = this.toQuaternion(heading, e.beta, e.gamma);

      //   this.angle = this.fromQuaternionToCompassHeading(this.deviceToScreen(quaternion, this.rotation));
      //   return;
      // }
      this.angle = (heading as number) * (Math.PI / 180);
      return;
    }
  };

  private handleMotion = (e: DeviceMotionEvent) => {
    if (e.rotationRate?.alpha && e.interval) {
      this.rotation = this.rotation + e.rotationRate.alpha;
    }
    const text = `alpha: ${this.rotation}`;

    this.textEl.innerText = text;
  };

  toQuaternion = (alpha: number | null, beta: number | null, gamma: number | null): Quaternion => {
    const degToRad = Math.PI / 180;

    const x = (beta || 0) * degToRad;
    const y = (gamma || 0) * degToRad;
    const z = (alpha || 0) * degToRad;

    const cZ = Math.cos(z * 0.5);
    const sZ = Math.sin(z * 0.5);
    const cY = Math.cos(y * 0.5);
    const sY = Math.sin(y * 0.5);
    const cX = Math.cos(x * 0.5);
    const sX = Math.sin(x * 0.5);

    const qx = sX * cY * cZ - cX * sY * sZ;
    const qy = cX * sY * cZ + sX * cY * sZ;
    const qz = cX * cY * sZ + sX * sY * cZ;
    const qw = cX * cY * cZ - sX * sY * sZ;

    return [qx, qy, qz, qw];
  };

  toCompassHeading(alpha: number | null, beta: number | null, gamma: number | null) {
    const degToRad = Math.PI / 180;

    const x = (beta || 0) * degToRad;
    const y = (gamma || 0) * degToRad;
    const z = (alpha || 0) * degToRad;

    const cY = Math.cos(y);
    const cZ = Math.cos(z);
    const sX = Math.sin(x);
    const sY = Math.sin(y);
    const sZ = Math.sin(z);

    const Vx = -cZ * sY - sZ * sX * cY;
    const Vy = -sZ * sY + cZ * sX * cY;

    let compassHeading = Math.atan(Vx / Vy);

    if (Vy < 0) {
      compassHeading += Math.PI;
    } else if (Vx < 0) {
      compassHeading += 2 * Math.PI;
    }

    return compassHeading;
  }

  fromQuaternionToCompassHeading(q: Quaternion) {
    let compassHeading = Math.atan2(2 * q[0] * q[1] + 2 * q[2] * q[3], 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]);

    if (compassHeading < 0) compassHeading = Math.PI * 2 + compassHeading;

    return compassHeading;
  }

  deviceToScreen(quaternion: Quaternion, orientationAngle: number) {
    return this.rotateQuaternionByAxisAngle(quaternion, [0, 0, 1], -orientationAngle * (Math.PI / 180)) as Quaternion;
  }

  rotateQuaternionByAxisAngle(quat: Quaternion, axis: [number, number, number], angle: number) {
    const sHalfAngle = Math.sin(angle / 2);
    const cHalfAngle = Math.cos(angle / 2);

    const transformQuat = [axis[0] * sHalfAngle, axis[1] * sHalfAngle, axis[2] * sHalfAngle, cHalfAngle] as Quaternion;

    function multiplyQuaternion(a: Quaternion, b: Quaternion) {
      const qx = a[0] * b[3] + a[3] * b[0] + a[1] * b[2] - a[2] * b[1];
      const qy = a[1] * b[3] + a[3] * b[1] + a[2] * b[0] - a[0] * b[2];
      const qz = a[2] * b[3] + a[3] * b[2] + a[0] * b[1] - a[1] * b[0];
      const qw = a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2];

      return [qx, qy, qz, qw] as Quaternion;
    }

    function normalizeQuaternion(quat: Quaternion) {
      const length = Math.sqrt(quat[0] ** 2 + quat[1] ** 2 + quat[2] ** 2 + quat[3] ** 2);
      if (length === 0) {
        return [0, 0, 0, 1];
      }

      return quat.map((v) => v / length) as Quaternion;
    }

    return normalizeQuaternion(multiplyQuaternion(quat, transformQuat));
  }
}
