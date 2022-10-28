import rocketIcon from '../../assets/icons/rocket-white.svg';
import droneIcon from '../../assets/icons/drone-white.svg';
import airplaneIcon from '../../assets/icons/airplane-white.svg';
import helicopterIcon from '../../assets/icons/helicopter-white.svg';
import explosionIcon from '../../assets/icons/explosion-white.svg';

import './index.scss';
import { Danger } from '../../@enums/danger';
import { DangerType } from '../../@types/general';
import { EventEmitter } from '../../modules/event-emitter';

interface IDangerPickerConstructor {
  defaultDanger: DangerType;
  emitt: EventEmitter['notifySubscribers'];
}

export class DangerPicker {
  private buttons: Array<HTMLButtonElement>;
  private emitt: EventEmitter['notifySubscribers'];
  private availableDangers: Array<DangerType>;

  public element: HTMLDivElement;
  public selectedDanger: DangerType;
  constructor({ defaultDanger = Danger['rocket'], emitt }: IDangerPickerConstructor) {
    this.selectedDanger = defaultDanger;
    this.emitt = emitt;

    this.availableDangers = Object.values(Danger);

    this.element = document.createElement('div');

    this.buttons = [];

    this.init();
  }

  private handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');

    if (!button) return;

    const id = button.id;

    const clickedDanger = id.split('-').at(-1) as DangerType;
    const currentDanger: DangerType | undefined = this.availableDangers.find((i) => i === clickedDanger);

    if (currentDanger && currentDanger !== this.selectedDanger) {
      this.selectedDanger = currentDanger;
      this.emitt('DANGER_TYPE_CHANGED', this.selectedDanger);
      this.update(this.selectedDanger);
    }
  };

  private init = () => {
    this.element.classList.add('danger-picker');

    this.buttons = [
      this.createBtn(rocketIcon, Danger['rocket'], this.selectedDanger === Danger['rocket']),
      this.createBtn(droneIcon, Danger['drone'], this.selectedDanger === Danger['drone']),
      this.createBtn(airplaneIcon, Danger['airplane'], this.selectedDanger === Danger['airplane']),
      this.createBtn(helicopterIcon, Danger['helicopter'], this.selectedDanger === Danger['helicopter']),
      this.createBtn(explosionIcon, Danger['explosion'], this.selectedDanger === Danger['explosion']),
    ];

    this.element.addEventListener('click', this.handleClick);

    this.buttons.forEach((button) => {
      this.element.append(button);
    });
  };

  update = (danger: DangerType) => {
    const nextActiveButton = this.buttons.find((i) => i.id.includes(danger));

    if (!nextActiveButton) return;

    const prevActiveButton = this.buttons.find((i) => i.classList.contains('active'));

    if (prevActiveButton) {
      prevActiveButton.classList.remove('active');
    }

    nextActiveButton.classList.add('active');
  };

  private createBtn = (icon: string, label: string, active = false) => {
    const btn = document.createElement('button');

    const iconElement = this.createIcon(icon);
    const labelElement = this.createLabel(label.toUpperCase());

    btn.id = `danger-picker-button-${label}`;
    btn.classList.add('danger-picker-button');

    if (active) {
      btn.classList.add('active');
    }

    btn.append(iconElement);
    btn.append(labelElement);

    return btn;
  };

  private createIcon = (src: string) => {
    const icon = document.createElement('img');
    icon.src = src;

    icon.classList.add('danger-picker-button__icon');
    icon.height = 24;
    icon.width = 24;
    return icon;
  };

  private createLabel = (text: string) => {
    const label = document.createElement('span');
    label.classList.add('danger-picker-button__label');
    label.innerText = text;
    return label;
  };
}
