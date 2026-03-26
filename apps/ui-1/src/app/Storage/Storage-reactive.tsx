import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";

type Text = {
  text: string;
};
const Storage = () => {
  const { value, save, clear } = useLocalStorage({
    key: "storage-test",
    defaultValue: { text: "" },
  });

  const [wt, setWT] = useState<Text>(value);

  const onSave = () => {
    console.log("Saving value:", wt);
    save(wt);
  };

  const onLoad = () => {
    console.log("Loading value...", value);
    // setValue(load());
  };

  const onClear = () => {
    console.log("Clearing value...");
    clear();
  };

  return (
    <div>
      <h1>Storage</h1>
      <p>
        This page is for testing out storage solutions for the app. It will
        likely be used to test out different databases and how to integrate them
        into the app.
      </p>
      <input
        className="h-24 w-full border p-3"
        value={wt.text}
        onChange={(e) => setWT({ text: e.target.value })}
      />

      <h3>
        Use hook's reactive value. It should update automatically when the value
        changes.
      </h3>

      <input
        className="h-24 w-full border p-3"
        value={value.text}
        onChange={() => {}}
      />

      <div>
        <button className="m-2 border p-3" onClick={onSave}>
          Save
        </button>
        <button className="m-2 border p-3" onClick={onLoad}>
          Load
        </button>
        <button className="m-2 border p-3" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default Storage;
