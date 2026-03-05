import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface SkillContentProps {
  content: string;
}

export function SkillContent({ content }: SkillContentProps) {
  return (
    <div className="prose prose-warm max-w-none">
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </Markdown>
    </div>
  );
}
