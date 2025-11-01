import { createFileRoute } from "@tanstack/react-router";
import { Mermaid, type MermaidProps } from "@/components/mermaid";
import { useAppStore } from "@/store/appStore";

export const Route = createFileRoute("/playground/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const editorText = useAppStore((state) => state.editorText);
  const setMermaidError = useAppStore((state) => state.setMermaidError);

  const mermaidProps: MermaidProps = {
    text: editorText,
    onError: setMermaidError,
  };

  return (
    <div className="w-full h-full">
      <Mermaid {...mermaidProps} />
    </div>
  );
}
