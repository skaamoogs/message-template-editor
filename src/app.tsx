import { Button, ButtonVariations } from "./components/button/button";
import styles from "./app.module.scss";
import { createContext, useState } from "react";
import { TemplateEditor } from "./components/template-editor/template-editor";
import {
  MessageTemplate,
  createMessageTemplate,
} from "./service/message-template";

const deafaultMessageTemplate = createMessageTemplate();

export const MessageTemplateContext = createContext<MessageTemplate>(
  deafaultMessageTemplate
);

function App() {
  const [show, setShow] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState(
    deafaultMessageTemplate
  );

  const showEditor = () => {
    setShow(true);
  };

  const hideEditor = () => {
    setShow(false);
    setMessageTemplate(createMessageTemplate());
  };

  if (show) {
    return (
      <MessageTemplateContext.Provider value={messageTemplate}>
        <TemplateEditor onHide={hideEditor} />;
      </MessageTemplateContext.Provider>
    );
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
