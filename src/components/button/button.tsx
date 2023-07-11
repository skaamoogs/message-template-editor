import { PropsWithChildren } from "react";
import style from "./button.module.scss";
import { classnames } from "../../utils/helpers";

export const enum ButtonVariations {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
  Variable = "variable",
}

interface IButtonProps {
  variation: ButtonVariations;
  onClick?: () => void;
}

export const Button = (props: PropsWithChildren<IButtonProps>) => {
  const { children, variation, onClick } = props;

  return (
    <button
      className={classnames(style.btn, style[`btn_${variation}`])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
