
function HeroBanner({ title, titleRed, description, ctaLabel = "Tìm hiểu khóa học" }) {
  return (
    <section className="bg-amber-50 py-14 text-center px-4">
      <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
        {title}
        {titleRed && (
          <>
            <br />
            <span className="text-red-600">{titleRed}</span>
          </>
        )}
      </h1>
      {description && (
        <p className="mt-3 text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      <button className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-2.5 rounded-full text-sm transition-colors">
        {ctaLabel}
      </button>
    </section>
  );
}
