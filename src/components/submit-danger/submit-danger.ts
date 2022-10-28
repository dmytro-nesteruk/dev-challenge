import './index.scss';
import { DangerType } from '../../@types/general';
import { EventEmitter } from '../../modules/event-emitter';

import rocket from '../../assets/icons/rocket.svg';
import drone from '../../assets/icons/drone.svg';
import airplane from '../../assets/icons/airplane.svg';
import helicopter from '../../assets/icons/helicopter.svg';
import explosion from '../../assets/icons/explosion.svg'

interface ISubmitDangerConstructor {
  defaultDanger: DangerType;
  eventEmitter: EventEmitter;
}

const icons = {
  rocket,
  drone,
  airplane,
  helicopter,
  explosion,
}

export class SubmitDanger {
  public selectedDanger: DangerType;

  private container: HTMLDivElement;
  private button: HTMLButtonElement;
  private icon: HTMLImageElement;
  private emitter: EventEmitter;

  constructor({ defaultDanger, eventEmitter }: ISubmitDangerConstructor) {
    this.selectedDanger = defaultDanger;
    this.emitter = eventEmitter;

    this.container = document.createElement('div');
    this.button = this.createBtn();
    this.icon = this.createIcon(icons[this.selectedDanger]);

    this.init();
  }

  get element() {
    return this.container;
  }

  private init = () => {
    this.emitter.subscribe({
      event: 'DANGER_TYPE_CHANGED',
      callback: (data: DangerType) => {
        this.update(data);
      },
    });

    this.container.classList.add('selected-danger');
    this.button.append(this.icon);
    this.button.addEventListener('click', this.handleClick);
    this.container.append(this.button);
  };

  private createBtn = () => {
    const btn = document.createElement('button');

    btn.classList.add('selected-danger-button');

    return btn;
  };

  private createIcon = (src: string) => {
    const icon = document.createElement('img');

    icon.src = src;
    icon.height = 128;
    icon.width = 128;

    return icon;
  };

  private handleClick = () => {
    this.emitter.notifySubscribers('DANGER_SUBMIT_CLICK', this.selectedDanger);
  };

  private update = (danger: DangerType) => {
    this.selectedDanger = danger;
    this.icon.src = icons[this.selectedDanger];
  };
}
