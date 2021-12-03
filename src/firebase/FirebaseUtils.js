import { doc, setDoc, collection, getDocs, where, query, addDoc } from 'firebase/firestore';

export async function setUserData(firestore, id, firstName, lastName, email, linkblue) {
  return setDoc(
    doc(firestore, 'users', id),
    { firstName, lastName, email, linkblue },
    { merge: true }
  );
}

export async function addPushTokenToFirebase(firestore, token) {
  const tokenQuery = await getDocs(
    query(collection(firestore, 'expo-push-tokens')),
    where('token', '==', token)
  );
  if (!tokenQuery.empty) {
    return tokenQuery.forEach((tokenDocument) => tokenDocument.token);
  }
  return addDoc(collection(firestore, 'expo-push-tokens'), { token });
}
