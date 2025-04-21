'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function EditProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user; 
  const loading = auth?.loading ?? true;
  const [formData, setFormData] = useState({
    full_name: '',
    skill_level: '',
    play_format: [] as string[],
    experience_years: '',
    personality: '',
    bio: '',
    availability: {
      days: [] as string[],
      start: '',
      end: '',
    },
    preferred_court: '',
    surface_type: '',
    availability_calendar: [] as Date[],
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          skill_level: data.skill_level || '',
          play_format: data.play_format ? JSON.parse(data.play_format) : [],
          experience_years: data.experience_years || '',
          personality: data.personality || '',
          bio: data.bio || '',
          availability: data.availability
            ? JSON.parse(data.availability)
            : { days: [], start: '', end: '' },
          preferred_court: data.preferred_court || '',
          surface_type: data.surface_type || '',
          availability_calendar: data.availability_calendar
            ? JSON.parse(data.availability_calendar)
            : [],
        });
      }
    };

    if (user) fetchProfile();
  }, [user, loading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePlayFormat = (format: string) => {
    setFormData((prev) => {
      const updated = prev.play_format.includes(format)
        ? prev.play_format.filter((f) => f !== format)
        : [...prev.play_format, format];
      return { ...prev, play_format: updated };
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        ...formData,
        play_format: JSON.stringify(formData.play_format),
        availability: JSON.stringify(formData.availability),
        availability_calendar: JSON.stringify(formData.availability_calendar),
      })
      .eq('id', user?.id);

    if (error) {
      toast.error('Failed to save profile');
    } else {
      toast.success('Profile updated!');
      router.push('/profile');
    }

    setSaving(false);
  };

  return (
    <main className="max-w-xl mx-auto p-6 mt-8 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>

      {/* Full Name */}
      <label className="block font-medium">Full Name</label>
      <input
        type="text"
        name="full_name"
        className="input w-full mb-4"
        value={formData.full_name}
        onChange={handleChange}
      />

      {/* Skill Level */}
      <label className="block font-medium">Skill Level</label>
      <select
        name="skill_level"
        className="input w-full mb-4"
        value={formData.skill_level}
        onChange={handleChange}
      >
        <option value="">Choose</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      {/* Play Format */}
      <label className="block font-medium mb-1">Play Format</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {['Singles', 'Doubles', 'Mixed', 'Rallying', 'Practice'].map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => togglePlayFormat(format)}
            className={`px-3 py-1 rounded-full border ${
              formData.play_format.includes(format)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {format}
          </button>
        ))}
      </div>

      {/* Experience */}
      <label className="block font-medium">Years of Experience</label>
      <input
        type="number"
        name="experience_years"
        className="input w-full mb-4"
        value={formData.experience_years}
        onChange={handleChange}
      />

      {/* Personality */}
      <label className="block font-medium">Personality</label>
      <select
        name="personality"
        className="input w-full mb-4"
        value={formData.personality}
        onChange={handleChange}
      >
        <option value="">Choose</option>
        <option>Competitive</option>
        <option>Chill</option>
        <option>Social</option>
        <option>Flexible</option>
      </select>

      {/* Bio */}
      <label className="block font-medium">Bio</label>
      <textarea
        name="bio"
        rows={3}
        className="input w-full mb-4"
        value={formData.bio}
        onChange={handleChange}
      />

      {/* Availability Days */}
      <label className="block font-medium mb-1">Availability - Days</label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
          <label key={day} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.availability.days.includes(day)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...formData.availability.days, day]
                  : formData.availability.days.filter((d) => d !== day);
                setFormData((prev) => ({
                  ...prev,
                  availability: { ...prev.availability, days: updated },
                }));
              }}
            />
            {day}
          </label>
        ))}
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-medium">Start Time</label>
          <input
            type="time"
            value={formData.availability.start}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                availability: { ...prev.availability, start: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">End Time</label>
          <input
            type="time"
            value={formData.availability.end}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                availability: { ...prev.availability, end: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Preferred Court */}
      <label className="block font-medium">Preferred Court</label>
      <input
        type="text"
        name="preferred_court"
        className="input w-full mb-4"
        value={formData.preferred_court}
        onChange={handleChange}
      />

      {/* Surface Type */}
      <label className="block font-medium">Preferred Surface Type</label>
      <select
        name="surface_type"
        className="input w-full mb-6"
        value={formData.surface_type}
        onChange={handleChange}
      >
        <option value="">Choose</option>
        <option>Hard</option>
        <option>Clay</option>
        <option>Grass</option>
      </select>

      {/* Calendar */}
      <label className="block font-medium mb-1">🗓️ Availability Calendar</label>
      <Calendar
        onChange={(dates) =>
          setFormData((prev) => ({
            ...prev,
            availability_calendar: Array.isArray(dates) ? dates : [dates],
          }))
        }
        value={formData.availability_calendar}
        selectRange={false}
        tileClassName={({ date }) =>
          formData.availability_calendar.some(
            (d) => new Date(d).toDateString() === date.toDateString()
          )
            ? 'bg-blue-100'
            : null
        }
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-green-600 text-white py-2 mt-6 rounded hover:bg-green-700 transition"
      >
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </main>
  );
}
