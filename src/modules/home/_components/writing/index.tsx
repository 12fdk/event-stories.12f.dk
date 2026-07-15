import { useContext } from "react";
import { withBase } from "../../../../utils/basePath";
import { ConfigContext } from "../../../../utils/configContext";
import type { BlogPostMeta } from "../../../../content/blog";
import { blogPosts } from "../../../../content/blog";

function WritingSection() {
  const { home } = useContext(ConfigContext)!;
  const writing = home?.writing;

  if (!writing || blogPosts.length === 0) return null;

  return (
    <section id={writing.id} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-lg mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-display font-bold tracking-tight">
            {writing.title}
          </h2>
          {writing.subtitle && (
            <p className="text-base-content/70 mt-2">{writing.subtitle}</p>
          )}
        </div>

        {/* Show blog posts in a grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map((post: BlogPostMeta) => (
            <a
              href={`/blog/${post.slug}/`}
              className="group block"
            >
              <div className="bg-base-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  {post.image ? (
                    <img
                      src={withBase(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-base-200" />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-base-content/60 mb-2">
                    <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="w-1 h-1 rounded-full bg-base-content/30" />
                    <span>{post.readingTime} min read</span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      {post.tags.map((tag: string) => (
                        <span className="text-xs bg-base-200 text-base-content/70 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-semibold text-base mb-2 group-hover:underline line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-base-content/60 line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* All posts link */}
        <div className="text-center mt-8">
          <a
            href="/blog/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary link link-hover"
          >
            All posts
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default WritingSection;