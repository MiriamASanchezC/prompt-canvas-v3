'use client';

import { useState } from 'react';
import Canvas from '@/components/Canvas';

// Usuario temporal para desarrollo
const mockUser = {
  id: 'temp-user',
  email: 'demo@promptcanvas.com',
  user_metadata: {},
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  factors: [],
  identities: [],
  is_anonymous: false,
};

export default function Home() {
  const [user] = useState(mockUser);

  return (
    <main className="h-screen w-screen overflow-hidden">
      <Canvas user={user} />
    </main>
  );
}