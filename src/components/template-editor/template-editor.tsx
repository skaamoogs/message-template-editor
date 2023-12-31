import { useContext, useEffect, useState } from "react";
import { Button, ButtonVariations } from "../button/button";
import styles from "./template-editor.module.scss";
import { Template } from "../template/template";
import { useForceUpdate } from "../../hooks/useForceUpdate";
import { callbackSave } from "../../service/message-template";
import { MessagePreview } from "../template-preview/message-preview";
import { MessageTemplateContext } from "../../app";

interface ITemplateEditorProps {
  onHide: () => void;
}

export const TemplateEditor = (props: ITemplateEditorProps) => {
  const { onHide } = props;

  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const forceUpdate = useForceUpdate();
  const messageTemplate = useContext(MessageTemplateContext);

  const divideBlock = () => {
    if (activeNodeId !== null) {
      messageTemplate.addNewNode(activeNodeId);
    }
    forceUpdate();
  };

  const addVariable = (varName: string) => {
    const id =
      activeNodeId ??
      messageTemplate.tree?.children?.at(0)?.id ??
      messageTemplate.tree.id;
    const node = messageTemplate.findNode(id);
    if (node) {
      const { value, caretPosition } = node.text;
      node.text.value = `${value.slice(
        0,
        caretPosition
      )}{${varName}}${value.slice(caretPosition)}`;
      node.text.caretPosition += varName.length + 2;

      forceUpdate();
    }
  };

  // disable scrolling if preview window is open
  useEffect(() => {
    document.body.style.overflowY = showPreview ? "hidden" : "visible";
  }, [showPreview]);

  const showMessagePreview = () => {
    setShowPreview(true);
  };

  const hideMessagePreview = () => {
    setShowPreview(false);
  };

  const saveTemplate = () => {
    callbackSave(messageTemplate);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Message Template Editor</h1>
          <div className={styles.controlArea}>
            <div className={styles.variables}>
              {messageTemplate.varNames.map((name) => (
                <Button
                  variation={ButtonVariations.Variable}
                  key={name}
                  onClick={() => addVariable(name)}
                >
                  &#123;{name}&#125;
                </Button>
              ))}
            </div>
            <Button variation={ButtonVariations.Light} onClick={divideBlock}>
              IF-THEN-ELSE
            </Button>
          </div>
          <div className={styles.template}>
            <Template
              node={messageTemplate.tree}
              getActiveNode={(id) => setActiveNodeId(id)}
            />
          </div>
          <div className={styles.buttons}>
            <Button
              variation={ButtonVariations.Secondary}
              onClick={showMessagePreview}
            >
              Preview
            </Button>
            <Button variation={ButtonVariations.Primary} onClick={saveTemplate}>
              Save
            </Button>
            <Button variation={ButtonVariations.Danger} onClick={onHide}>
              Close
            </Button>
          </div>
        </div>
      </div>
      {showPreview && <MessagePreview onHide={hideMessagePreview} />}
    </>
  );
};
