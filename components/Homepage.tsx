"use client";

import Link from "next/link";
import {
  CheckCircle2,
  User,
  Briefcase,
  Waypoints,
  Users,
  Award,
  Quote,
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { CourseUI } from "@/types/course.ui";

type HomepageProps = {
  topCourses: CourseUI[];
  isAuthenticated: boolean;
};

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Frontend Developer",
    content:
      "EduTia changed the trajectory of my career. The React course was exactly what I needed to land my first dev job.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Data Analyst",
    content:
      "The depth of the Data Science curriculum is unmatched. I went from knowing zero Python to building ML models in weeks.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Digital Marketer",
    content:
      "Practical, hands-on, and up-to-date. The digital marketing masterclass gave me strategies.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "UX Designer",
    content:
      "The instructor feedback on my portfolio projects was invaluable. It helped me polish my work to professional standards.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Emily Watson",
    role: "Product Manager",
    content:
      "I took the business strategy course to better understand my role. It was a game-changer for my communication.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: 6,
    name: "James Kim",
    role: "Software Engineer",
    content:
      "The backend bootcamp is brutal but worth it. You really learn how things work under the hood.",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 7,
    name: "Amanda Martinez",
    role: "Freelance Designer",
    content:
      "Flexibility is key for me. EduTia allowed me to learn new design tools late at night after my client work was done.",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 8,
    name: "Robert Taylor",
    role: "Cybersecurity Analyst",
    content:
      "Excellent content on network security. The labs were very realistic and prepared me well for my certification.",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    id: 9,
    name: "Lisa Anderson",
    role: "HR Specialist",
    content:
      "We use EduTia for our internal team training. The progress tracking features make my job so much easier.",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    id: 10,
    name: "Thomas Wilson",
    role: "Mobile Developer",
    content:
      "Flutter vs React Native? This platform helped me decide and master the right tool for my startup idea.",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

export default function Homepage({
  topCourses,
  isAuthenticated,
}: HomepageProps) {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900 selection:bg-blue-100 flex flex-col overflow-hidden">
      <main className="grow">
        <section className="relative flex items-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.15]">
                  Learn Skills That{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-eduBlue to-purple-600">
                    Matter.
                  </span>
                </h1>
                <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  We help learners build practical skills, gain knowledge, and
                  bridge the gap between education and real-world opportunities.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href="/courses"
                    className="px-8 py-4 rounded-xl font-bold text-white text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto bg-eduBlue"
                  >
                    Explore Courses
                  </Link>
                  {!isAuthenticated && (
                    <Link
                      href="/login"
                      className="px-8 py-4 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </div>

              <div className="lg:w-1/2 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                    alt="Students learning"
                    className="w-full h-auto object-cover"
                  />

                  {/* Floating Stats Card 1 */}
                  <div className="absolute top-8 left-8 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">
                        Success Rate
                      </p>
                      <p className="text-slate-900 font-bold">98% Hired</p>
                    </div>
                  </div>

                  {/* Floating Stats Card 2 */}
                  <div
                    className="absolute bottom-8 right-8 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce-slow"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-eduBlue" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">
                        Active Learners
                      </p>
                      <p className="text-slate-900 font-bold">120k+ Students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 text-white bg-eduBlue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Core Features</h2>
              <p className="text-blue-100 text-lg">
                Everything you need to bridge the gap to your dream career.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mx-15 lg:mx-0">
              <div className="group p-6 rounded-2xl bg-white text-slate-900 shadow-lg hover:shadow-xl flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-eduBlue">
                  <Waypoints className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2">Skill-sharing</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Curated learning paths tailored specifically for different job
                  roles and industries.
                </p>
              </div>

              <div className="group p-6 rounded-2xl bg-white text-slate-900 shadow-lg hover:shadow-xl flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-600">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2">Job Listing</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Exclusive access to job openings matched to your completed
                  courses and skills.
                </p>
              </div>

              <div className="group p-6 rounded-2xl bg-white text-slate-900 shadow-lg hover:shadow-xl flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2">Workshop</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Interactive hands-on sessions with experts to master practical
                  skills in real-time.
                </p>
              </div>

              <div className="group p-6 rounded-2xl bg-white text-slate-900 shadow-lg hover:shadow-xl flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-orange-600">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2">Certification & CV</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Industry-recognized certificates and professional CV reviews
                  to stand out.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Available Courses
              </h2>
              <p className="text-slate-600 text-lg">
                Start your journey with our top-rated programs.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mx-15 lg:mx-0">
              {topCourses?.length ? (
                topCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isAuthenticated={isAuthenticated}
                  />
                ))
              ) : (
                <p className="text-center text-slate-500">
                  No courses available.
                </p>
              )}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/courses"
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10"
              >
                View All Courses
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What our students say
              </h2>
              <p className="text-slate-600 text-lg">
                Join thousands of satisfied learners achieving their goals.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10"></div>

            <div className="flex gap-6 animate-scroll hover:pause-scroll w-max px-4">
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${idx}`}
                  className="w-87.5 shrink-0 bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="mb-4">
                    <Quote className="w-6 h-6 text-blue-300 fill-current" />
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed italic text-sm line-clamp-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-slate-500 text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-350px * 10 - 24px * 10)); } /* Width of card + gap * number of items */
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        
        .hover\\:pause-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
