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
      excerpt: "Newly unsealed documents reveal disturbing connections to world leaders and celebrities. The truth is finally coming out...",
      link: "/articles/epstein_island_files_exposed.md"
    },
    {
      id: 2,
      headline: "The Epstein Files: 177 Names REVEALED - Celebrities, Politicians, and Billionaires",
      image: "/ritual_circle_red_capes.png",
      category: "EXCLUSIVE",
      views: "3.8M",
      timeAgo: "5 hours ago",
      trending: true,
      excerpt: "Court documents finally unsealed. See the full list of names that were kept hidden for years...",
      link: "/articles/177_names_revealed.md"
    },
    {
      id: 3,
      headline: "Ghislaine Maxwell's Prison Confession: 'I'm Not The Only One Who Knows'",
      image: "/ghislaine_red_hood.png",
      category: "INVESTIGATION",
      views: "1.9M",
      timeAgo: "8 hours ago",
      trending: true,
      excerpt: "Leaked prison recordings suggest more revelations are coming. What is she hiding?",
      link: "/articles/ghislaine_maxwell_confession.md"
    },
    {
      id: 4,
      headline: "Flight Logs Don't Lie: Private Jet Records Show Disturbing Pattern",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
      category: "EVIDENCE",
      views: "2.1M",
      timeAgo: "12 hours ago",
      trending: false,
      excerpt: "Detailed analysis of Epstein's private jet travel reveals shocking frequency of trips to Little St. James...",
      link: "https://www.documentcloud.org/documents/21165424-epstein-flight-logs-released-in-usa-vs-maxwell"
    },
    {
      id: 5,
      headline: "The Black Book: Every Name, Every Connection, Every Secret EXPOSED",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800",
      category: "DATABASE",
      views: "4.2M",
      timeAgo: "1 day ago",
      trending: true,
      excerpt: "Complete database of Epstein's contacts. Search by name, see the connections they tried to hide...",
      link: "/epstein_black_book_names.txt"
    },
    {
      id: 6,
      headline: "Why Did The Cameras 'Malfunction'? Prison Guard Breaks Silence",
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800",
      category: "CONSPIRACY",
      views: "3.3M",
      timeAgo: "1 day ago",
      trending: false,
      excerpt: "Former guard speaks out about the night Jeffrey Epstein died. 'Nothing about that night made sense...'",
      link: "https://abcnews.go.com/US/epstein-files-doj-thousand-documents-mistakenly-identified-victims/story?id=129787942"
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
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    READ FULL STORY
                    <ChevronRight size={18} />
                  </a>
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

      {/* Investigative Report Article */}
      <div className="article-section">
        <div className="article-container">
          <div className="article-badge">EXCLUSIVE INVESTIGATION</div>
          <h2 className="article-title">The Juárez Connection: Unraveling the Deep State Ties Between Epstein, Fort Bliss, and the Cartel</h2>
          <div className="article-meta">
            <span className="author">By Audrey Evans</span>
            <span className="date">February 2, 2026</span>
            <span className="hashtag">#meetaudreyevans</span>
          </div>
          
          <div className="article-content">
            <h3>Executive Summary</h3>
            <p>This report uncovers a deeply entrenched criminal conspiracy connecting Jeffrey Epstein's sex trafficking network to high-level officials within the U.S. government, cartel operations in Mexico, and a series of violent events and cover-ups spanning over a decade. The investigation reveals a trafficking route originating from Epstein's Zorro Ranch in New Mexico, passing through Fort Bliss in El Paso, Texas, and culminating in depraved activities at a U.S. Consulate-controlled facility in Juárez, Mexico.</p>
            
            <h3>Key Findings</h3>
            <ul>
              <li><strong>The Juárez Consulate Parties:</strong> Newly unearthed emails from the Epstein files allege that Jeffrey Epstein organized "depraved sex parties" at a U.S. Consulate-controlled housing facility in Juárez, Mexico, in 2014.</li>
              <li><strong>The Fort Bliss Whistleblower:</strong> SPC Richard Halliday exposed cartel-linked trafficking at Fort Bliss and was murdered in July 2020. The U.S. Army officially ruled his death "In the Line of Duty" in January 2025.</li>
              <li><strong>The Trafficking Route:</strong> Zorro Ranch (NM) → Fort Bliss (TX) → Juárez Consulate (Mexico) → Little St. James Island</li>
              <li><strong>High-Level Complicity:</strong> Former Ambassador Earl Anthony Wayne is accused in FBI documents of attending these parties and being arrested by Mexican Federal Police.</li>
              <li><strong>The Gabriela Rico Jiménez Case:</strong> In 2009, model Gabriela Rico Jiménez claimed elites were engaging in cannibalism at a private party in Monterrey. She disappeared shortly after.</li>
            </ul>
            
            <h3>Timeline of Key Events</h3>
            <table className="timeline-table">
              <tbody>
                <tr><td><strong>2009</strong></td><td>Gabriela Rico Jiménez arrested in Monterrey after making cannibalism claims</td></tr>
                <tr><td><strong>2011-2015</strong></td><td>Earl Anthony Wayne serves as U.S. Ambassador to Mexico</td></tr>
                <tr><td><strong>2014</strong></td><td>Alleged Epstein party at Juárez consulate facility; Ambassador Wayne allegedly arrested</td></tr>
                <tr><td><strong>2019 (Aug)</strong></td><td>El Paso Walmart mass shooting</td></tr>
                <tr><td><strong>2020 (July)</strong></td><td>SPC Richard Halliday murdered at Fort Bliss</td></tr>
                <tr><td><strong>2025 (Jan)</strong></td><td>U.S. Army rules Halliday's death "In the Line of Duty"</td></tr>
                <tr><td><strong>2026 (Jan)</strong></td><td>Whistleblower Kenneth Darrell Turner dies</td></tr>
                <tr><td><strong>2026 (Feb)</strong></td><td>Release of Epstein files containing Juárez consulate allegations</td></tr>
              </tbody>
            </table>
            
            <h3>Conclusion</h3>
            <p>The evidence paints a horrifying picture of a criminal enterprise operating with impunity at the highest levels of power, protected by a deep state network that silences those who dare to expose the truth. The murder of a decorated American soldier, the disappearance of a young model, and the deeply disturbing allegations against a former U.S. Ambassador all point to a conspiracy that demands immediate and thorough investigation.</p>
            
            <div className="article-cta">
              <a href="https://epsteinfilez.com" target="_blank" rel="noopener noreferrer" className="search-files-btn">SEARCH THE FILES</a>
              <span className="share-hashtag">#meetaudreyevans #EpsteinFiles #JusticeForRichardHalliday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Gallery */}
      <div className="content-section evidence-section">
        <div className="section-header">
          <h2>
            <FileText size={28} />
            EVIDENCE GALLERY: FBI DOCUMENTS & PHOTOS
          </h2>
          <p className="section-subtitle">Actual FBI emails, court documents, and photographic evidence from the Epstein files</p>
        </div>

        <div className="evidence-grid">
          <motion.div className="evidence-card bombshell" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">🔥 BOMBSHELL</div>
            <img src="/evidence/mamdani_epstein_photo.jpg" alt="Zohran Mamdani with Epstein, Clinton, Bezos" className="evidence-image" />
            <div className="evidence-info">
              <h4>NYC Mayor Mamdani's Mother with Epstein & Clinton</h4>
              <p>Photo shows Zohran Mamdani (circled) and his mother Mira Mamdani, a filmmaker and close Epstein associate, with Jeffrey Epstein, Ghislaine Maxwell, Bill Clinton, and Jeff Bezos. Mira produced "Children of a Desired Sex" (1987) documentary.</p>
              <span className="evidence-tag">POLITICAL CONNECTION</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">FBI EMAIL</div>
            <img src="/evidence/1000079784.jpg" alt="FBI Email EFTA00164984" className="evidence-image" />
            <div className="evidence-info">
              <h4>Kenneth Turner Email to DOJ (EFTA00164984)</h4>
              <p>Email from Kenneth Turner to DOJ officials about Juárez consulate party. Mentions Ambassador Earl Anthony Wayne arrested, 4 armed attacks on investigators (2 killed, 5 wounded), US Embassy CIA vans stalking investigators.</p>
              <span className="evidence-tag">JUÁREZ CONNECTION</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">COURT DOCUMENT</div>
            <img src="/evidence/Screenshot_20260202_184035_Facebook.jpg" alt="Richard Halliday Whistleblower Case" className="evidence-image" />
            <div className="evidence-info">
              <h4>Richard Halliday Whistleblower Case</h4>
              <p>Fort Bliss soldier Richard Halliday exposed criminal trafficking network. Murdered July 2020. U.S. Army ruled death "In the Line of Duty" January 2025. Connection to Epstein trafficking route through Fort Bliss.</p>
              <span className="evidence-tag">WHISTLEBLOWER MURDER</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">VIRAL VIDEO</div>
            <div className="video-embed">
              <a href="https://www.facebook.com/share/r/1G11fhTaFj/" target="_blank" rel="noopener noreferrer" className="video-link">
                <div className="video-thumbnail">
                  <span className="play-icon">▶</span>
                  <img src="/evidence/Screenshot_20260202_183858_Facebook.jpg" alt="Gabriela Rico Jimenez" />
                </div>
              </a>
            </div>
            <div className="evidence-info">
              <h4>Gabriela Rico Jiménez: "They Ate Human Flesh"</h4>
              <p>2009 video of Mexican model Gabriela Rico Jiménez arrested after claiming elites were engaging in cannibalism at Monterrey party. She disappeared shortly after. FBI FD-302 reports mention unverified cannibalism allegations in Epstein case.</p>
              <span className="evidence-tag">CANNIBALISM CLAIMS</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">FBI EMAIL</div>
            <img src="/evidence/1000079811.jpg" alt="Additional FBI Correspondence" className="evidence-image" />
            <div className="evidence-info">
              <h4>Additional FBI Email Evidence</h4>
              <p>More correspondence detailing the Juárez investigation, cover-up attempts, and threats against investigators. Trial judge shot by American in Mexico. Marine taking the fall for Ambassador Wayne's crime (DNA 100% match to victim).</p>
              <span className="evidence-tag">COVER-UP</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">SOCIAL PROOF</div>
            <img src="/evidence/Screenshot_20260202_184228_Facebook.jpg" alt="Viral Facebook Post" className="evidence-image" />
            <div className="evidence-info">
              <h4>Viral Social Media Coverage</h4>
              <p>Facebook post about Nicholas Tartaglione (Epstein's cellmate) claiming prosecutors offered Epstein deal to implicate Trump. 14K reactions, 2.6K comments, 9.4K shares. Public demanding answers.</p>
              <span className="evidence-tag">VIRAL (14K+ REACTIONS)</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card bombshell" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">🚨 REMOVED FROM FILES</div>
            <img src="/evidence/Screenshot_20260202_205118_Instagram.jpg" alt="Trump Photo Removed from Epstein Files" className="evidence-image" />
            <div className="evidence-info">
              <h4>Trump Photo REMOVED from Epstein Files</h4>
              <p>This photo of Trump with a young girl was removed from the official Epstein files release. Already viral on TikTok with 56.8K likes. Connects to Trump's documented inappropriate comments about his daughter Ivanka ("I would date her if she wasn't my daughter").</p>
              <span className="evidence-tag">VIRAL (56.8K LIKES)</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card bombshell" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">💰 FINANCIAL EVIDENCE</div>
            <img src="/evidence/Screenshot_20260202_212135_Instagram.jpg" alt="Trump $1.1 Billion Wire Transfers to Epstein" className="evidence-image" />
            <div className="evidence-info">
              <h4>Trump Made 4,725 Wire Transfers to Epstein ($1.1 BILLION)</h4>
              <p>Treasury Department Epstein file details revealed in Washington DC Congressional testimony (July 17, 2025): Trump made 4,725 wire transfers to Epstein totaling over $1.1 BILLION. Financial proof of their relationship.</p>
              <span className="evidence-tag">VIRAL (477K LIKES)</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card bombshell" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">💔 WITNESS MURDERED</div>
            <img src="/evidence/Screenshot_20260202_205957_Instagram.jpg" alt="Virginia Giuffre Beaten Before Death" className="evidence-image" />
            <div className="evidence-info">
              <h4>Virginia Giuffre: The Witness They Silenced</h4>
              <p>Key Epstein victim/witness Virginia Giuffre was brutally beaten (official story: "she fell"), then died by "suicide" two days after beating video surfaced. Deadman switch video released posthumously. She knew they were coming for her.</p>
              <span className="evidence-tag">VIRAL (199K LIKES, 6.5M VIEWS)</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card bombshell" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">⚠️ COURT DOCUMENTS</div>
            <img src="/evidence/Screenshot_20260202_213035_Instagram.jpg" alt="Court Complaint Summary" className="evidence-image" />
            <div className="evidence-info">
              <h4>Official Court Complaint Summary</h4>
              <p>Multiple witness testimonies: 13-14 year old forced to perform oral sex on Trump; sex trafficking ring at Trump Golf Course CA (1995-1996) with Ghislaine Maxwell as madam; girls reported missing, rumored murdered and buried at facility; Trump's head of security threatened witnesses.</p>
              <span className="evidence-tag">VIRAL (201K LIKES)</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card bombshell" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">💀 MURDER EVIDENCE</div>
            <img src="/evidence/Screenshot_20260202_213015_Instagram.jpg" alt="Robin Leach Murder Allegation" className="evidence-image" />
            <div className="evidence-info">
              <h4>Robin Leach Strangled Girl to Death at Party</h4>
              <p>Court complaint claims witness has VIDEO EVIDENCE of high-profile sex parties, dealings with cartels, and Robin Leach ("Lifestyles of the Rich and Famous" host) strangling a young girl to death at a party. Multiple witnesses named Trump, Epstein, Ghislaine Maxwell.</p>
              <span className="evidence-tag">VIDEO EVIDENCE CLAIMED</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">VIRAL MEME</div>
            <img src="/evidence/Screenshot_20260202_203234_LinkedIn.jpg" alt="Hooker and Con Man Running America" className="evidence-image" />
            <div className="evidence-info">
              <h4>"A Hooker and a Con Man Are Running America"</h4>
              <p>Viral social media post showing Trump with Melania (before marriage), implying she was an escort when they met. Connects to broader pattern of Trump's relationships with sex workers and trafficking networks.</p>
              <span className="evidence-tag">VIRAL (98.4K LIKES)</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card bombshell" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">📖 VICTIM TESTIMONY</div>
            <img src="/evidence/FB_IMG_1770121307330.jpg" alt="Victim Trauma Journal 2012" className="evidence-image" />
            <div className="evidence-info">
              <h4>Victim's Trauma Journal: "Jeffrey is Around Every Corner"</h4>
              <p>Court-sealed trauma journal from Epstein victim documenting terror between May-July 2012. Victim writes: "From 16-18 - Mary, Eddie, Jeffrey, Ghislaine. Trio sent to many in DC, NY, FL, island." Multiple entries describe fear of Jeffrey and Ghislaine, being transported on private planes, and trauma from abuse. Document marked "CONFIDENTIAL FOR EFTA DO NOT COPY."</p>
              <span className="evidence-tag">PRIMARY SOURCE EVIDENCE</span>
            </div>
          </motion.div>

          <motion.div className="evidence-card" whileHover={{ scale: 1.02 }}>
            <div className="evidence-badge">🏛️ BLUEPRINTS</div>
            <img src="/evidence/FB_IMG_1770121335596.jpg" alt="Facility Architectural Plans" className="evidence-image" />
            <div className="evidence-info">
              <h4>Facility Architectural Plans with Child Bedrooms</h4>
              <p>Detailed architectural floor plans showing facility layout with multiple child bedrooms, master bedroom, and designated "child area." Plans include measurements and room designations. Proposal document titled "VIEW FROM THE LOBBY" shows luxury entrance with palm trees and swimming pool. Connection to Epstein properties under investigation.</p>
              <span className="evidence-tag">STRUCTURAL EVIDENCE</span>
            </div>
          </motion.div>
        </div>

        <div className="download-section">
          <h3>Download Complete Evidence Package</h3>
          <a href="/epstein_black_book_names.txt" download className="download-btn">
            <FileText size={24} />
            DOWNLOAD COMPLETE LIST OF 2,260 NAMES
            <ChevronRight size={20} />
          </a>
          <p className="download-note">Plain text file with all names from Epstein's Black Book, flight logs, and court documents</p>
        </div>
      </div>

      {/* Bombshell Revelations */}
      <div className="content-section bombshell-section">
        <div className="section-header">
          <h2>
            <Flame size={28} />
            BOMBSHELL REVELATIONS
          </h2>
          <p className="section-subtitle">Breaking developments that mainstream media won't cover</p>
        </div>

        <div className="bombshell-grid">
          <motion.div className="bombshell-card" whileHover={{ y: -5 }}>
            <div className="bombshell-icon">💣</div>
            <h3>NYC Mayor's Epstein Connection</h3>
            <p>Zohran Mamdani, current NYC Mayor, photographed as a child with his mother Mira Mamdani (Epstein associate and filmmaker), Jeffrey Epstein, Ghislaine Maxwell, Bill Clinton, and Jeff Bezos. Mira produced "Children of a Desired Sex" documentary in 1987. <strong>Mamdani was groomed by this network.</strong></p>
            <div className="bombshell-meta">
              <span className="viral-badge">🔥 VIRAL</span>
              <span className="share-count">Shared 9.4K times</span>
            </div>
          </motion.div>

          <motion.div className="bombshell-card" whileHover={{ y: -5 }}>
            <div className="bombshell-icon">⚠️</div>
            <h3>Ambassador Wayne Arrested in Juárez</h3>
            <p>FBI emails reveal former U.S. Ambassador to Mexico Earl Anthony Wayne was allegedly arrested by Mexican Federal Police at Epstein's 2014 Juárez consulate party. A Marine was forced to take the fall with DNA evidence proving the crime. <strong>State Department deal to cover it up.</strong></p>
            <div className="bombshell-meta">
              <span className="viral-badge">📄 FBI DOCS</span>
              <span className="doc-ref">EFTA00164984</span>
            </div>
          </motion.div>

          <motion.div className="bombshell-card" whileHover={{ y: -5 }}>
            <div className="bombshell-icon">🎯</div>
            <h3>Whistleblower Murdered at Fort Bliss</h3>
            <p>SPC Richard Halliday exposed the Epstein trafficking network operating through Fort Bliss, Texas. He was murdered in July 2020. The U.S. Army finally ruled his death "In the Line of Duty" in January 2025. <strong>Institutions meant to protect him were the perpetrators.</strong></p>
            <div className="bombshell-meta">
              <span className="viral-badge">⚔️ HERO</span>
              <span className="hashtag">#JusticeForRichardHalliday</span>
            </div>
          </motion.div>

          <motion.div className="bombshell-card" whileHover={{ y: -5 }}>
            <div className="bombshell-icon">🩸</div>
            <h3>Gabriela's Cannibalism Claims</h3>
            <p>In 2009, Mexican model Gabriela Rico Jiménez was arrested after screaming "they ate human flesh" at an elite party in Monterrey. She disappeared shortly after. FBI FD-302 reports in the Epstein files mention <strong>unverified allegations of cannibalism and dismemberment of infants.</strong></p>
            <div className="bombshell-meta">
              <span className="viral-badge">📹 VIDEO</span>
              <a href="https://www.facebook.com/share/r/1G11fhTaFj/" target="_blank" rel="noopener noreferrer">WATCH NOW</a>
            </div>
          </motion.div>
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
