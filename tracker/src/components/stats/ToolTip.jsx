import { React, useLayoutEffect } from "react";

import {
  useFloating,
} from "@floating-ui/react";

export default function ToolTip({referenceEl, floatingEl}) {
  const {refs} = useFloating();
 
  useLayoutEffect(() => {
    refs.setReference(referenceEl);
    refs.setFloating(floatingEl);
  }, [refs, referenceEl, floatingEl]);

  return (
    <>
      <span
        className="tooltiptext"
      >
        {/* {props.totalSessionsUser(
          props.array2[props.weekIndex][props.daysIndex]
        )}{" "} */}asdasdasd
        {/* sessions on {props.formatted} */}
      </span>
    </>
  );
}
