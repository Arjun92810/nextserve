import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';

interface CoachCardProps {
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  address: string;
  isOpen?: boolean;
  phone?: string;
}

export default function CoachCard({
  name,
  photo,
  rating,
  reviews,
  address,
  isOpen,
  phone
}: CoachCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={photo || '/default-coach.jpg'}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={photo.startsWith('https://maps.googleapis.com')}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#2d321c] mb-2 line-clamp-1">{name}</h3>
        <div className="flex items-center mb-2">
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <span className="ml-1 text-[#2d321c]">{rating.toFixed(1)}</span>
          <span className="ml-2 text-sm text-gray-500">({reviews} reviews)</span>
        </div>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{address}</p>
        {isOpen !== undefined && (
          <p className={`text-sm ${isOpen ? 'text-green-600' : 'text-red-600'} mb-2`}>
            {isOpen ? 'Open' : 'Closed'}
          </p>
        )}
        {phone && (
          <p className="text-sm text-[#93a048] hover:text-[#7a843c] transition-colors duration-300">
            <a href={`tel:${phone}`} className="hover:underline">
              {phone}
            </a>
          </p>
        )}
      </div>
    </div>
  );
} 