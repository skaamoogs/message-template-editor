import { useForceUpdate } from "../../hooks/useForceUpdate";
import { ITextNode, NodeType, messageTemplate } from "../../service/message-template";
import { Textarea } from "../textarea/textarea";
import styles from "./template.module.scss";

interface ITemplateProps {
  node: ITextNode;
  getActiveNode: (id: number) => void;
  root?: boolean;
}

export const Template = (props: ITemplateProps) => {
  const { node, getActiveNode } = props;
  const forceUpdate = useForceUpdate();

  const deleteBlock = (id: number) => {
    const activeNodeId = messageTemplate.deleteConditionBlock(id) ?? 0;
    getActiveNode(activeNodeId);
    forceUpdate();
  };

  if (!node.children) {
    return (
      <Textarea
        defaultText={node.text.value}
        changeHandler={(event) => {
          node.text.value = event.target.value;
          node.text.caretPosition = event.target.selectionStart;
        }}
        focusHandler={() => {
          getActiveNode(node.id);
        }}
        className={styles.fullWidth}
      />
    );
  }

  return (
    <div className={styles.container}>
      {node.children.map((child) => {
        switch (child.type) {
          case NodeType.text:
            return (
              <Template
                node={child}
                getActiveNode={getActiveNode}
                key={child.id}
              />
            );
          case NodeType.if:
            return (
              <div className={styles.block} key={child.id}>
                <div className={styles.labelContainer}>
                  <p className={styles.label}>{child.label}</p>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteBlock(child.id)}
                  >
                    Delete
                  </button>
                </div>
                <Textarea
                  defaultText={child.text.value}
                  changeHandler={(event) => {
                    child.text.value = event.target.value;
                    child.text.caretPosition = event.target.selectionStart;
                  }}
                  focusHandler={() => {
                    getActiveNode(child.id);
                  }}
                  className={styles.fullWidth}
                />
              </div>
            );
          case NodeType.then:
          case NodeType.else:
            return (
              <div className={styles.block} key={child.id}>
                <div className={styles.labelContainer}>
                  <p className={styles.label}>{child.label}</p>
                </div>
                <Template node={child} getActiveNode={getActiveNode} />
              </div>
            );
        }
        return <></>;
      })}
    </div>
  );
};
