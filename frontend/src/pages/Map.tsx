import { useState } from 'react';

interface Location {
  id: string;
  name: string;
  type: 'coffee' | 'gym' | 'mentor' | 'nutrition' | 'partner';
  address: string;
  anxietyLevel: 'low' | 'medium' | 'high';
  isBeginnerFriendly: boolean;
  rating: number;
  distance: number;
}

const Map = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Sample data (would come from API)
  const locations: Location[] = [
    {
      id: '1',
      name: 'Peaceful Grounds Café',
      type: 'coffee',
      address: '123 Calm Street, London',
      anxietyLevel: 'low',
      isBeginnerFriendly: true,
      rating: 4.8,
      distance: 0.5,
    },
    {
      id: '2',
      name: 'The Quiet Gym',
      type: 'gym',
      address: '45 Support Lane, London',
      anxietyLevel: 'low',
      isBeginnerFriendly: true,
      rating: 4.9,
      distance: 1.2,
    },
    {
      id: '3',
      name: 'Wellness Mentor Hub',
      type: 'mentor',
      address: '78 Growth Road, London',
      anxietyLevel: 'low',
      isBeginnerFriendly: true,
      rating: 5.0,
      distance: 2.3,
    },
  ];

  const filteredLocations = selectedType
    ? locations.filter((loc) => loc.type === selectedType)
    : locations;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coffee': return '☕';
      case 'gym': return '🏋️';
      case 'mentor': return '🧠';
      case 'nutrition': return '🥗';
      case 'partner': return '🤝';
      default: return '📍';
    }
  };

  const getAnxietyColor = (level: string) => {
    switch (level) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#808080';
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Support Near You
      </h1>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        Find anxiety-friendly locations in your area
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-full transition-all ${
            selectedType === null ? 'font-semibold' : ''
          }`}
          style={{
            backgroundColor: selectedType === null ? 'var(--accent-primary)' : 'var(--bg-secondary)',
            color: selectedType === null ? 'white' : 'var(--text-secondary)',
          }}
        >
          All
        </button>
        {['coffee', 'gym', 'mentor', 'nutrition', 'partner'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedType === type ? 'font-semibold' : ''
            }`}
            style={{
              backgroundColor: selectedType === type ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: selectedType === type ? 'white' : 'var(--text-secondary)',
            }}
          >
            {getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Map Placeholder */}
      <div 
        className="rounded-xl mb-6 flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          height: '300px',
          border: '1px solid var(--bg-tertiary)',
        }}
      >
        <div className="text-center">
          <span className="text-6xl block mb-4">🗺️</span>
          <p style={{ color: 'var(--text-secondary)' }}>
            Interactive map will be displayed here
          </p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Powered by Mapbox or Google Maps
          </p>
        </div>
      </div>

      {/* Location List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((location) => (
          <div key={location.id} className="card neon-glow">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{getTypeIcon(location.type)}</span>
              <span
                className="px-2 py-1 rounded text-xs font-semibold"
                style={{
                  backgroundColor: getAnxietyColor(location.anxietyLevel) + '20',
                  color: getAnxietyColor(location.anxietyLevel),
                }}
              >
                {location.anxietyLevel} anxiety
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
              {location.name}
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              {location.address}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                ⭐ {location.rating} • {location.distance} km away
              </span>
              {location.isBeginnerFriendly && (
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  Beginner Friendly
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;
