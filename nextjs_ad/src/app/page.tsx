import HomePage from "@/components/layout/homepage";
import { signIn } from "@/auth";

export default function Home() {
  return (
    <div>
      <HomePage />
      <form
        action={async (formData) => {
          "use server";
          await signIn();
        }}
      >
        <button>Sign In</button>
      </form>
    </div>
  );
}
