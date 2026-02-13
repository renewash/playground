import React, { useState } from "react";

const Controlled = ({ value, onChange }) => {
  const [initialValue, setinitialValue] = useState("");
  const isControlled = value !== undefined;

  const update = (newVal) => {
    if (isControlled) {
      onChange?.(newVal);
    }
    setinitialValue;
  };
  return { update };
};

export default Controlled;
