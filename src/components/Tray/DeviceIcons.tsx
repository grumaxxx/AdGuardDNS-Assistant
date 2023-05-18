import iosLogo from './icons/ios.svg';
import androidLogo from './icons/android.svg';
import winLogo from './icons/windows.svg';
import macLogo from './icons/macos.svg';
import linuxLogo from './icons/linux.svg';
import consoleLogo from './icons/consoles.svg';
import routerLogo from './icons/routers.svg';
import smartTvLogo from './icons/smart_tv.svg';
import unknownLogo from './icons/unknown.svg';

const createDeviceIcon = (logo: string) => (
  <img
    src={logo}
    alt="Logo"
    style={{
      verticalAlign: 'middle',
      alignItems: 'center',
      width: '24px',
      height: '24px',
    }}
  />
);

export const deviceIcons = {
  WINDOWS: createDeviceIcon(winLogo),
  ANDROID: createDeviceIcon(androidLogo),
  MAC: createDeviceIcon(macLogo),
  IOS: createDeviceIcon(iosLogo),
  LINUX: createDeviceIcon(linuxLogo),
  ROUTER: createDeviceIcon(routerLogo),
  SMART_TV: createDeviceIcon(smartTvLogo),
  GAME_CONSOLE: createDeviceIcon(consoleLogo),
  UNKNOWN: createDeviceIcon(unknownLogo),
};
