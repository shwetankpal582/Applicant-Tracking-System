import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { ResumeCardSkeleton } from "~/components/Skeleton";
import EmptyState from "~/components/EmptyState";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated, navigate])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      try {
        const resumes = (await kv.list('resume:*', true)) as KVItem[];

        const parsedResumes = resumes?.map((resume) => (
            JSON.parse(resume.value) as Resume
        ))

        setResumes(parsedResumes || []);
      } catch (error) {
        console.error('Failed to load resumes:', error);
        setResumes([]);
      } finally {
        setLoadingResumes(false);
      }
    }

    loadResumes()
  }, [kv]);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>
      {loadingResumes ? (
        <div className="resumes-section">
          {[1, 2, 3].map((i) => (
            <ResumeCardSkeleton key={i} />
          ))}
        </div>
      ) : resumes.length > 0 ? (
        <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      ) : (
        <EmptyState
          variant="resume"
          title="No resumes found"
          description="Upload your first resume to get AI-powered feedback and improve your job application success."
          action={{
            label: "Upload Resume",
            href: "/upload"
          }}
        />
      )}
    </section>
  </main>
}
