'use client'; // If you're using App Router

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => router.push('/notes-app')} className="text-blue-500 underline">
        Go to Notes App
      </button>
      <ul>
        {users.map(user => (
          <li key={user.id} data-testid="user-item">{user.name}</li>
        ))}
      </ul>
    </div>

  );
}
