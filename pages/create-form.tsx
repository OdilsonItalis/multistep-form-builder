import { useRouter } from 'next/router';
import React from 'react';

function Form() {
  const router = useRouter();
  const { formId } = router.query;
  return (
    <div className="flex justify-center items-center h-full">
      <h1 className="font-bold text-3xl">Create form here</h1>
    </div>
  );
}

export default Form;
