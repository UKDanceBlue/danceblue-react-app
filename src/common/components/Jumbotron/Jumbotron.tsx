import { Icon as IconType } from "@expo/vector-icons/build/createIconSet";
import { Icon, Text, View } from "native-base";

const Jumbotron = <PossibleIconNames extends string, IconFontName extends string, IconName extends PossibleIconNames>({
  icon, iconColor, iconType, title, text, subtitle
}: { icon:IconName; iconColor:string; iconType: IconType<PossibleIconNames, IconFontName>; title:string; text:string; subtitle:string }) => {
  return (
    <View
      margin={3}
      backgroundColor={"primary.100"}
      padding={4}
      paddingTop={6}
      alignItems="center"
      display="flex"
      justifyContent="space-evenly">
      {
        icon && (
          <Icon
            as={iconType}
            name={icon}
            color={iconColor}
            size={36}/>
        )
      }
      <Text
        textAlign="center"
        fontSize="2xl"
        color="primary.600"
        fontFamily="headingBold"
        bold>
        {title}
      </Text>
      <Text
        textAlign="center"
        fontSize="lg"
        color="primary.600"
        bold>
        {text}
      </Text>
      <Text
        textAlign="center"
        fontSize="md"
        color="primary.600"
        fontFamily="mono">
        {subtitle}
      </Text>
    </View>
  );
};

export default Jumbotron;
