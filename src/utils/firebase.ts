import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import moment from 'moment-timezone';

interface IFirebaseService {
  get: (userId: string) => Promise<unknown>;
  setWorking: (userId: string, status: boolean) => void;
}

const firebaseService: IFirebaseService = (() => {
  const firebaseConfig = {
    apiKey: 'AIzaSyAz_BVbcIddj7HmfkZ-jt6CKR5OS36bX8M',
    authDomain: 'finder-75021.firebaseapp.com',
    databaseURL:
      'https://finder-75021-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'finder-75021',
    storageBucket: 'finder-75021.appspot.com',
    messagingSenderId: '253341146310',
    appId: '1:253341146310:web:86963e7f7781feade88bc7',
    measurementId: 'G-R0KT51SY2B',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const dbRef = ref(getDatabase(app));

  return {
    get: (userId: string) =>
      new Promise((resolve, reject) => {
        get(child(dbRef, `user/${userId}`))
          .then((snapshot) => {
            if (!snapshot.exists()) {
              console.log('No data available');
              return;
            }

            resolve(snapshot.val());
          })
          .catch((error) => {
            console.error(error);
          });
      }),
    setWorking: (userId: string, status: boolean) => {
      const db = getDatabase();
      set(ref(db, 'user/' + userId + '/working'), status);

      if (!status) {
        set(
          ref(db, 'user/' + userId + '/lastOperatingTime'),
          moment().tz('asia/ho_chi_minh').format('DD/MM/YYYY, HH:mm:ss')
        );
      }
    },
  };
})();

export default firebaseService;
