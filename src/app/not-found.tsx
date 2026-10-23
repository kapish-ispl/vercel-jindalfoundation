import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found__banner">
        <Image
          src="/images/bg/bg_1_mob.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="not-found__image not-found__image--mobile"
        />
        <Image
          src="/images/bg/bg_1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="not-found__image not-found__image--desktop"
        />

        <div className="not-found__overlay">
          <div className="container h-100">
            <div className="row h-100">
              <div className="col-12 h-100">
                <div className="not-found__content">
                  <h1 id="not-found-title" className="not-found__title">
                    Page Not Found
                  </h1>
                  <div className="not-found__actions">
                    <Link href="/" className="not-found__button">
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
