import whiteRocket from '../assets/icons/rocket-white.svg';

import { Danger } from '../@enums/danger';
import { DangerType } from '../@types/general';

interface IDangerIcons {
  WHITE: {
    Danger['rocket']:string,
  }
}
export const DANGER_ICONS = {
  WHITE: {
    [Danger['rocket']]: whiteRocket,
  },
};
