import dynamic from 'next/dynamic';

const ProfileForm = dynamic(() => import('../../components/ProfileForm'), {
  ssr: false,
  loading: () => <p>Loading profile...</p>,
});

export default function ProfilePage() {
  return <ProfileForm />;
}
