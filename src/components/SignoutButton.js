import { signout } from "@/actions/auth";
import Button from "@/components/ui/Button";

export default function SignoutButton() {
  return (
    <form action={signout}>
      <Button type="submit" variant="secondary" size="sm">
        Sign out
      </Button>
    </form>
  );
}
