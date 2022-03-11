import React from "react";

function SingleSession(props) {
  console.log('props data', props.sessionKey.date)
  return (
    <div>
      <div>
      {props.date}
      {props.length}
      {props.log}
      </div> 
    </div>
  )
}

export default SingleSession;
