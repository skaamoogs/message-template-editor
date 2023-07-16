import { useEffect, useState } from "react";
import { messageTemplate } from "../../service/message-template";
import { compileTemplate } from "../../utils/helpers";
import styles from "./message-preview.module.scss";

interface IMessagePreviewProps {
  onHide: () => void;
}

export const MessagePreview = (props: IMessagePreviewProps) => {
  const { onHide } = props;
  const [message, setMessage] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    setMessage(compileTemplate(messageTemplate, variables));
  }, [variables]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Message Preview</h1>
        <button className={styles.closeButton} onClick={onHide}>
          <img src="close-button.svg" alt="close button" />
        </button>
        <p>{message}</p>
        <div className={styles.variables}>{messageTemplate.varNames.map(name => <></>)}</div>
      </div>
    </div>
  );
};
