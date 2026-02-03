import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ExternalLink, AlertTriangle, Eye, TrendingUp, 
  FileText, Users, Clock, Share2, Bookmark, Filter,
  ChevronRight, Flame, Lock, Unlock, DollarSign
} from 'lucide-react';
import './Epstein.css';

const Epstein = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Viral headline articles with SEO-rich trending phrases
  const viralArticles = [
    {
      id: 1,
      headline: "SHOCKING: Jeffrey Epstein's Secret Island Files EXPOSED - What They Don't Want You To Know",
      image: "/epstein_black_cape_pentagram.png",
      category: "BREAKING",
      views: "2.4M",
      timeAgo: "2 hours ago",
      trending: true,
      excerpt: "Newly unsealed documents reveal disturbing connections to world leaders and celebrities. The truth is finally coming out..."
    },
    {
      id: 2,
      headline: "The Epstein Files: 177 Names REVEALED - Celebrities, Politicians, and Billionaires",
      image: "/ritual_circle_red_capes.png",
      category: "EXCLUSIVE",
      views: "3.8M",
      timeAgo: "5 hours ago",
      trending: true,
      excerpt: "Court documents finally unsealed. See the full list of names that were kept hidden for years..."
    },
    {
      id: 3,
      headline: "Ghislaine Maxwell's Prison Confession: 'I'm Not The Only One Who Knows'",
      image: "/ghislaine_red_hood.png",
      category: "INVESTIGATION",
      views: "1.9M",
      timeAgo: "8 hours ago",
      trending: true,
      excerpt: "Leaked prison recordings suggest more revelations are coming. What is she hiding?"
    },
    {
      id: 4,
      headline: "Flight Logs Don't Lie: Private Jet Records Show Disturbing Pattern",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
      category: "EVIDENCE",
      views: "2.1M",
      timeAgo: "12 hours ago",
      trending: false,
      excerpt: "Detailed analysis of Epstein's private jet travel reveals shocking frequency of trips to Little St. James..."
    },
    {
      id: 5,
      headline: "The Black Book: Every Name, Every Connection, Every Secret EXPOSED",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800",
      category: "DATABASE",
      views: "4.2M",
      timeAgo: "1 day ago",
      trending: true,
      excerpt: "Complete database of Epstein's contacts. Search by name, see the connections they tried to hide..."
    },
    {
      id: 6,
      headline: "Why Did The Cameras 'Malfunction'? Prison Guard Breaks Silence",
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800",
      category: "CONSPIRACY",
      views: "3.3M",
      timeAgo: "1 day ago",
      trending: false,
      excerpt: "Former guard speaks out about the night Jeffrey Epstein died. 'Nothing about that night made sense...'"
    }
  ];

  // Key figures from Epstein files with case file mentions and direct search links
  const keyFigures = [
    { name: "Jeffrey Epstein", mentions: 2847, status: "deceased", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Jeffrey+Epstein" },
    { name: "Ghislaine Maxwell", mentions: 1923, status: "imprisoned", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Ghislaine+Maxwell" },
    { name: "Prince Andrew", mentions: 847, status: "accused", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Prince+Andrew" },
    { name: "Bill Clinton", mentions: 673, status: "mentioned", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Bill+Clinton" },
    { name: "Donald Trump", mentions: 521, status: "mentioned", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Donald+Trump" },
    { name: "Alan Dershowitz", mentions: 412, status: "accused", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Alan+Dershowitz" },
    { name: "Les Wexner", mentions: 389, status: "investigated", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Les+Wexner" },
    { name: "Jean-Luc Brunel", mentions: 356, status: "deceased", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Jean-Luc+Brunel" },
    { name: "Elon Musk", mentions: 127, status: "mentioned", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Elon+Musk" },
    { name: "Bill Gates", mentions: 243, status: "mentioned", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Bill+Gates" },
    { name: "Stephen Hawking", mentions: 89, status: "mentioned", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Stephen+Hawking" },
    { name: "Kevin Spacey", mentions: 156, status: "mentioned", image: "👤", searchUrl: "https://epsteinfilez.com/?s=Kevin+Spacey" },
  ];

  // Affiliate products (high-ticket security/investigation tools)
  const affiliateProducts = [
    {
      name: "GoHighLevel CRM",
      description: "Professional investigation tracking & case management",
      commission: "$497/sale",
      link: "#",
      badge: "HIGH COMMISSION"
    },
    {
      name: "Deepfake Detection Pro",
      description: "Verify authenticity of photos and videos",
      commission: "$297/sale",
      link: "#",
      badge: "TRENDING"
    },
    {
      name: "Dark Web Monitoring",
      description: "Track leaked documents and hidden information",
      commission: "$197/month",
      link: "#",
      badge: "RECURRING"
    }
  ];

  return (
    <div className="truecrime-container">
      {/* Legal Disclaimer Banner */}
      <div className="disclaimer-banner">
        <AlertTriangle size={20} />
        <span>
          <strong>DISCLAIMER:</strong> This site presents publicly available information, court documents, and investigative journalism. 
          Content may include speculation and unverified claims. All individuals are presumed innocent until proven guilty.
        </span>
      </div>

      {/* Hero Section */}
      <motion.div 
        className="truecrime-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Flame size={20} />
            <span>VIRAL INVESTIGATION</span>
          </motion.div>
          <h1>THE EPSTEIN FILES</h1>
          <p className="hero-subtitle">
            Uncovering the Truth Behind the World's Most Notorious Scandal
          </p>
          <div className="hero-stats">
            <div className="stat">
              <strong>15.7M+</strong>
              <span>Total Views</span>
            </div>
            <div className="stat">
              <strong>2,847</strong>
              <span>Documents</span>
            </div>
            <div className="stat">
              <strong>177</strong>
              <span>Named Individuals</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <Search size={24} />
          <input
            type="text"
            placeholder="Search names, documents, flight logs, connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">
            <span>SEARCH FILES</span>
            <ChevronRight size={20} />
          </button>
        </div>
        <a href="https://epsteinfilez.com" target="_blank" rel="noopener noreferrer" className="external-link">
          <ExternalLink size={18} />
          <span>Access Full Epstein Files Database</span>
        </a>
      </div>

      {/* Trending Articles Grid */}
      <div className="content-section">
        <div className="section-header">
          <h2>
            <TrendingUp size={28} />
            TRENDING NOW
          </h2>
          <div className="filter-tabs">
            <button className="tab active">All</button>
            <button className="tab">Breaking</button>
            <button className="tab">Exclusive</button>
            <button className="tab">Investigation</button>
          </div>
        </div>

        <div className="articles-grid">
          {viralArticles.map((article, index) => (
            <motion.article
              key={article.id}
              className="article-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
            >
              {article.trending && (
                <div className="trending-badge">
                  <Flame size={16} />
                  TRENDING
                </div>
              )}
              <div className="article-image-container">
                <img src={article.image} alt={article.headline} className="article-image" />
                <div className="article-category">{article.category}</div>
              </div>
              <div className="article-content">
                <h3 className="article-headline">{article.headline}</h3>
                <p className="article-excerpt">{article.excerpt}</p>
                <div className="article-meta">
                  <div className="meta-item">
                    <Eye size={16} />
                    <span>{article.views} views</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{article.timeAgo}</span>
                  </div>
                </div>
                <div className="article-actions">
                  <button className="btn-primary">
                    READ FULL STORY
                    <ChevronRight size={18} />
                  </button>
                  <button className="btn-icon">
                    <Share2 size={20} />
                  </button>
                  <button className="btn-icon">
                    <Bookmark size={20} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Key Figures Section */}
      <div className="content-section">
        <div className="section-header">
          <h2>
            <Users size={28} />
            KEY FIGURES IN THE FILES
          </h2>
          <p className="section-subtitle">Click any name to see their complete file history and connections</p>
        </div>

        <div className="figures-grid">
          {keyFigures.map((figure, index) => (
            <motion.a
              key={index}
              href={figure.searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`figure-card status-${figure.status}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="figure-portrait">{figure.image}</div>
              <div className="figure-info">
                <h4>{figure.name}</h4>
                <div className="figure-mentions">
                  <FileText size={16} />
                  <strong>{figure.mentions}</strong> mentions
                </div>
                <div className={`figure-status ${figure.status}`}>
                  {figure.status === 'imprisoned' && <Lock size={14} />}
                  {figure.status === 'accused' && <AlertTriangle size={14} />}
                  {figure.status === 'deceased' && '†'}
                  <span>{figure.status.toUpperCase()}</span>
                </div>
                <div className="search-link-badge">
                  <Search size={14} />
                  <span>VIEW FILES</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Affiliate Products Section */}
      <div className="content-section affiliate-section">
        <div className="section-header">
          <h2>
            <DollarSign size={28} />
            PROFESSIONAL INVESTIGATION TOOLS
          </h2>
          <p className="section-subtitle">Tools used by professional investigators and journalists</p>
        </div>

        <div className="affiliate-grid">
          {affiliateProducts.map((product, index) => (
            <motion.div
              key={index}
              className="affiliate-card"
              whileHover={{ y: -5 }}
            >
              <div className="affiliate-badge">{product.badge}</div>
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <div className="affiliate-commission">
                Earn <strong>{product.commission}</strong> per referral
              </div>
              <a href={product.link} className="affiliate-btn" target="_blank" rel="noopener noreferrer">
                GET ACCESS NOW
                <ChevronRight size={18} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Social Media Feeds */}
      <div className="content-section">
        <div className="section-header">
          <h2>
            <TrendingUp size={28} />
            LIVE SOCIAL MEDIA BUZZ
          </h2>
          <p className="section-subtitle">Real-time posts and discussions about the Epstein case from across social media</p>
        </div>

        <div className="social-feeds-grid">
          {/* Twitter/X Feed */}
          <div className="feed-card">
            <div className="feed-header">
              <h3>𝕏 (Twitter)</h3>
              <span className="live-indicator">🔴 LIVE</span>
            </div>
            <div className="feed-embed">
              <a 
                className="twitter-timeline" 
                data-theme="dark" 
                data-height="600" 
                href="https://twitter.com/search?q=epstein%20OR%20%22epstein%20files%22%20OR%20%22ghislaine%20maxwell%22&src=typed_query&f=live"
              >
                Loading latest posts about Epstein...
              </a>
            </div>
          </div>

          {/* TikTok Feed */}
          <div className="feed-card">
            <div className="feed-header">
              <h3>TikTok</h3>
              <span className="live-indicator">🔴 LIVE</span>
            </div>
            <div className="feed-embed">
              <iframe
                src="https://www.tiktok.com/embed/tag/epstein"
                width="100%"
                height="600"
                frameBorder="0"
                allow="encrypted-media"
                title="TikTok Epstein Feed"
              ></iframe>
            </div>
          </div>

          {/* Instagram Feed */}
          <div className="feed-card">
            <div className="feed-header">
              <h3>Instagram</h3>
              <span className="live-indicator">🔴 LIVE</span>
            </div>
            <div className="feed-embed">
              <div className="instagram-feed-placeholder">
                <a 
                  href="https://www.instagram.com/explore/tags/epstein/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="feed-link"
                >
                  <span>View Latest #Epstein Posts on Instagram</span>
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h2>Stay Updated on Breaking Developments</h2>
        <p>Get instant notifications when new documents are unsealed or major revelations emerge</p>
        <div className="cta-form">
          <input type="email" placeholder="Enter your email..." className="cta-input" />
          <button className="cta-btn">
            SUBSCRIBE NOW
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="social-share">
          <span>Share this investigation:</span>
          <button className="social-btn facebook">Facebook</button>
          <button className="social-btn twitter">Twitter</button>
          <button className="social-btn linkedin">LinkedIn</button>
          <button className="social-btn tiktok">TikTok</button>
        </div>
      </div>
    </div>
  );
};

export default Epstein;
