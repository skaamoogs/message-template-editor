import { useForceUpdate } from "../../hooks/forceUpdate";
import { ITextNode } from "../template-editor/template-editor";
import { Textarea } from "../textarea/textarea";
import styles from "./template.module.scss";

interface ITemplateProps {
  node: ITextNode;
  getActiveNode: (node: ITextNode) => void;
  root?: boolean;
}

export const Template = (props: ITemplateProps) => {
  const { node, getActiveNode } = props;
  const forceUpdate = useForceUpdate();

  const deleteBlock = () => {
    node.text.value =
      node.children?.first.text.value.concat(
        node.children?.second.text.value
      ) ?? "";
    node.children = null;
    getActiveNode(node);
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
          getActiveNode(node);
          console.log(node);
        }}
        className={styles.fullWidth}
      />
    );
  }

  return (
    <div className={styles.container}>
      <Template node={first} getActiveNode={getActiveNode} />
      <div>
        <div className={styles.block}>
          <div className={styles.labelContainer}>
            <p className={styles.label}>{condition.ifBlock.label}</p>
            <button className={styles.deleteButton} onClick={deleteBlock}>
              Delete
            </button>
          </div>
          <Textarea
            defaultText={condition.ifBlock.text.value}
            changeHandler={(event) => {
              condition.ifBlock.text.value = event.target.value;
            }}
            focusHandler={() => {
              getActiveNode(condition.ifBlock);
              console.log(condition.ifBlock);
            }}
            className={styles.fullWidth}
          />
        </div>
        <div className={styles.block}>
          <div className={styles.labelContainer}>
            <p className={styles.label}>{condition.thenBlock.label}</p>
          </div>
          <Template node={condition.thenBlock} getActiveNode={getActiveNode} />
        </div>
        <div className={styles.block}>
          <div className={styles.labelContainer}>
            <p className={styles.label}>{condition.elseBlock.label}</p>
          </div>
          <Template node={condition.elseBlock} getActiveNode={getActiveNode} />
        </div>
      </div>
      <Template node={second} getActiveNode={getActiveNode} />
    </div>
  );
};
