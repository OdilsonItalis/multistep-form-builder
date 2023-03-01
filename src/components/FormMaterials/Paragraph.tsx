import React from 'react';

interface ParagraphProps {
  textValue?: string;
}

export default function Paragraph({ textValue }: ParagraphProps) {
  return <p>{textValue}</p>;
}
