import { classnames } from "../../utils/helpers";
import { ITextNode } from "../template-editor/template-editor";
import { Textarea } from "../textarea/textarea";
import styles from "./template.module.scss";

interface ITemplateProps {
  node: ITextNode;
  focusHandler: (id: number) => void;
  root?: boolean;
}

export const Template = (props: ITemplateProps) => {
  const { node, focusHandler, root } = props;

  if (!node.children) {
    return (
      <Textarea
        defaultText={node.text.value}
        changeHandler={(event) => {
          node.text.value = event.target.value;
          node.text.caretPosition = event.target.selectionStart;
        }}
        focusHandler={() => {
          focusHandler(node.id);
          console.log(node.id);
        }}
        className={styles.fullWidth}
      />
    );
  }
  const { first, second, condition } = node.children;

  return (
    <div className={styles.outer}>
      <Template node={first} focusHandler={focusHandler} />
      <div>
        <Textarea
          defaultText={condition.ifBlock.text.value}
          changeHandler={(event) => {
            condition.ifBlock.text.value = event.target.value;
          }}
          label={condition.ifBlock.label}
        />
        <div className={styles.block}>
          <p className={styles.label}>{condition.thenBlock.label}</p>
          <Template node={condition.thenBlock} focusHandler={focusHandler} />
        </div>
        <div className={styles.block}>
          <p className={styles.label}>{condition.elseBlock.label}</p>
          <Template node={condition.elseBlock} focusHandler={focusHandler} />
        </div>
      </div>
      <Template node={second} focusHandler={focusHandler} />
    </div>
  );
};
