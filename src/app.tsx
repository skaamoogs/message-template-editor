import { Button, ButtonVariations } from "./components/button/button";
import styles from "./app.module.scss";
import { useState } from "react";
import { TemplateEditor } from "./components/template-editor/template-editor";

function App() {
  const [show, setShow] = useState(false);

  const showEditor = () => {
    setShow(true);
  };

  const hideEditor = () => {
    setShow(false);
  };

  if (show) {
    return <TemplateEditor onHide={hideEditor} />;
  }

  return (
    <main className={styles.main}>
      <Button variation={ButtonVariations.Secondary} onClick={showEditor}>
        Message Editor
      </Button>
    </main>
  );
}

export default App;
