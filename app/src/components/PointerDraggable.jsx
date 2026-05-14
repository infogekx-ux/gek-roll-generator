import React, { useRef, useState } from 'react';

// Touch + mouse drag via pointer events.
// Detects drop into elements with [data-dropzone="<id>"].
// onDrop(itemId, dropZoneId | null) called on pointerup.
export default function PointerDraggable({ id, children, onDrop, disabled, className = '', style = {} }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  function pointerDown(e) {
    if (disabled) return;
    e.preventDefault();
    setDrag(true);
    offsetRef.current = { x: e.clientX, y: e.clientY };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  }

  function pointerMove(e) {
    if (!drag) return;
    setPos({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
  }

  function findDropZone(x, y) {
    const elems = document.elementsFromPoint(x, y);
    for (const el of elems) {
      const dz = el.closest && el.closest('[data-dropzone]');
      if (dz) return dz.getAttribute('data-dropzone');
    }
    return null;
  }

  function pointerUp(e) {
    if (!drag) return;
    setDrag(false);
    const dzId = findDropZone(e.clientX, e.clientY);
    if (onDrop) onDrop(id, dzId);
    setPos({ x: 0, y: 0 });
  }

  return (
    <div
      ref={ref}
      className={`drag-item ${drag ? 'drag-item--active' : ''} ${className}`}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        touchAction: 'none',
        userSelect: 'none',
        zIndex: drag ? 1000 : 1,
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
