import { Container, InterfaceSymbol } from 'ts-di-transformer/api';
import { AdblockModule } from '../app/modules/adblock';
import { AutoNavigationModule } from '../app/modules/auto-navigation';
import { AutoPlayModule } from '../app/modules/autoplay';
import { PlayerElementsFocusModule } from '../app/modules/player-elements-focus';
import { QualityModule } from '../app/modules/quality';
import { IRoute } from '../app/settings/IRoute';
import { AdblockRoute } from '../app/settings/routes/AdblockRoute';
import { AutoNavigationRoute } from '../app/settings/routes/AutoNavigationRoute';
import { AutoPlayRoute } from '../app/settings/routes/AutoPlayRoute';
import { PlayerElementsFocusRoute } from '../app/settings/routes/PlayerElementsFocusRoute';
import { QualityRoute } from '../app/settings/routes/QualityRoute';
import { AutoNavigationApi } from '../app/modules/auto-navigation/api';
import { AdblockApi } from '../app/modules/adblock/api';
import { AutoPlayApi } from '../app/modules/autoplay/api';
import { PlayerElementsFocusApi } from '../app/modules/player-elements-focus/api';
import { QualityApi } from '../app/modules/quality/api';
import { SettingsStorageFactory } from '../app/settings-storage/SettingsStorageFactory';

export const container = new Container();

// Make container accessible
container.bindToConstant(Container, container);

// Random Crap
container.bind(SettingsStorageFactory, SettingsStorageFactory)

// Modules
container.bindToImplements(AdblockModule);
container.bindToImplements(AutoNavigationModule);
container.bindToImplements(AutoPlayModule);
container.bindToImplements(PlayerElementsFocusModule);
container.bindToImplements(QualityModule);

// Module APIs
container.bind(AdblockApi, AdblockApi);
container.bind(AutoNavigationApi, AutoNavigationApi);
container.bind(AutoPlayApi, AutoPlayApi);
container.bind(PlayerElementsFocusApi, PlayerElementsFocusApi);
container.bind(QualityApi, QualityApi);

// Route settings
container.bindToFactory<IRoute>(InterfaceSymbol<IRoute>(), container => {
  return {
    text: 'Adblock',
    path: '/adblock',
    element: container.resolveFactory(AdblockRoute)
  };
});
container.bindToFactory<IRoute>(InterfaceSymbol<IRoute>(), container => {
  return {
    text: 'Auto navigation',
    path: '/auto-navigation',
    element: container.resolveFactory(AutoNavigationRoute)
  };
});
container.bindToFactory<IRoute>(InterfaceSymbol<IRoute>(), container => {
  return {
    text: 'Auto play',
    path: '/auto-play',
    element: container.resolveFactory(AutoPlayRoute)
  };
});
container.bindToFactory<IRoute>(InterfaceSymbol<IRoute>(), container => {
  return {
    text: 'Player elements focus',
    path: '/player-elements-focus',
    element: container.resolveFactory(PlayerElementsFocusRoute)
  };
});
container.bindToFactory<IRoute>(InterfaceSymbol<IRoute>(), container => {
  return {
    text: 'Quality',
    path: '/quality',
    element: container.resolveFactory(QualityRoute)
  };
});