import HeaderClient from "./Header.client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CategoryUI } from "@/types/category-ui";

export default async function Header() {
  const user = await getCurrentUser();
  const categories: CategoryUI[] = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });

  return <HeaderClient user={user} categories={categories} />;
}
