import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { ResumeCardSkeleton } from "~/components/Skeleton";
import EmptyState from "~/components/EmptyState";
import ErrorBoundary from "~/components/ErrorBoundary";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated, navigate])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      setError(null);

      try {
        const resumes = (await kv.list('resume:*', true)) as KVItem[];

        if (!resumes) {
          setResumes([]);
          return;
        }

        const parsedResumes = resumes.map((resume) => {
          try {
            return JSON.parse(resume.value) as Resume;
          } catch (parseError) {
            console.error('Failed to parse resume:', parseError);
            return null;
          }
        }).filter((resume): resume is Resume => resume !== null);

        setResumes(parsedResumes);
      } catch (error) {
        console.error('Failed to load resumes:', error);
        setError('Failed to load resumes. Please try again.');
        setResumes([]);
      } finally {
        setLoadingResumes(false);
      }
    }

    if (auth.isAuthenticated) {
      loadResumes();
    }
  }, [kv, auth.isAuthenticated]);

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
      ) : error ? (
        <div className="resumes-section">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      ) : resumes.length > 0 ? (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ErrorBoundary key={resume.id}>
              <ResumeCard resume={resume} />
            </ErrorBoundary>
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
