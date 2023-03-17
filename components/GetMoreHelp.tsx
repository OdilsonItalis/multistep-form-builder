import React from 'react';

function GetMoreHelp() {
  return (
    <div className="h-60 border rounded-xl flex flex-col ">
      <div className="flex flex-col p-2 h-full">
        <h3 className="font-semibold text-xl">
          Let's get you started with fitness plan
        </h3>
        <p className="text-gray-500">
          I will create personalized workout routine for you that will help you
          achieve your goals faster.
        </p>
        <div className="flex flex-col mt-auto text-sm">
          <p>✓ Exercise plan, updated monthly</p>
          <p>✓ Help with macronutrient goals</p>
          <p>✓ Premium email support</p>
          <p>✓ Money back guarantee</p>
        </div>
      </div>

      <button
        type="button"
        className="mt-auto font-semibold text-lg rounded-b-xl text-blue-400 p-2 cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}

export default GetMoreHelp;
