import React, { useEffect, useState } from 'react';

export default function Lightning({ trigger }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 400);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!show) return null;
  return <div className="lightning-flash" />;
}
