import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UserDetailView from './UserDetailView';
import type { Visit, User } from '../../types';

interface LocationState {
  user?: User;
  visits?: Visit[];
}

const UserDetailPage: React.FC = () => {
  const { state } = useLocation() as { state: LocationState };
  const params = useParams();

  // Fallbacks if navigation state is missing
  const user: User = state?.user || {
    id: params.id || 'unknown',
    name: '',
    email: '',
    role: 'user',
  };
  const visits: Visit[] = state?.visits || [];

  return <UserDetailView user={user} visits={visits} />;
};

export default UserDetailPage;
