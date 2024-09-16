import React from 'react';

export default function useCombinedRefs(...refs) {
  const targetRef = React.useRef(null);

  React.useEffect(() => {
    refs.forEach(ref => {
      if (ref && typeof ref === 'function') {
        ref(targetRef.current);
      } else if (ref && ref.current !== undefined) {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
