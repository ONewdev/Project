const host = import.meta.env.VITE_HOST;

export const submitRating = async (customerId, productId, rating) => {
  try {
    const response = await fetch(`${host}/api/interactions/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customerId,
        product_id: productId,
        rating: rating,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to submit rating");
    }
    return await response.json();
  } catch (error) {
    console.error("Error submitting rating:", error);
    throw error;
  }
};

export const addFavorite = async (customer_id, product_id) => {
  if (!customer_id || !product_id) {
    throw new Error('customer_id หรือ product_id ว่าง');
  }
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
