// not sure why this is needed

import { postData } from '@/utils/helpers';
import React from 'react';

function customclaims() {
  const setClaims = async () => {
    try {
      const res = await postData({
        url: '/api/claims-test'
      });
      console.log(res);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  };

  return (
    <div>
      <button onClick={setClaims}>change claims</button>
    </div>
  );
}

export default customclaims;
