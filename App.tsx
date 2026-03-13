if (__DEV__) {
  require('./ReactotronConfig');
}

import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import NetInfo from '@react-native-community/netinfo';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RealmProvider, useRealm} from './src/models';
import {useOSStore} from './src/store/useOSStore';
import {AppNavigator} from './src/navigation/AppNavigator';

function AppContent(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const realm = useRealm();
  const setOnlineStatus = useOSStore(state => state.setOnlineStatus);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setOnlineStatus(
        !!state.isConnected && !!state.isInternetReachable,
        realm,
      );
    });
    return () => unsubscribe();
  }, [realm, setOnlineStatus]);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <AppNavigator />
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <RealmProvider>
        <AppContent />
      </RealmProvider>
    </SafeAreaProvider>
  );
}

export default App;
