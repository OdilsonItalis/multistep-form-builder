import StringListGenerator from '@/components/StringListGenerator';
import React from 'react';

function TestArray() {
  const [strings, setStrings] = React.useState<string[]>([]);
  console.log(strings);
  return (
    <div className="max-w-2xl mx-auto w-full">
      <StringListGenerator strings={strings} setStrings={setStrings} />
    </div>
  );
}

export default TestArray;
