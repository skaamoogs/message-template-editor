import { Button, ButtonVariations } from "./components/button/button";
import { Textarea } from "./components/textarea/textarea";

function App() {
  return (
    <>
      <Textarea changeHandler={(valeu) => console.log("change value")} />
      <Button variation={ButtonVariations.Primary}>
        <img src="confirm.svg" alt="save icon" />
        <span>Save</span>
      </Button>
      <Button variation={ButtonVariations.Secondary}>Preview</Button>
      <Button variation={ButtonVariations.Danger}>
        <img src="close.svg" alt="close icon" />
        <span>Close</span>
      </Button>
      <Button variation={ButtonVariations.Variable}>&#123;company&#125;</Button>
    </>
  );
}

export default App;
