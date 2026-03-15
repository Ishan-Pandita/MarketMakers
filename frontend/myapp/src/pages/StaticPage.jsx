// src/pages/StaticPage.jsx — Light Theme
function StaticPage({ title, content }) {
  return (
    <div className="min-h-screen bg-surface py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="card p-10 md:p-14">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-heading tracking-tight mb-6 font-display">{title}</h1>
          <div className="text-slate-body leading-relaxed space-y-4">
            {content ? (
              <p className="text-lg">{content}</p>
            ) : (
              <>
                <p>This page is currently under construction. We're working on creating this content.</p>
                <p>
                  Please check back later or contact us at{" "}
                  <a href="mailto:support@marketmakers.com" className="text-indigo-500 hover:text-indigo-700 transition-colors underline underline-offset-4">
                    support@marketmakers.com
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaticPage;
