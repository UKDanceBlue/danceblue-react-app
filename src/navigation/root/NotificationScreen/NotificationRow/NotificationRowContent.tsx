import { FirestoreNotification } from "@ukdanceblue/db-app-common";
import { isEqual } from "lodash";
import { DateTime } from "luxon";
import { Heading, Skeleton, Text, View, useTheme } from "native-base";
import { memo } from "react";
import { useWindowDimensions } from "react-native";

const NonMemoizedNotificationRowContent = ({
  loading, notification
}: { loading: boolean; notification: FirestoreNotification | undefined }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { sizes } = useTheme();

  return (<>
    <View flexDirection="row" justifyContent="space-between" mb="2">
      <Skeleton.Text
        isLoaded={!loading}
        lines={1}
        width={(screenWidth / 6) * 3}
      >
        <Heading
          size="sm"
          flex={5}>{notification?.title}</Heading>
      </Skeleton.Text>
      <Skeleton.Text
        isLoaded={!loading}
        lines={1}
        width={(screenWidth / 6) * 2}
        textAlign="end"
      >
        <Text flex={1}>
          {
            notification && DateTime.fromISO(notification.sendTime).toLocaleString(DateTime.TIME_SIMPLE)
          }
        </Text>
      </Skeleton.Text>
    </View>
    <Skeleton.Text
      isLoaded={!loading}
      width={screenWidth - (sizes[4] * 3)}
    >
      <Text>
        <Text>{notification?.body}</Text>
      </Text>
    </Skeleton.Text>
  </>);
};

const NotificationRowContent = memo(
  NonMemoizedNotificationRowContent,
  (prevProps, nextProps) => {
    return prevProps.loading === nextProps.loading && isEqual(prevProps.notification, nextProps.notification);
  }
);
NotificationRowContent.displayName = "NotificationRowContent";
export { NotificationRowContent };
