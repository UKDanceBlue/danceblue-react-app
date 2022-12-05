import firestore from "@react-native-firebase/firestore";
import { Box, Button, Row, useTheme } from "native-base";
import { Alert, SectionListRenderItem, useWindowDimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring } from "react-native-reanimated";

import { universalCatch } from "../../../../common/logging";
import { useAuthData, useFirebase } from "../../../../context";
import { useRefreshUserData } from "../../../../context/user";
import { NotificationListDataEntry } from "../NotificationScreen";

import { NotificationRowContent } from "./NotificationRowContent";

export const AnimatedNotificationRow: SectionListRenderItem<NotificationListDataEntry | undefined, { title: string; data: (NotificationListDataEntry | undefined)[] }> = ({ item }: { item: NotificationListDataEntry | undefined }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { sizes } = useTheme();
  const refreshUserData = useRefreshUserData();
  const { fbFirestore } = useFirebase();

  const { uid } = useAuthData();

  const sideMenuWidth = screenWidth * 0.2;
  const x = useSharedValue(0);
  const flung = useSharedValue(false);

  // A gesture handler that allows swiping the view left only, right will just bounce
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      const desiredTransition = ctx.startX + event.translationX;
      if (desiredTransition < 0) {
        x.value = desiredTransition;
      } else {
        // Try to move the view right
        x.value = desiredTransition * 0.1;
      }
    },
    onEnd: () => {
      if (x.value < -sideMenuWidth) {
        x.value = withSpring(-sideMenuWidth * 1.25);
      } else {
        x.value = withSpring(0);
      }
    },
  });

  const animatedViewStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: x.value }] };
  });

  const buttonRowHeight = useSharedValue<number>(0);
  const animatedButtonRowStyle = useAnimatedStyle(() => {
    let width = sideMenuWidth;

    if (x.value < -(sideMenuWidth + sizes["4"])) {
      width -= x.value + sideMenuWidth + sizes["4"];
    }

    return { width, height: buttonRowHeight.value };
  }, [
    x, buttonRowHeight, flung
  ]);

  const notification = item?.notification;
  const loading = notification == null;

  return (
    // TODO add support for flinging the menu to delete
    <PanGestureHandler onGestureEvent={panGestureHandler} minDist={15}>
      <Animated.View style={animatedViewStyle}>
        <Row
          width={screenWidth + sideMenuWidth}
          collapsable={false}
          my="2">
          <Box
            mx="4"
            p="1.5"
            background="blue.200"
            rounded="md"
            shadow="2"
            width={screenWidth - (sizes[4] * 2)}
            onLayout={(event) => {
              buttonRowHeight.value = (event.nativeEvent.layout.height);
            }}
          >
            <NotificationRowContent loading={loading} notification={notification} />
          </Box>
          <Animated.View
            style={animatedButtonRowStyle}
          >
            <Button
              disabled={uid == null}
              onPress={() => {
                Alert.alert(
                  "Delete Notification",
                  "Are you sure you want to delete this notification?",
                  [
                    {
                      style: "cancel",
                      text: "Cancel"
                    },
                    {
                      style: "destructive",
                      text: "Delete",
                      onPress: () => {
                        if (uid) {
                          fbFirestore
                            .collection("users")
                            .doc(uid)
                            .update({ notificationReferences: firestore.FieldValue.arrayRemove(item?.reference) })
                            .then(refreshUserData)
                            .catch(universalCatch);
                        }
                      }
                    }
                  ]
                );
              }}
              width="100%"
              height="100%"
              variant="solid"
              colorScheme="red"
            >
              Delete
            </Button>
          </Animated.View>
        </Row>
      </Animated.View>
    </PanGestureHandler>
  );
};
