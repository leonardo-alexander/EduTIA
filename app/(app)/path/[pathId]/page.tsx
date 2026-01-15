import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PathDetails from "@/components/PathDetails";

type Props = {
  params: Promise<{ pathId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pathId } = await params;
  const path = await prisma.learningPath.findUnique({
    where: { id: pathId },
  });

  if (!path) {
    return {
      title: "Path Not Found",
    };
  }

  return {
    title: `${path.title} | Learning Path`,
    description: path.description,
  };
}

export default async function PathDetailsPage({ params }: Props) {
  const { pathId } = await params;

  const path = await prisma.learningPath.findUnique({
    where: {
      id: pathId,
    },
    include: {
      items: {
        include: {
          course: {
            include: {
              category: true,
              _count: {
                select: {
                  items: true,
                },
              },
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!path) {
    notFound();
  }

  return <PathDetails path={path} />;
}