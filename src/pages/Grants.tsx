import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Grant } from '../types';
import { Plus } from 'lucide-react';

export default function Grants() {
  const [grants, setGrants] = useState<Grant[]>([]);

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    const data = await api.get('/grants');
    setGrants(data);
  };

  const statusColors: Record<string, string> = {
    available: 'bg-blue-100 text-blue-800',
    applied: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    denied: 'bg-red-100 text-red-800',
    received: 'bg-purple-100 text-purple-800',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Grants & Opportunities</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700">
          <Plus size={20} />
          <span>Add Grant</span>
        </button>
      </div>

      <div className="grid gap-6">
        {grants.map((grant) => (
          <div key={grant.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{grant.title}</h3>
                <p className="text-gray-600 mb-2">{grant.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="capitalize">{grant.type}</span>
                  <span>•</span>
                  <span>{grant.source}</span>
                  {grant.amount && (
                    <>
                      <span>•</span>
                      <span>${grant.amount.toLocaleString()}</span>
                    </>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${statusColors[grant.status]}`}>
                {grant.status.replace('_', ' ')}
              </span>
            </div>
            {grant.deadline && (
              <div className="text-sm text-gray-500">
                Deadline: {new Date(grant.deadline).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
