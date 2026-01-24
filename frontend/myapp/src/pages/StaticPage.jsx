function StaticPage({ title, content }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
                <div className="prose prose-lg text-gray-600">
                    {content ? (
                        <p>{content}</p>
                    ) : (
                        <>
                            <p className="mb-4">
                                This page is currently under construction. We are working hard to
                                bring you this content.
                            </p>
                            <p>
                                Please check back later or contact us at{" "}
                                <a
                                    href="mailto:support@marketmakers.com"
                                    className="text-primary-600 hover:underline"
                                >
                                    support@marketmakers.com
                                </a>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StaticPage;
