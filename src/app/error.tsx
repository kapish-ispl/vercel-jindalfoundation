"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const APPIMAGES = {
  BG1: "/images/bg/bg_1.jpg",
  BG1_MOB: "/images/bg/bg_1_mob.jpg",
};

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console
    console.error("[Route Error]", error);
  }, [error]);

  return (
    <main className="not-found">
      <div className="not-found__banner">
        {/* Mobile & Tablet Image */}
        <Image
          src={APPIMAGES.BG1_MOB}
          alt="Something went wrong"
          fill
          priority
          className="not-found__image not-found__image--mobile"
        />

        {/* Desktop Image */}
        <Image
          src={APPIMAGES.BG1}
          alt="Something went wrong"
          fill
          priority
          className="not-found__image not-found__image--desktop"
        />

        <div className="not-found__overlay">
          <div className="container h-100">
            <div className="row h-100">
              <div className="col-12 h-100">
                <div className="not-found__content">
                  <h1 className="not-found__title">
                    Something went wrong
                  </h1>

                  <p className="not-found__subtitle">
                    An unexpected error occurred. Please try again or return to the homepage.
                  </p>

                  <div className="not-found__actions">
                    <button
                      onClick={reset}
                      className="not-found__button"
                    >
                      Try Again
                    </button>

                    <Link
                      href="/"
                      className="not-found__button not-found__button--outline"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
