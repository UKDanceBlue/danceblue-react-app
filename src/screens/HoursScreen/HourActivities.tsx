import { collection, doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { Input } from 'react-native-elements';
import { showMessage } from '../../common/AlertUtils';
import { firebaseAuth, firebaseFirestore } from '../../common/FirebaseApp';

const input = React.createRef<TextInput>();

export default {
  test: <Text>This is dynamic content loaded from HourActivities.tsx</Text>,
  'guessing-game': (
    <View>
      <Text style={{ margin: 10 }}>Enter your guess and press enter:</Text>
      <Input
        ref={input}
        disabled={!firebaseAuth.currentUser || firebaseAuth.currentUser.isAnonymous}
        defaultValue={
          !firebaseAuth.currentUser || firebaseAuth.currentUser.isAnonymous
            ? 'LinkBlue login required'
            : undefined
        }
        style={{ borderColor: 'blue', borderWidth: 1, borderRadius: 5 }}
        autoCompleteType="off"
        autoComplete="off"
        onSubmitEditing={async (event) => {
          const submittedText = event.nativeEvent.text;
          const parsedText = parseInt(submittedText, 10);

          if (
            parsedText &&
            typeof parsedText === 'number' &&
            !Number.isNaN(parsedText) &&
            parsedText > 0
          ) {
            await setDoc(
              doc(
                collection(firebaseFirestore, 'marathon/2022/guessing-game'),
                firebaseAuth.currentUser?.uid
              ),
              {
                guess: parsedText,
                email: firebaseAuth.currentUser?.email,
              }
            ).then(() => {
              if (input.current) {
                input.current.clear();
              }
            });
          } else {
            showMessage('Make sure to enter a positive number', 'Invalid Guess', () => {
              if (input.current) {
                input.current.clear();
              }
            });
          }
        }}
      />
    </View>
  ),
} as { [key: string]: JSX.Element };
