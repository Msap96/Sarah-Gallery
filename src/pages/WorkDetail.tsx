import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { useGallery } from '../contexts/GalleryContext';
import { getArtworkImages } from '../lib/artworkImages';
import { ArtImage } from '../components/ArtImage';
import { formatDimensions, hasVerifiedScale } from '../lib/dimensions';
import { Modal } from '../components/Modal';
import { RoomView } from '../components/RoomView';
import { NotFound } from './NotFound';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export const WorkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { artworks, artistInfo } = useGallery();
  const work = artworks.find(a => a.id === id);

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [inquiryError, setInquiryError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showInRoom, setShowInRoom] = useState(false);

  if (!work) {
    return <NotFound />;
  }

  const images = getArtworkImages(work);
  const activeImage = images[activeImageIndex] ?? work.imageUrl;

  const handleInquirySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setInquiryResult('idle');
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, artworkId: work.id, website }),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (!response.ok || result?.ok !== true) throw new Error(result?.error || 'The inquiry form is temporarily unavailable. Please try again or email the studio.');
      setInquiryResult('success');
      setName(''); setEmail(''); setMessage(''); setWebsite('');
    } catch (error) {
      setInquiryError(error instanceof Error && error.name === 'Error'
        ? error.message : 'The inquiry could not be confirmed. Please check your connection and try again, or email the studio.');
      setInquiryResult('error');
    } finally { setSending(false); }
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-[#F7F5F2]">
      <div className="w-full md:w-2/3 h-[60vh] md:h-auto min-h-[calc(100vh-5rem)] bg-[#EAE7E1] flex flex-col items-center justify-center p-8 md:p-16 relative">
        <NavLink
          to="/gallery"
          className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center text-[10px] font-bold tracking-widest uppercase text-[#8C7E6D] hover:text-[#2D2926] transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to gallery
        </NavLink>
        {showInRoom && hasVerifiedScale(work) ? (
          <motion.div
            key="room-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center"
          >
            <RoomView work={work} />
          </motion.div>
        ) : (
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-full max-h-full flex items-center justify-center"
          >
            <ArtImage
              src={activeImage}
              alt={work.title}
              priority
              fit="contain"
              sizes="(min-width: 768px) 66vw, 100vw"
              className="max-w-full max-h-full object-contain shadow-sm border border-[#E5E1DA]"
            />
          </motion.div>
        )}

        {hasVerifiedScale(work) && (
          <div className="flex gap-6 mt-6 text-[10px] uppercase tracking-widest font-bold">
            <button
              type="button"
              onClick={() => setShowInRoom(false)}
              aria-pressed={!showInRoom}
              className={`transition-opacity hover:opacity-100 ${
                showInRoom
                  ? 'opacity-40'
                  : 'opacity-100 underline underline-offset-8 decoration-[#8C7E6D]'
              }`}
            >
              Artwork
            </button>
            <button
              type="button"
              onClick={() => setShowInRoom(true)}
              aria-pressed={showInRoom}
              className={`transition-opacity hover:opacity-100 ${
                showInRoom
                  ? 'opacity-100 underline underline-offset-8 decoration-[#8C7E6D]'
                  : 'opacity-40'
              }`}
            >
              View to Scale
            </button>
          </div>
        )}

        {!showInRoom && images.length > 1 && (
          <div className="flex gap-3 mt-6">
            {images.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`w-16 h-16 border overflow-hidden transition-opacity ${
                  index === activeImageIndex
                    ? 'border-[#2D2926] opacity-100'
                    : 'border-[#E5E1DA] opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${index + 1} of ${images.length}`}
              >
                <ArtImage
                  src={url}
                  alt=""
                  sizes="64px"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-1/3 p-8 border-l border-[#E5E1DA] md:p-12 flex flex-col justify-center min-h-[50vh] bg-[#F7F5F2]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl lg:text-3xl font-serif mb-1 italic text-[#2D2926]">{work.title}</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#8C7E6D] mb-8">{work.medium}, {work.year}</p>

          <div className="space-y-4 text-[10px] uppercase tracking-widest text-[#2D2926] mb-12">
            <div className="flex justify-between border-b border-[#E5E1DA] pb-2">
              <span className="opacity-40">Dimensions</span>
              <span className="text-right">{formatDimensions(work)}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E1DA] pb-2">
              <span className="opacity-40">Price</span>
              <span className="text-right font-bold">
                {work.price > 0 ? `$${work.price.toLocaleString()}` : 'Inquire for price'}
              </span>
            </div>
          </div>

          {work.description && (
            <div className="mb-12">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-[#8C7E6D]">About the work</h3>
              <p className="font-serif text-lg leading-relaxed italic text-[#5E503F]">{work.description}</p>
            </div>
          )}

          <div className="flex flex-col space-y-4 mt-auto">
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[#8C7E6D]">Acquisition</h3>
            {work.status === 'sold' ? (
              <button disabled className="w-full py-3 border border-[#E5E1DA] text-[#8C7E6D] cursor-not-allowed uppercase tracking-widest text-[10px] font-bold">
                Sold Out
              </button>
            ) : work.status === 'not-for-sale' ? (
              <button disabled className="w-full py-3 border border-[#E5E1DA] text-[#8C7E6D] cursor-not-allowed uppercase tracking-widest text-[10px] font-bold">
                Not for Sale
              </button>
            ) : (
              <button
                onClick={() => { setInquiryResult('idle'); setIsInquiryModalOpen(true); }}
                className="w-full py-3 bg-[#2D2926] text-[#F7F5F2] hover:bg-[#5E503F] transition-colors uppercase tracking-widest text-[10px] font-bold"
              >
                Inquire about this work
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <Modal isOpen={isInquiryModalOpen} onClose={() => { if (!sending) setIsInquiryModalOpen(false); }} title="Inquire About Work">
        {inquiryResult === 'success' ? (
          <div role="status" className="text-sm leading-relaxed">
            <p>Your inquiry has been sent to the studio. Sarah can reply to your email address.</p>
            <button type="button" className="mt-6 border border-[#2D2926] px-4 py-3" onClick={() => setIsInquiryModalOpen(false)}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-4" aria-busy={sending}>
            <p className="text-xs text-[#5E503F]">Ask about “{work.title}”. The studio will respond by email.</p>
            <label className="block text-xs" htmlFor="inquiry-name">Name</label>
            <input disabled={sending} id="inquiry-name" name="name" autoComplete="name" required maxLength={120} type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/50 border border-[#E5E1DA] px-3 py-2 text-sm" />
            <label className="block text-xs" htmlFor="inquiry-email">Email</label>
            <input disabled={sending} id="inquiry-email" name="email" autoComplete="email" required maxLength={254} type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/50 border border-[#E5E1DA] px-3 py-2 text-sm" />
            <label className="block text-xs" htmlFor="inquiry-message">Message (optional)</label>
            <textarea disabled={sending} id="inquiry-message" name="message" maxLength={5000} value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-white/50 border border-[#E5E1DA] px-3 py-2 text-sm resize-none" rows={3} />
            <div hidden aria-hidden="true">
              <label htmlFor="inquiry-website">Website</label>
              <input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
            </div>
            {inquiryResult === 'error' && <p role="alert" className="text-sm text-red-800">{inquiryError}</p>}
            <button disabled={sending} type="submit" className="w-full border border-[#2D2926] py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#2D2926] hover:text-[#F7F5F2] disabled:opacity-50">
              {sending ? 'Sending…' : 'Send inquiry'}
            </button>
            <p className="text-xs leading-relaxed text-[#5E503F]">Your name, email and message are used to respond to this inquiry.</p>
            <p className="text-xs">You can also email <a className="underline break-all" href={`mailto:${artistInfo.email}`}>{artistInfo.email}</a>.</p>
          </form>
        )}
      </Modal>
    </div>
  );
};
