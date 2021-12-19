import { doc, setDoc } from 'firebase/firestore';

export async function setUserData(firestore, id, firstName, lastName, email, linkblue) {
  return setDoc(
    doc(firestore, 'users', id),
    { firstName, lastName, email, linkblue },
    { merge: true }
  );
}
