import { Danger } from '../@enums/danger';
import { DangerType } from '../@types/general';
import { DangerPicker } from '../components/danger-picker/danger-picker';
import { SubmitDanger } from '../components/submit-danger/submit-danger';
import { AppAccelerometer } from '../modules/app-accelerometer/app-accelerometer';
import { EventEmitter } from '../modules/event-emitter';
import { Geolocation } from '../modules/geolocation';

export class App {
  app: HTMLDivElement;
  selectedDanger: DangerType;

  accelerometer: AppAccelerometer;
  eventEmitter: EventEmitter;
  geolocation: Geolocation;

  submitDanger: SubmitDanger;
  dangerPicker: DangerPicker;
  children: Array<HTMLElement>;

  constructor() {
    this.app = document.createElement('div');
    this.selectedDanger = Danger['helicopter'];

    this.eventEmitter = new EventEmitter();
    this.accelerometer = new AppAccelerometer({ eventEmitter: this.eventEmitter });
    this.geolocation = new Geolocation();

    this.submitDanger = new SubmitDanger({
      defaultDanger: this.selectedDanger,
      eventEmitter: this.eventEmitter,
    });
    this.dangerPicker = new DangerPicker({
      defaultDanger: this.selectedDanger,
      emitt: this.eventEmitter.notifySubscribers,
    });

    this.children = [this.accelerometer.element, this.submitDanger.element, this.dangerPicker.element];

    this.eventEmitter.subscribe({
      event: 'DANGER_TYPE_CHANGED',
      callback: (data: DangerType) => {
        this.selectedDanger = data;
      },
    });

    this.eventEmitter.subscribe({
      event: 'DANGER_SUBMIT_CLICK',
      callback: (data: DangerType) => {
        console.log(data);
      },
    });
  }

  render(root: HTMLDivElement) {
    this.children.forEach((element) => {
      this.app.append(element);
    });

    root.append(this.app);
  }
}
