import { useState } from "react";
import { storageService } from "../../service/storage";
import { Button, ButtonVariations } from "../button/button";
import { Textarea } from "../textarea/textarea";
import styles from "./template-editor.module.scss";

interface ITemplateEditorProps {
  onHide: () => void;
}

interface ITemplateProps {
  node: ITextNode;
}

interface ITextNode {
  parent: ITextNode | null;
  children:
    | {
        first: ITextNode;
        condition: IConditionBlock;
        second: ITextNode;
      }
    | string;
}

interface IConditionBlock {
  ifBlock: string;
  thenBlock: ITextNode;
  elseBlock: ITextNode;
}

const defaultVarNames = ["firstname", "lastname", "company", "position"];
const arrVarNames: string[] =
  storageService.get("arrVarNames") ?? defaultVarNames;
const template: string | null = storageService.get("template");

export const TemplateEditor = (props: ITemplateEditorProps) => {
  const { onHide } = props;
  const [textNode, setTextNode] = useState<ITextNode>({
    parent: null,
    children: template ?? "",
  });

  const [activeNode, setActiveNode] = useState();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Message Template Editor</h1>
        <div className={styles.controlArea}>
          <div className={styles.variables}>
            {arrVarNames.map((name) => (
              <Button variation={ButtonVariations.Variable} key={name}>
                &#123;{name}&#125;
              </Button>
            ))}
          </div>
          <Button variation={ButtonVariations.Light}>IF-THEN-ELSE</Button>
        </div>
        <div className={styles.template}>
          <Template node={textNode} />
        </div>
        <div className={styles.buttons}>
          <Button variation={ButtonVariations.Secondary}>Preview</Button>
          <Button variation={ButtonVariations.Primary}>Save</Button>
          <Button variation={ButtonVariations.Danger} onClick={onHide}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const Template = (props: ITemplateProps) => {
  const { node } = props;

  /*   const divideBlock = () => {
    setNode({
      first: "",
      second: "",
      condition: { ifBlock: "", thenBlock: "", elseBlock: "" },
    });
  }; */

  if (typeof node.children === "string") {
    return <Textarea defaultText={node.children} />;
  }
  const { first, second, condition } = node.children;

  return (
    <div>
      <Template node={first} />
      <div>
        <Textarea defaultText={condition.ifBlock} />
        <Template node={condition.thenBlock} />
        <Template node={condition.elseBlock} />
      </div>
      <Template node={second} />
    </div>
  );
};
