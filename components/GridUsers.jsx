import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { UserCard }from '@/components/Card';
import { ExclamationIcon } from '@heroicons/react/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const GridUsers = ({users = []}) => {
    const [favorites, setFavorites] = useState([]);

    const isEmpty = users.length === 0;
  
    useEffect(() => {
      (async () => {
        try {
          const { data } = await axios.get('/api/user/favorites');
          setFavorites(data);
        } catch (e) {
          setFavorites([]);
        }
      })();
    }, []);
  
    const toggleFavorite = id => {
      try {
        toast.dismiss('updateFavorite');
        setFavorites(prev => {
          const isFavorite = prev.find(favoriteId => favoriteId === id);
          // Remove from favorite
          if (isFavorite) {
            axios.delete(`/api/users/${id}/favorite`);
            return prev.filter(favoriteId => favoriteId !== id);
          }
          // Add to favorite
          else {
            axios.put(`/api/users/${id}/favorite`);
            return [...prev, id];
          }
        });
      } catch (e) {
        toast.error('Unable to update favorite', { id: 'updateFavorite' });
      }
    };
  
    return isEmpty ? (
      <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
        <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
        <span>Unfortunately, there is nothing to display yet.</span>
      </p>
    ) : (
      <div className="grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map(user => (
          <UserCard
            key={user.id}
            {...user}
            onClickFavorite={toggleFavorite}
            favorite={!!favorites.find(favoriteId => favoriteId === user.id)}
          />
        ))}
      </div>
    );
}

GridUsers.propTypes = {
    users: PropTypes.array,
}

export default GridUsers