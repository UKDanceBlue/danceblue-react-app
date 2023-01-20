import { Text, View, useTheme } from "native-base";
import { Card } from "react-native-elements";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const FAQItem = ({
  question, answer
}: { question:string; answer:string }) => {
  const themes = useTheme();
  const {
    primary, // Standard is 600, light background is 100
    secondary, // Standard is 400
    tertiary, // Standard is 500
    success, warning, error, danger, blue
  } = useThemeColors();
  const {
    heading, body, mono
  } = useThemeFonts();

  return (
    <Card containerStyle={{ padding: 0, shadowOpacity: 0 }}>
      <Card.Title style={{ color: primary[600], backgroundColor: primary[100], paddingTop: 5, paddingBottom: 5, marginBottom: 0 }}>{question}</Card.Title>
      <Card.Divider/>
      <View margin={3} marginTop={0}>
        <Text>{answer}</Text>
      </View>
    </Card>
  );
};

export default FAQItem;
