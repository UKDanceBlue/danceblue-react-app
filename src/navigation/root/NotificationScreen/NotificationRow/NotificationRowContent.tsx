import { Entypo } from "@expo/vector-icons";
import { FirestoreNotification } from "@ukdanceblue/db-app-common";
import { isEqual } from "lodash";
import { DateTime } from "luxon";
import { HStack, Heading, Icon, Skeleton, Text, VStack, View, useTheme } from "native-base";
import { memo } from "react";
import { useWindowDimensions } from "react-native";

import { useThemeFonts } from "../../../../common/customHooks";

const NonMemoizedNotificationRowContent = ({
  loading, notification
}: { loading: boolean; notification: FirestoreNotification | undefined }) => {
  const { width: screenWidth } = useWindowDimensions();
  const {
    sizes, fontSizes
  } = useTheme();

  const {
    body, mono
  } = useThemeFonts();

  return (<>
    <HStack alignItems="center" maxWidth="85%">
      <Icon
        name={"facebook"}
        as={Entypo}
        color="primary.600"
        backgroundColor="white"
        size={35}
        marginRight={3}/>
      <VStack>
        <View flexDirection="row" justifyContent="space-between" mb="2">
          <Skeleton.Text
            isLoaded={!loading}
            lines={1}
            width={(screenWidth / 6) * 3}
          >
            <Heading
              size="sm"
              flex={5}
              color="primary.600">{notification?.title}</Heading>
          </Skeleton.Text>
          <Skeleton.Text
            isLoaded={!loading}
            lines={1}
            width={(screenWidth / 6) * 2}
            textAlign="end"
          >
            <Text
              flex={1}
              fontFamily={mono}
              color="primary.600">
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
            <Text fontFamily={mono} fontSize={fontSizes.lg}>{notification?.body}</Text>
          </Text>
        </Skeleton.Text>
      </VStack>
    </HStack>
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
