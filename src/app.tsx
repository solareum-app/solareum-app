import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar,Linking,Alert } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { Root } from './core/AppProvider';
import MainNavigator from './navigators/MainNavigator';






// function ListenDynmicLink(){
//   const handleDynamicLink = link => {
//     // Handle dynamic link inside your own application
//    console.log("listen app: ",link.url);
//    if (link === null) {
//     return;
//   }
//   if (link.url.includes('token')) {
//     console.log("----- link: ",link);
//     Alert.alert(link);
//   }
//   };

//   // React.useEffect(() => {
//   //   const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
//   //   // When the component is unmounted, remove the listener
//   //   return () => unsubscribe();
//   // }, []);

//   return null
// }



function ListenLinkInBG(){
  console.log("linkingggg");
  React.useEffect(() => {
  Linking.getInitialURL().then((url) => {
    if (url == null){
      console.log("linking url null");
      return;
    }
    if (url) {
      Alert.alert(url);
      console.log("linking url: ",url);
    }
  });
  }, []);
  return null
}







const App: React.FC = () => {

  return (
    <Root>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          <StatusBar barStyle="light-content" />
          <ListenLinkInBG />
          <MainNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </Root>
  );
}

export default App;
