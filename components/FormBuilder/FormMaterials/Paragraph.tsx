import React from 'react';

interface ParagraphProps {
  textValue?: string;
}

export default function Paragraph({ textValue }: ParagraphProps) {
  return <p className="whitespace-pre-line">{textValue}</p>;
}
