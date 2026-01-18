import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Home from '@/Pages/Home';
import Journey from '@/Pages/Journey';
import Contacts from '@/Pages/Contacts';
import Alerts from '@/Pages/Alerts';
import Profile from '@/Pages/Profile';
import TrackSOS from '@/Pages/TrackSOS';

function App() {
  return (
    <Routes>
      <Route path={createPageUrl('Home')} element={<Home />} />
      <Route path={createPageUrl('Journey')} element={<Journey />} />
      <Route path={createPageUrl('Contacts')} element={<Contacts />} />
      <Route path={createPageUrl('Alerts')} element={<Alerts />} />
      <Route path={createPageUrl('Profile')} element={<Profile />} />
      <Route path={createPageUrl('TrackSOS')} element={<TrackSOS />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
