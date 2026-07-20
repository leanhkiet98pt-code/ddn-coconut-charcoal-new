// Dải tiêu đề đầu trang (dùng chung cho các trang con): nền than, kicker vàng.
export function PageHeader({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string }) {
  return (
    <section className="bg-ink-900 text-white">
      <div className="container-content py-14 sm:py-20">
        {eyebrow ? <p className="eyebrow !text-gold-400">{eyebrow}</p> : null}
        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-2xl text-lg text-sand-200/90">{subtitle}</p> : null}
      </div>
    </section>
  )
}
