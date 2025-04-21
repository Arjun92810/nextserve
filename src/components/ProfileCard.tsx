import { FC } from 'react';
import type { Profile } from '@/types/profile';

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: FC<ProfileCardProps> = ({ profile }) => {
  // Helper function to check if a field has valid content
  const isValidField = (value: string | null | undefined): boolean => {
    return value !== null && value !== undefined && value !== '' && value !== 'EMPTY';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition min-h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{profile.full_name}</h3>
        {isValidField(profile.skill_level) && (
          <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            {profile.skill_level}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {isValidField(profile.play_style) && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">Play Style:</span>
            {profile.play_style}
          </div>
        )}
        
        {isValidField(profile.availability) && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">Availability:</span>
            {profile.availability}
          </div>
        )}
        
        {isValidField(profile.play_format) && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">Format:</span>
            {profile.play_format}
          </div>
        )}
        
        {isValidField(profile.preferred_surface) && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">Preferred Surface:</span>
            {profile.preferred_surface}
          </div>
        )}
        
        {isValidField(profile.bio) && (
          <div className="mt-4">
            <p className="text-gray-600">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard; 