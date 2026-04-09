import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  Download,
  Key,
  Shield,
  Globe,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";

function App() {
  const [generatedNsec, setGeneratedNsec] = useState("");
  const [generatedNpub, setGeneratedNpub] = useState("");
  const [showNsec, setShowNsec] = useState(false);
  const [nsecDownloaded, setNsecDownloaded] = useState(false);
  const [copiedNpub, setCopiedNpub] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const hasKeys = !!generatedNsec;

  const handleGenerateKey = () => {
    const sk = generateSecretKey();
    const nsec = nip19.nsecEncode(sk);
    const pubkey = getPublicKey(sk);
    const npubStr = nip19.npubEncode(pubkey);
    setGeneratedNsec(nsec);
    setGeneratedNpub(npubStr);
    setNsecDownloaded(false);
    setShowNsec(false);
  };

  const handleDownloadNsec = () => {
    const blob = new Blob([generatedNsec], {
      type: "text/plain; charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nostr-${generatedNpub.slice(5, 13)}.nsec.txt`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setNsecDownloaded(true);
  };

  const handleCopyNpub = async () => {
    await navigator.clipboard.writeText(generatedNpub);
    setCopiedNpub(true);
    setTimeout(() => setCopiedNpub(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fbfaf8' }}>
      {/* Header — AOS branding */}
      <header
        className="sticky top-0 z-40 border-b border-[rgba(222,219,213,0.9)]"
        style={{ backdropFilter: 'blur(14px)', background: 'rgba(251, 250, 248, 0.92)' }}
      >
        <div className="w-full max-w-[720px] mx-auto px-6 max-[720px]:px-4">
          <nav className="flex items-center justify-between py-3 gap-6 max-[720px]:py-[0.65rem]">
            <a href="/" className="flex items-center gap-[0.7rem] no-underline text-inherit">
              <div
                className="w-10 h-10 rounded-[12px] overflow-hidden flex items-center justify-center border border-[rgba(0,0,0,0.06)]"
                style={{ background: '#f2f1f0', boxShadow: '0 8px 18px rgba(0, 0, 0, 0.06)' }}
              >
                <img src="/AOS_Official.svg" alt="AOS logo" className="w-full h-full block" />
              </div>
              <div className="flex flex-col gap-[0.1rem]">
                <span className="text-[0.82rem] tracking-[0.12em] uppercase text-[#716f6a] max-[720px]:text-[0.75rem]">
                  And Other Stuff
                </span>
                <span className="text-[1.02rem] font-semibold tracking-[0.03em] text-[#0f100f] max-[720px]:text-[0.95rem]">
                  Get on Nostr
                </span>
              </div>
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-[640px] mx-auto px-6">
          {/* Hero + immediate CTA */}
          <section className="py-12 md:py-16">
            <h1 className="text-[clamp(1.5rem,2.5vw+1rem,2.2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground mb-4">
              Get your Nostr identity
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6 max-w-lg">
              Nostr is an open protocol for social media, messaging, and more — owned by no one.
              Your keypair is your identity. Create one now and start using it immediately.
            </p>

            {!hasKeys ? (
              <div className="bg-card rounded-[28px] p-8 shadow-[0_18px_45px_rgba(0,0,0,0.08)] border border-border">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This generates two keys in your browser — a public key (your identity) and a secret key (your password).
                      Nothing is sent to any server.
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateKey}
                    className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
                  >
                    <Key className="w-4 h-4" />
                    Create my Nostr keypair
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-[28px] p-8 shadow-[0_18px_45px_rgba(0,0,0,0.08)] border border-border space-y-6">
                {/* npub */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Your public key (npub)
                  </label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your identity — share it freely. Like a username.
                  </p>
                  <div className="relative">
                    <Input
                      value={generatedNpub}
                      readOnly
                      className="rounded-[10px] font-mono text-xs pr-10 bg-secondary/50"
                    />
                    <button
                      type="button"
                      onClick={handleCopyNpub}
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy npub"
                    >
                      {copiedNpub ? (
                        <Check className="h-4 w-4 text-green-700" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* nsec */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    Your secret key (nsec)
                  </label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your password — never share it. Anyone who has it controls your identity.
                  </p>
                  <div className="relative">
                    <Input
                      type={showNsec ? "text" : "password"}
                      value={generatedNsec}
                      readOnly
                      className="rounded-[10px] font-mono text-xs pr-10 bg-secondary/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNsec(!showNsec)}
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNsec ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Warning */}
                <div className="p-3 bg-amber-50 rounded-[10px] border border-amber-200">
                  <p className="text-xs font-semibold text-amber-800 mb-1">
                    Save your secret key now
                  </p>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    There is no "forgot password" on Nostr. If you lose your secret key, your identity is gone forever.
                    Download the file below and store it somewhere safe.
                  </p>
                </div>

                {/* Download */}
                <Button
                  onClick={handleDownloadNsec}
                  className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  {nsecDownloaded
                    ? "Downloaded — download again"
                    : "Download secret key file"}
                </Button>

                {nsecDownloaded && (
                  <p className="text-xs text-green-700 font-medium text-center">
                    Key file saved. Keep it somewhere secure.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Apps section — always visible, prominent after key download */}
          {nsecDownloaded && (
            <section className="pb-12 md:pb-16 space-y-8">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground mb-2">
                  Now use it
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sign in to any of these apps with the secret key file you just downloaded.
                  Your identity works across all of them.
                </p>
              </div>

              {/* Foundry apps — featured */}
              <div>
                <span className="text-xs font-medium tracking-[0.16em] uppercase text-muted-foreground/60 mb-4 block">
                  From the And Other Stuff foundry
                </span>
                <div className="grid gap-4">
                  {foundryApps.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-5 bg-card rounded-[18px] border border-border shadow-[0_8px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-shadow group"
                    >
                      <div className="w-12 h-12 rounded-[12px] bg-secondary flex items-center justify-center shrink-0 text-2xl">
                        {app.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold">{app.name}</h3>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {app.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Other apps */}
              <div>
                <span className="text-xs font-medium tracking-[0.16em] uppercase text-muted-foreground/60 mb-4 block">
                  More Nostr apps
                </span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {otherApps.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 rounded-[14px] border border-border hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-[10px] bg-secondary flex items-center justify-center shrink-0 text-xl">
                        {app.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-semibold">{app.name}</h3>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {app.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-secondary rounded-[18px] p-6 space-y-4">
                <h3 className="text-sm font-semibold">Getting started</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold shrink-0">1.</span>
                    Open any app above and look for "Login" or "Sign in with nsec". Paste your secret key from the file you downloaded.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold shrink-0">2.</span>
                    Set a display name and profile picture — this carries across all Nostr apps.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold shrink-0">3.</span>
                    Follow some people. Your feed is built from who you follow — no algorithm deciding for you.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold shrink-0">4.</span>
                    Try a few different apps — your identity and follows carry over everywhere.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {/* How it works — below the fold */}
          <section className="py-12 md:py-16 border-t border-border">
            <span className="text-xs font-medium tracking-[0.16em] uppercase text-muted-foreground/60 mb-6 block">
              How Nostr works
            </span>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center border border-[rgba(0,0,0,0.06)]"
                  style={{ background: '#f2f1f0' }}
                >
                  <Key className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-sm font-semibold">Cryptographic identity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You get a keypair — a public key (your identity) and a secret key (your password).
                  No email, no phone number, no permission needed.
                </p>
              </div>
              <div className="space-y-3">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center border border-[rgba(0,0,0,0.06)]"
                  style={{ background: '#f2f1f0' }}
                >
                  <Globe className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-sm font-semibold">Works everywhere</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your identity works across every Nostr app. Social media, messaging, long-form writing, marketplaces — one login for all of it.
                </p>
              </div>
              <div className="space-y-3">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center border border-[rgba(0,0,0,0.06)]"
                  style={{ background: '#f2f1f0' }}
                >
                  <Shield className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-sm font-semibold">You own it</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No company holds your account. No one can ban you from the protocol. Your followers, posts, and data move with you between apps.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 md:py-16 border-t border-border">
            <span className="text-xs font-medium tracking-[0.16em] uppercase text-muted-foreground/60 mb-6 block">
              Common questions
            </span>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-[14px]">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-medium pr-4">{faq.question}</span>
                    {expandedFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA if they haven't generated yet */}
          {!hasKeys && (
            <section className="py-12 md:py-16 border-t border-border text-center">
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground mb-3">
                Ready?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Takes about 10 seconds. Everything happens in your browser.
              </p>
              <Button
                onClick={() => { handleGenerateKey(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="h-12 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
              >
                <Key className="w-4 h-4" />
                Create my Nostr keypair
              </Button>
            </section>
          )}
        </div>
      </main>

      {/* Footer — AOS style */}
      <footer className="border-t border-[#dedbd5] py-6 pb-[1.8rem] mt-auto text-[0.8rem] text-[#716f6a]" style={{ background: '#fbfaf8' }}>
        <div className="w-full max-w-[640px] mx-auto px-6 max-[720px]:px-4">
          <div className="flex flex-col gap-4 min-[720px]:flex-row min-[720px]:justify-between min-[720px]:items-center">
            <a
              href="https://github.com/andotherstuff"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[0.35rem] text-[#716f6a] hover:text-[#0f100f] transition-colors no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              Open Source
            </a>
            <div className="flex flex-wrap gap-[0.85rem]">
              <a href="https://andotherstuff.org" target="_blank" rel="noopener noreferrer" className="text-[#716f6a] hover:text-[#0f100f] no-underline transition-colors">
                andotherstuff.org
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const faqs = [
  {
    question: "Is Nostr a social media app?",
    answer:
      "No — Nostr is a protocol, like email or the web. Many different apps are built on it: social feeds, messaging, blogs, marketplaces, and more. You use one identity across all of them.",
  },
  {
    question: "What are npub and nsec?",
    answer:
      'Your npub (public key) is like your username — share it freely so people can find you. Your nsec (secret key) is like your password — it proves you are you. Never share it. There\'s no "forgot password" recovery.',
  },
  {
    question: "Can I be banned from Nostr?",
    answer:
      "No one can ban you from the protocol itself. Individual apps or relays (servers that pass messages) can choose what they host, but you can always switch to another relay or app. Your identity and followers stay with you.",
  },
  {
    question: "How is this different from Bluesky or Mastodon?",
    answer:
      "Bluesky and Mastodon are closer to platforms — they control your identity and can revoke it. On Nostr, your keys are your identity. No company is in between you and your account. And because the protocol is radically simple, anyone can build on it.",
  },
  {
    question: "Is it safe to generate keys in a browser?",
    answer:
      "Yes. The keys are generated using your browser's built-in cryptographic random number generator — the same one used for banking and HTTPS. Nothing leaves your device. The code is open source and you can verify it.",
  },
  {
    question: "Do I need to pay for anything?",
    answer:
      "Nostr is free to use. Some apps offer premium features, and some relays charge a small fee for better performance or spam filtering, but the core protocol and most apps are completely free.",
  },
];

const foundryApps = [
  {
    name: "Divine",
    icon: "✦",
    url: "https://divine.land",
    description:
      "A beautiful Nostr social experience. Follow people, post notes, explore feeds — all with the identity you just created.",
  },
  {
    name: "Ditto",
    icon: "◈",
    url: "https://ditto.pub",
    description:
      "Self-hosted social media server powered by Nostr. Run your own instance or join an existing community.",
  },
];

const otherApps = [
  {
    name: "Primal",
    icon: "⚡",
    url: "https://primal.net",
    description: "Fast Nostr client with built-in Bitcoin wallet. Web, iOS, and Android.",
  },
  {
    name: "Damus",
    icon: "🟣",
    url: "https://damus.io",
    description: "The OG Nostr client for iOS. Clean, simple, native.",
  },
  {
    name: "Amethyst",
    icon: "💎",
    url: "https://github.com/vitorpamplona/amethyst",
    description: "Feature-rich Nostr client for Android with community focus.",
  },
  {
    name: "Habla",
    icon: "✍️",
    url: "https://habla.news",
    description: "Long-form writing on Nostr. Blog posts, articles, and essays.",
  },
  {
    name: "Coracle",
    icon: "🐚",
    url: "https://coracle.social",
    description: "Relay-focused Nostr client with groups and communities.",
  },
  {
    name: "Nostrudel",
    icon: "🍄",
    url: "https://nostrudel.ninja",
    description: "Power-user Nostr web client. Everything the protocol offers, accessible.",
  },
];

export default App;
