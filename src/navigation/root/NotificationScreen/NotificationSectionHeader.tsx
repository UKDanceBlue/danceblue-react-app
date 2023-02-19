import { Heading, View } from "native-base";
import { SectionListProps } from "react-native";

import { NotificationListDataEntry } from "./NotificationScreen";

type NotificationSectionHeaderType = NonNullable<SectionListProps<NotificationListDataEntry | undefined, { title: string; data: (NotificationListDataEntry | undefined)[] }>["renderSectionHeader"]>;
export const NotificationSectionHeader: NotificationSectionHeaderType = ({ section: { title } }: Parameters<NotificationSectionHeaderType>[0]) => {
  return (
    <View
      backgroundColor="light.100">
      <Heading
        size="md"
        p={2}
      >
        {title}
      </Heading>
    </View>
  );
};
