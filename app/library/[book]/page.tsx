/**
 * /library/[book] — 单部古籍目录页
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_BOOKS, getBookBySlug } from '@/lib/classics';
import { L, LocaleSwitch } from '@/components/LocaleProvider';
import { BOOK_VI, chapterVi } from '@/lib/i18n/library-vi';

export async function generateStaticParams() {
  return ALL_BOOKS.map(b => ({ book: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};
  const v = BOOK_VI[book.slug];
  return {
    title: `«${v?.title ?? book.title}» (${book.title}) · Thư viện cổ thư Tử Vi`,
    description: v?.intro ?? book.intro,
  };
}

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();
  const v = BOOK_VI[book.slug];
  const titleVi = v?.title ?? book.title;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← <L zh="古籍库" vi="Thư viện cổ thư" />
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          <L zh={`《${book.title}》`} vi={`«${titleVi}»`} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LocaleSwitch />
          <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em', textDecoration: 'none' }}>
            <L zh="首页" vi="Trang chủ" /> →
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* 书名信息 */}
        <div className="text-center mb-12">
          <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.3em', marginBottom: '8px' }}>
            <L zh={`${book.dynasty} · ${book.author}`} vi={`${v?.dynasty ?? book.dynasty} · ${v?.author ?? book.author}`} />
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: '14px' }}>
            <L zh={`《${book.title}》`} vi={<>«{titleVi}»<div style={{ fontSize: '0.5em', fontWeight: 500, opacity: 0.6, marginTop: 6 }}>{book.title}</div></>} />
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
            <L zh={book.intro} vi={v?.intro ?? book.intro} />
          </p>
        </div>

        {/* 章节目录 */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid rgba(184,146,42,0.2)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(184,146,42,0.15)', fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.3em' }}>
            CHAPTERS · <L zh="章节目录" vi="Mục lục chương" />
          </div>
          {book.chapters.map((chapter, i) => (
            <Link
              key={i}
              href={`/library/${book.slug}/${i}`}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                padding: '14px 20px',
                borderBottom: i === book.chapters.length - 1 ? 'none' : '1px dashed rgba(184,146,42,0.15)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background 0.15s',
              }}
              className="hover:bg-amber-50"
            >
              <div style={{ fontSize: '12px', color: 'var(--ac)', fontWeight: 600, minWidth: '40px', letterSpacing: '0.1em' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', color: 'var(--tx-0)', fontWeight: 500, letterSpacing: '0.08em', marginBottom: '2px' }}>
                  <L zh={chapter.title} vi={chapterVi(chapter.title)} />
                </div>
                {chapter.subtitle && (
                  <div style={{ fontSize: '11px', color: 'var(--tx-3)' }}>
                    <L zh={chapter.subtitle} vi={chapterVi(chapter.subtitle)} />
                  </div>
                )}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                {chapter.paragraphs.length} <L zh="段" vi="đoạn" />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ac)' }}>→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
