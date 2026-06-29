import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useGallery } from '../contexts/GalleryContext';
import { getArtworkImages } from '../lib/artworkImages';
import { Modal } from '../components/Modal';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export const WorkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artworks, artistInfo } = useGallery();
  const work = artworks.find(a => a.id === id);

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!work) {
    return <div className="flex-grow flex items-center justify-center p-8">Work not found.</div>;
  }

  const images = getArtworkImages(work);
  const activeImage = images[activeImageIndex] ?? work.imageUrl;

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Inquiry: ${work.title}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nArtwork: ${work.title}\n\n${message}`
    );
    window.location.href = `mailto:${artistInfo.email}?subject=${subject}&body=${body}`;
    setIsInquiryModalOpen(false);
    setName('');
    setEmail('');
    setMessage('');
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Purchase request: ${work.title}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nArtwork: ${work.title}\nPrice: ${work.price > 0 ? `$${work.price.toLocaleString()}` : 'Inquire for price'}\n\nAddress: ${address}\nCity: ${city}\nZIP: ${zipCode}`
    );
    window.location.href = `mailto:${artistInfo.email}?subject=${subject}&body=${body}`;
    setIsPurchaseModalOpen(false);
    setName('');
    setEmail('');
    setAddress('');
    setCity('');
    setZipCode('');
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-[#F7F5F2]">
      <div className="w-full md:w-2/3 h-[60vh] md:h-auto min-h-[calc(100vh-5rem)] bg-[#EAE7E1] flex flex-col items-center justify-center p-8 md:p-16 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center text-[10px] font-bold tracking-widest uppercase text-[#8C7E6D] hover:text-[#2D2926] transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <motion.img
          key={activeImage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={activeImage}
          alt={work.title}
          className="max-w-full max-h-full object-contain shadow-sm border border-[#E5E1DA]"
        />
        {images.length > 1 && (
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
                <img src={url} alt="" className="w-full h-full object-cover" />
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
              <span className="text-right">{work.dimensions}</span>
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
              <>
                <button
                  onClick={() => setIsPurchaseModalOpen(true)}
                  className="w-full py-3 bg-[#2D2926] text-[#F7F5F2] hover:bg-[#5E503F] transition-colors uppercase tracking-widest text-[10px] font-bold"
                >
                  Purchase Selection
                </button>
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="w-full py-3 border border-[#2D2926] text-[#2D2926] hover:bg-[#2D2926] hover:text-[#F7F5F2] transition-colors uppercase tracking-widest text-[10px] font-bold"
                >
                  Send Request
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <Modal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} title="Inquire About Work">
        <form onSubmit={handleInquirySubmit} className="space-y-4">
          <p className="text-xs text-[#5E503F] mb-4">Fill in your details — your email app will open to send the inquiry about "{work.title}".</p>
          <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/50 border border-[#E5E1DA] px-3 py-2 text-[10px] focus:outline-none focus:border-[#8C7E6D]" placeholder="Name" />
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/50 border border-[#E5E1DA] px-3 py-2 text-[10px] focus:outline-none focus:border-[#8C7E6D]" placeholder="Email" />
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-white/50 border border-[#E5E1DA] px-3 py-2 text-[10px] focus:outline-none focus:border-[#8C7E6D] resize-none" rows={3} placeholder="Message (Optional)" />
          <button type="submit" className="w-full border border-[#2D2926] py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#2D2926] hover:text-[#F7F5F2] mt-4">
            Open Email to Send
          </button>
        </form>
      </Modal>

      <Modal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} title="Purchase Request">
        <form onSubmit={handlePurchaseSubmit} className="space-y-4">
          <div className="bg-[#EAE7E1] border border-[#E5E1DA] p-4 mb-4 flex items-center space-x-4">
            <img src={work.imageUrl} alt={work.title} className="w-12 h-12 object-cover border border-[#E5E1DA]" />
            <div>
              <div className="font-serif italic text-sm text-[#2D2926]">{work.title}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#8C7E6D]">
                {work.price > 0 ? `$${work.price.toLocaleString()}` : 'Price on request'}
              </div>
            </div>
          </div>
          <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/50 border border-[#E5E1DA] px-3 py-2 text-[10px] focus:outline-none focus:border-[#8C7E6D]" placeholder="Full Name" />
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/50 border border-[#E5E1DA] px-3 py-2 text-[10px] focus:outline-none focus:border-[#8C7E6D]" placeholder="Email" />
          <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-white/50 border border-[#E5E1DA] px-3 py-2 text-[10px] focus:outline-none focus:border-[#8C7E6D]" placeholder="Street Address" />
          <div className="flex space-x-2">
            <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-1/2 bg-white/50 border border-[#E5E1DA] px-3 py-2 text-[10px] focus:outline-none focus:border-[#8C7E6D]" placeholder="City" />
            <input required type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} className="w-1/2 bg-white/50 border border-[#E5E1DA] px-3 py-2 text-[10px] focus:outline-none focus:border-[#8C7E6D]" placeholder="ZIP / Postal Code" />
          </div>
          <button type="submit" className="w-full border border-[#2D2926] py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#2D2926] hover:text-[#F7F5F2] mt-4">
            Open Email to Send
          </button>
        </form>
      </Modal>
    </div>
  );
};
