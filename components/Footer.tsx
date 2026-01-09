import Link from "next/link";

type CategoryUI = {
  id: string;
  name: string;
  slug: string;
};

export default async function Footer() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`);

  const categories: CategoryUI[] = await res.json();
  const categoriesUI = (categories ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    href: `/courses?category=${category.slug}`,
  }));

  return (
    <footer className="bg-muted/30 bg-eduBlue text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/logo/white.svg" alt="EduTIA Logo" className="w-30" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Education and Training for Inspired Advancement
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Courses</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {categoriesUI.map((category) => (
                <li key={category.id}>
                  <Link
                    href={category.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {category.name}
                    <span className="sr-only">, {category.name} courses</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 EduTIA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
