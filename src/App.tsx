import { Button, ButtonVariations } from "./components/button/button";

function App() {
  return (
    <>
      <Button variation={ButtonVariations.Primary}>Save</Button>
      <Button variation={ButtonVariations.Secondary}>Preview</Button>
      <Button variation={ButtonVariations.Danger}>Close</Button>
      <Button variation={ButtonVariations.Variable}>&#123;company&#125;</Button>
    </>
  );
}

export default App;
