import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { ActionSheetIOS, Platform, Text, TextInput, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { showMessage } from '../../common/AlertUtils';
import { firebaseAuth, firebaseFirestore, firebaseStorage } from '../../common/FirebaseApp';
import store from '../../redux/store';
import generateUuid from '../../common/GenerateUuid';
import { globalColors } from '../../theme';

const input = React.createRef<TextInput>();

// From https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
async function uploadImageAsync(uri: string, hour: string) {
  let success = true;
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = (e) => {
      showMessage(e, 'Failed to upload your image', undefined, true);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  }).then(
    (b) => b,
    (b) => {
      success = false;
      return b;
    }
  );

  const fileRef = ref(
    firebaseStorage,
    `gs://react-danceblue.appspot.com/marathon/2022/photo-booth/${generateUuid()}`
  );
  const result = await uploadBytes(fileRef, blob);
  success = success && !!result.ref;

  // We're done with the blob, close and release it
  blob.close();

  if (success) {
    addDoc(collection(firebaseFirestore, 'marathon/2022/photo-booth'), {
      photoUri: result.ref.fullPath,
      hour,
      name: `${store.getState().auth.firstName?.toString()} ${store
        .getState()
        .auth.lastName?.toString()}`,
      linkblue: store.getState().auth.linkblue || null,
      email: store.getState().auth.email || null,
      moraleTeamID: store.getState().auth.moraleTeamId || null,
      deviceId: store.getState().notification.uuid || null,
      pushToken: store.getState().notification.pushToken || null,
    }).then(() => {
      showMessage('Photo uploaded', 'Success');
    });
  }

  return success;
}

// TODO move this elsewhere
async function getImageFromPhotosOrCamera(
  callback: (uri: string, hour: string) => Promise<boolean>,
  hour: string
) {
  const getFromCameraRoll = async (
    cameraRollCallback: (uri: string, hour: string) => Promise<boolean>
  ) => {
    let mediaLibraryPermissions = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!mediaLibraryPermissions.granted) {
      if (mediaLibraryPermissions.canAskAgain) {
        mediaLibraryPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!mediaLibraryPermissions.granted) {
          showMessage(
            'Go to settings and change your permission to use the camera roll',
            'Photo permissions are off'
          );
          return;
        }
      } else {
        showMessage(
          'Go to settings and change your permission to use the camera roll',
          'Photo permissions are off'
        );
        return;
      }
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    try {
      if (!pickerResult.cancelled) {
        const success = await cameraRollCallback((pickerResult as ImagePicker.ImageInfo).uri, hour);
        if (!success) {
          showMessage('unknown error', 'Failed to upload your image', undefined, true);
          return;
        }
      }
    } catch (e) {
      showMessage(e as object, 'Failed to upload your image', undefined, true);
    }
  };
  const takePicture = async (
    takePictureCallback: (uri: string, hour: string) => Promise<boolean>
  ) => {
    let cameraPermissions = await ImagePicker.getCameraPermissionsAsync();
    if (!cameraPermissions.granted) {
      if (cameraPermissions.canAskAgain) {
        cameraPermissions = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermissions.granted) {
          showMessage(
            'Go to settings and change your permission to use the device camera',
            'Camera permissions are off'
          );
          return;
        }
      } else {
        showMessage(
          'Go to settings and change your permission to use the device camera',
          'Camera permissions are off'
        );
        return;
      }
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!(await takePictureCallback((pickerResult as ImagePicker.ImageInfo).uri, hour))) {
      showMessage('unknown error', 'Failed to upload your image', undefined, true);
    }
  };

  if (store.getState().appConfig.offline) {
    showMessage(
      'You seem to be offline, connect to the internet or talk to your morale group leader'
    );
  } else if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Choose from Photos', 'Take a Photo'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          getFromCameraRoll(callback);
        } else if (buttonIndex === 2) {
          takePicture(callback);
        }
      }
    );
  } else if (Platform.OS === 'android') {
    // TODO make this better
    getFromCameraRoll(callback);
  } else {
    throw new Error('Unknown Platform');
  }
}

// Life is a Highway
export const PhotoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedStation, setSelectedStation] = useState('Colorado');

  return (
    <View
      key="activity - 3"
      style={{
        borderRadius: 5,
        backgroundColor: globalColors.lightGrey,
        margin: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Picker
        selectedValue={selectedStation}
        onValueChange={(itemValue) => setSelectedStation(itemValue)}
        enabled={!uploading}
        style={{ flex: 3 }}
        key="activity - 3a"
      >
        <Picker.Item label="Colorado" value="Colorado" />
        <Picker.Item label="New York" value="New York" />
        <Picker.Item label="LA" value="LA" />
        <Picker.Item label="Nashville" value="Nashville" />
        <Picker.Item label="Chicago" value="Chicago" />
        <Picker.Item label="Las Vegas" value="Las Vegas" />
        <Picker.Item label="Up North" value="Up North" />
        <Picker.Item label="Beach" value="Beach" />
        <Picker.Item label="Route 66" value="Route 66" />
        <Picker.Item label="Destination DB" value="Destination DB" />
      </Picker>
      <Button
        buttonStyle={{ margin: 5, flex: 1 }}
        title="Upload an image"
        disabled={uploading}
        onPress={() => {
          setUploading(true);
          getImageFromPhotosOrCamera(uploadImageAsync, selectedStation).then(() =>
            setUploading(false)
          );
        }}
      />
    </View>
  );
};

// A map of all the possible activities
const activities = {
  test: (
    <Text key="activity - 0">
      This is some dynamic content loaded from HourActivities.tsx used for internal testing purposes
    </Text>
  ),
  'guessing-game': (
    <View key="activity - 1">
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
  'photo-booth': (
    <Button
      key="activity - 2"
      style={{ width: '100%', height: 20 }}
      title="Submit a Picture"
      onPress={() => getImageFromPhotosOrCamera(uploadImageAsync, 'photo-booth')}
    />
  ),
  'dad-joke': (
    <View key="activity - 1">
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

export default activities;
