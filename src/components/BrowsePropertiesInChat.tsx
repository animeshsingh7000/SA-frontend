import React, { useEffect, useState } from 'react';
import { browseProperty } from '../api/attacheProperty';
import placeHolder from '../assets/images/placeHolder.png';

interface Property {
  Property?: {
    Name?: string;
    Files?: { Url?: string }[];
    Address?: { AddressLine1?: string; City?: string };
  };
  Rent?: number;
  Unit?: {
    UnitBedrooms?: number;
    UnitBathrooms?: number;
    Id?: string;
    Address?: { State?: string };
  };
  AvailableDate?: string;
  neighborhoodSlug?: string;
  isFurnished?: boolean;
}

const PAGE_SIZE = 5;

// ---
// Browse Properties API Parameters Reference
//
// page: number              // e.g., 1
// count: number             // e.g., 5
// bedrooms: string[]        // e.g., ["Studio"], ["OneBed"], ["TwoBed"], etc.
// budgetRange: number[]     // e.g., [2000, 3000]
// amenities: string[]       // e.g., ["WiFi", "Gym"]
// neighborhoods: string[]   // e.g., ["Dupont Circle"]
// availableDate: string     // e.g., "2024-06-01" (YYYY-MM-DD)
// departureDate: string     // e.g., "2024-06-15" (YYYY-MM-DD)
// isParking: boolean        // e.g., true or false
// isPetAllowed: boolean     // e.g., true or false
// search: string            // e.g., "Downtown"
//
// Example:
// browseProperty({
//   page: 1,
//   count: 5,
//   bedrooms: ["TwoBed"],
//   budgetRange: [2000, 3000],
//   amenities: ["WiFi", "Gym"],
//   neighborhoods: ["Dupont Circle"],
//   availableDate: "2024-06-01",
//   departureDate: "2024-06-15",
//   isParking: true,
//   isPetAllowed: true,
//   search: "Downtown"
// });
// ---

interface BrowsePropertiesInChatProps {
  params?: any;
}

const BrowsePropertiesInChat: React.FC<BrowsePropertiesInChatProps> = ({ params }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params) return;
    setLoading(true);
    setError(null);
    browseProperty(params)
      .then(res => {
        setProperties(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load properties.');
        setLoading(false);
      });
  }, [params]);

  if (!params) return null;
  if (!loading && !error && properties.length === 0) {
    return <div style={{ textAlign: 'center', color: '#888' }}>No properties found.</div>;
  }

  return (
    <>
      {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {properties.map((data, idx) => (
          <div key={idx} style={{ border: '1px solid #eee', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', gap: 10, background: '#fafbfc', width: '100%', margin: 0 }}>
            <img
              src={data?.Property?.Files?.[0]?.Url || placeHolder}
              alt={data?.Property?.Name || 'Property'}
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, background: '#eee' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, lineHeight: 1.2, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data?.Property?.Name || 'Property'}</div>
              <div style={{ fontSize: 12, color: '#3ca160', fontWeight: 500, lineHeight: 1.2 }}>${data?.Rent ? data.Rent.toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BrowsePropertiesInChat; 