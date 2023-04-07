import { React, useLayoutEffect } from "react";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

export default function ToolTip(props, referenceEl, floatingEl) {

  const { x, y, strategy, refs, context } = useFloating({
    placement: "top",
    middleware: [
      offset({
        alignmentAxis: -20,
      }),
      flip(),
      shift(),
      // arrow({
      //   element: arrowRef,
      // }),
    ],
    whileElementsMounted(...args) {
      const cleanup = autoUpdate(...args, { animationFrame: true });
      return cleanup;
    },
  });

    useLayoutEffect(() => {
      refs.setReference(referenceEl);
      refs.setFloating(floatingEl);
    }, [refs, referenceEl, floatingEl]);

  return (
    <>
      <span
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          width: "max-content",
        }}
        className="tooltiptext"
      >
        {props.totalSessionsUser(
          props.array2[props.weekIndex][props.daysIndex]
        )}{" "}
        sessions on {props.formatted}
      </span>
    </>
  );
}
