import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { cn } from "@/components/ui/utils";

export default function CustomCard({ className, children: parts, ...rest }) {
  return (
    <Card className={cn("w-full max-w-md", className)} {...rest}>
      {parts.header && <CardHeader className="pb-2">{parts.header}</CardHeader>}
      {parts.body && <CardBody className="pt-4">{parts.body}</CardBody>}
      {parts.footer && (
        <CardFooter className="text-center">{parts.footer}</CardFooter>
      )}
    </Card>
  );
}
