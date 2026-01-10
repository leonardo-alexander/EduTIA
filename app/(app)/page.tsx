import Homepage from "../../components/Homepage";
import { getCurrentUser } from "@/lib/auth";

export default async function Page() {
  const user = await getCurrentUser();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/top`,
    {
      cache: "no-store",
    }
  );

  const { data: topCourses } = await res.json();

  return <Homepage user={user} topCourses={topCourses} />;
}
