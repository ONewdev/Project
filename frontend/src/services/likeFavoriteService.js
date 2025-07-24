const host = import.meta.env.VITE_HOST;

export const likeProduct = async (customer_id, product_id) => {
  return fetch(`${host}/api/interactions/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id, product_id }),
  });
};

export const unlikeProduct = async (customer_id, product_id) => {
  return fetch(`${host}/api/interactions/unlike`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id, product_id }),
  });
};

export const addFavorite = async (customer_id, product_id) => {
  return fetch(`${host}/api/interactions/favorite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id, product_id }),
  });
};

export const removeFavorite = async (customer_id, product_id) => {
  return fetch(`${host}/api/interactions/unfavorite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id, product_id }),
  });
};
