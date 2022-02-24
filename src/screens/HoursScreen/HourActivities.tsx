import { addDoc, collection } from 'firebase/firestore';
import { Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import { firebaseFirestore } from '../../common/FirebaseApp';

export default {
  test: <Text>This is dynamic content loaded from HourActivities.tsx</Text>,
  'guessing-game': (
    <View>
      <Text>Enter your guess and press enter:</Text>
      <Input
        autoCompleteType="off"
        autoComplete="off"
        onSubmitEditing={async (event) => {
          const submittedText = event.nativeEvent.text;
          const parsedText = parseInt(submittedText, 10);

          if (parsedText && typeof parsedText === 'number' && !Number.isNaN(parsedText)) {
            await addDoc(collection(firebaseFirestore, 'marathon/2022/guessing-game'), {
              guess: parsedText,
            });
          }
        }}
      />
    </View>
  ),
} as { [key: string]: JSX.Element };
