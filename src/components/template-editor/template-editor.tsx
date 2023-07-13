import { useState } from "react";
import { storageService } from "../../service/storage";
import { Button, ButtonVariations } from "../button/button";
import styles from "./template-editor.module.scss";
import { Template } from "../template/template";

interface ITemplateEditorProps {
  onHide: () => void;
}

export interface ITextNode {
  id: number;
  text: { value: string; caretPosition: number };
  label?: string;
  children: {
    first: ITextNode;
    condition: IConditionBlock;
    second: ITextNode;
  } | null;
}

interface IConditionBlock {
  ifBlock: ITextNode;
  thenBlock: ITextNode;
  elseBlock: ITextNode;
}

const defaultVarNames = ["firstname", "lastname", "company", "position"];
const arrVarNames: string[] =
  storageService.get("arrVarNames") ?? defaultVarNames;
const template: string | null = storageService.get("template");

const createNode = (id?: number, text?: string, label?: string) => ({
  id: id ?? 0,
  label,
  text: { value: text ?? "", caretPosition: 0 },
  children: null,
});

const textTree = createNode(0, template ?? "");

const findNode = (id: number, tree: ITextNode): ITextNode | undefined => {
  if (id === tree.id) return tree;
  if (!tree.children) return;

  let node = findNode(id, tree.children.first);
  if (node) return node;
  node = findNode(id, tree.children.condition.thenBlock);
  if (node) return node;
  node = findNode(id, tree.children.condition.elseBlock);
  if (node) return node;
  node = findNode(id, tree.children.second);
  if (node) return node;
};

const addNewNode = (id: number, countNode: number) => {
  const node = findNode(id, textTree);
  console.log(node, textTree);
  if (node) {
    node.children = {
      first: createNode(
        countNode++,
        node.text.value.slice(0, node.text.caretPosition),
        node.label
      ),
      condition: {
        ifBlock: createNode(countNode++, "", "IF"),
        thenBlock: createNode(countNode++, "", "THEN"),
        elseBlock: createNode(countNode++, "", "ELSE"),
      },
      second: createNode(
        countNode++,
        node.text.value.slice(node.text.caretPosition)
      ),
    };
  }
  return countNode;
};

export const TemplateEditor = (props: ITemplateEditorProps) => {
  const { onHide } = props;

  const [activeNodeId, setActiveNodeId] = useState<number>(0);
  const [countNode, setCountNode] = useState(0);

  const divideBlock = () => {
    setCountNode(addNewNode(activeNodeId, countNode));
  };

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
          <Button variation={ButtonVariations.Light} onClick={divideBlock}>
            IF-THEN-ELSE
          </Button>
        </div>
        <Template
          node={textTree}
          focusHandler={(id) => setActiveNodeId(id)}
          root
        />
        <div className={styles.buttons}>
          <Button
            variation={ButtonVariations.Secondary}
            onClick={() => console.log(textTree)}
          >
            Preview
          </Button>
          <Button variation={ButtonVariations.Primary}>Save</Button>
          <Button variation={ButtonVariations.Danger} onClick={onHide}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
