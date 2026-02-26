// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'auth-conectaprof.firebaseapp.com',
  projectId: 'auth-conectaprof',
  storageBucket: 'auth-conectaprof.firebasestorage.app',
  messagingSenderId: '742057111298',
  appId: '1:742057111298:web:250228d8cc8ce374a2dc1b',
};

// 2. Inicialização (Fora da função para ser feita apenas uma vez)
const app = initializeApp(firebaseConfig);

// Exportamos o auth para ser usado em outros lugares se precisar
export const auth = getAuth(app);



