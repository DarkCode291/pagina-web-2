
// pages/index.js
import { useEffect, useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Home() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [country, setCountry] = useState('');
    const [file, setFile] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            const querySnapshot = await getDocs(collection(db, 'users'));
            setUsers(querySnapshot.docs.map(doc => doc.data()));
        }
        fetchUsers();
    }, []);

    const handleUpload = async () => {
        if (!file) return alert('Selecciona una imagen.');
        const fileRef = ref(storage, `images/${file.name}`);
        await uploadBytes(fileRef, file);
        const imageUrl = await getDownloadURL(fileRef);
        
        await addDoc(collection(db, 'users'), { name, age, country, imageUrl });
        alert('Foto subida con éxito!');
        window.location.reload();
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Sube tu foto</h1>
            <input type='text' placeholder='Nombre' onChange={e => setName(e.target.value)} /><br />
            <input type='number' placeholder='Edad' onChange={e => setAge(e.target.value)} /><br />
            <input type='text' placeholder='País' onChange={e => setCountry(e.target.value)} /><br />
            <input type='file' onChange={e => setFile(e.target.files[0])} /><br />
            <button onClick={handleUpload}>Subir</button>
            <h2>Galería</h2>
            <div>
                {users.map((user, index) => (
                    <div key={index}>
                        <img src={user.imageUrl} alt='Foto' width='200' /><br />
                        <strong>{user.name}</strong>, {user.age} años, {user.country}
                    </div>
                ))}
            </div>
        </div>
    );
}
    