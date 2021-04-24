import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import LoadingIndicator from '../../components/LoadingIndicator';

type Notification = {
  name: string;
};

enum Status {
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
}

const NOTIFICATION_API =
  'https://run.mocky.io/v3/e5f76c99-1238-4f19-b788-5683f763e73b';

const Notifications: React.FC = () => {
  const [items, setItems] = React.useState<Notification[]>([]);
  const [status, setStatus] = React.useState<string>('');

  React.useEffect(() => {
    const fetchNotifications = async () => {
      setStatus(Status.LOADING);

      try {
        const response = await fetch(NOTIFICATION_API);
        const json: { data: Notification[] } = await response.json();

        if (Array.isArray(json.data) && json.data.length > 0) {
          setItems(json.data);
        }
      } catch (error) {
        console.log('[Notifications]::', { error });
      }

      setStatus(Status.LOADED);
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      {status === Status.LOADING ? <LoadingIndicator /> : null}
      {status === Status.LOADED && items.length === 0 ? (
        <View>
          <Text>NO DATA</Text>
        </View>
      ) : null}
      {status === Status.LOADED && items.length > 0 ? (
        <View>
          <Text>LIST OF NOTIFICATION HERE</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Notifications;
