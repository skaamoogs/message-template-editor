import { useContext, useEffect, useState } from "react";
import { compileTemplate } from "../../utils/compile-template";
import styles from "./message-preview.module.scss";
import { Input } from "../input/input";
import { Button, ButtonVariations } from "../button/button";
import { MessageTemplateContext } from "../../app";

interface IMessagePreviewProps {
  onHide: () => void;
}

export const MessagePreview = (props: IMessagePreviewProps) => {
  const { onHide } = props;
  const [message, setMessage] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const messageTemplate = useContext(MessageTemplateContext);

  useEffect(() => {
    setMessage(compileTemplate(messageTemplate, variables));
  }, [variables, messageTemplate]);

  const changeVariables = (name: string, value: string) => {
    setVariables((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Message Preview</h1>
        <button className={styles.closeIcon} onClick={onHide}>
          <img src="close-button.svg" alt="close icon" />
        </button>
        <p className={styles.message}>{message}</p>
        <div className={styles.variables}>
          <h2 className={styles.variablesTitle}>Variables: </h2>
          {messageTemplate.varNames.map((name) => (
            <Input
              key={name}
              id={name}
              label={name}
              placeholder={name}
              className={styles.variable}
              defaultValue={variables[name]}
              changeHandler={(value) => changeVariables(name, value)}
            />
          ))}
        </div>
        <Button variation={ButtonVariations.Secondary} onClick={onHide}>
          Close
        </Button>
      </div>
    </div>
  );
};
