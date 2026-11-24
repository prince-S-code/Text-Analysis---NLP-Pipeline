import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react'
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  Clock3,
  CloudUpload,
  Copy,
  FileText,
  History,
  LoaderCircle,
  LockKeyhole,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  Tag,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'
import './App.css'

type Sentiment = {
  label: string
  score: number
  polarity: number
}

type AnalysisResult = {
  tokens: string[]
  sentiment: Sentiment
  entities: [string, string][]
  keywords: string[]
  summary: string
  wordcloud_url: string
}

type HistoryRecord = {
  id: number
  filename: string
  sentiment: string
  score: number
  summary: string
  results: AnalysisResult | null
}

type ApiResponse = {
  error?: string
  results?: AnalysisResult
  filename?: string
  history?: HistoryRecord[]
}

const sampleText =
  'The product launch exceeded expectations. Customers praised the thoughtful design, reliable performance, and helpful support team. Our team in San Francisco is already planning the next release after receiving excellent feedback from early users.'

const formatLabel = (label: string) => label.toLowerCase()

function App() {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [sourceName, setSourceName] = useState('')
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [historyError, setHistoryError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        setApiOnline(true)
      })
      .catch(() => setApiOnline(false))

    fetch('/api/history')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load history')
        const data = (await response.json()) as { history: HistoryRecord[] }
        setHistory(data.history)
      })
      .catch(() => setHistoryError('Analysis history could not be loaded. Check that the API is running.'))
  }, [])

  const selectFile = (selected: File | undefined) => {
    if (!selected) return
    const allowed = /\.(txt|pdf|docx)$/i.test(selected.name)
    if (!allowed) {
      setError('Choose a TXT, PDF, or DOCX document.')
      return
    }
    setError('')
    setFile(selected)
    setMode('upload')
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.currentTarget.classList.remove('is-dragging')
    selectFile(event.dataTransfer.files[0])
  }

  const analyze = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const body = new FormData()
    if (mode === 'upload' && file) {
      body.append('file', file)
    } else {
      body.append('text', text)
    }

    try {
      const response = await fetch('/api/analyze', { method: 'POST', body })
      let data: ApiResponse
      try {
        data = (await response.json()) as ApiResponse
      } catch {
        throw new Error(`The analysis server returned an invalid response (HTTP ${response.status}).`)
      }
      if (!response.ok || !data.results) {
        throw new Error(data.error || 'Analysis failed. Please try again.')
      }
      setResult(data.results)
      setSourceName(data.filename || file?.name || 'Pasted text')
      if (data.history) {
        setHistory(data.history)
        setHistoryError('')
      }
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to analyze this document.',
      )
    } finally {
      setLoading(false)
    }
  }

  const resetAnalysis = () => {
    setResult(null)
    setSourceName('')
    setError('')
    setFile(null)
    setText('')
    if (fileInput.current) fileInput.current.value = ''
  }

  const loadHistoryItem = (item: HistoryRecord) => {
    if (!item.results) {
      setError('This older analysis does not contain a saved result.')
      return
    }
    setResult(item.results)
    setSourceName(item.filename)
    setError('')
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
  }

  const downloadReport = () => {
    if (!result) return
    const report = new Blob(
      [JSON.stringify({ filename: sourceName, results: result }, null, 2)],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(report)
    const link = document.createElement('a')
    link.href = url
    link.download = `${sourceName.replace(/\.[^.]+$/, '') || 'text-analysis'}-report.json`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const copySummary = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.summary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setError('Clipboard access is unavailable in this browser.')
    }
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Text-Intel home">
          <span className="brand-mark"><Brain size={21} strokeWidth={2.2} /></span>
          <span>Text<span className="brand-accent">-Intel</span></span>
        </a>
        <nav className="topnav" aria-label="Main navigation">
          <a className="nav-link active" href="#workspace">Workspace</a>
          <a className="nav-link" href="#history">History</a>
        </nav>
        <div className={`service-status ${apiOnline === false ? 'offline' : ''}`}>
          <span className="status-dot" />
          {apiOnline === null ? 'Connecting' : apiOnline ? 'Systems operational' : 'API unavailable'}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14} /> TEXT-INTEL · NLP PIPELINE</div>
            <h1>Find the signal<br /><span>inside your words.</span></h1>
            <p>NLP pipeline for sentiment analysis and text summarization—plus keywords, entities, and a word cloud.</p>
            <div className="hero-proof">
              <span><CheckCircle2 size={15} /> Sentiment & tone</span>
              <span><CheckCircle2 size={15} /> Keywords & entities</span>
              <span><CheckCircle2 size={15} /> Instant summaries</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-core"><Brain size={54} strokeWidth={1.3} /></div>
            <span className="float-chip chip-sentiment"><Activity size={14} /> sentiment</span>
            <span className="float-chip chip-keywords"><Tag size={14} /> keywords</span>
            <span className="float-chip chip-summary"><MessageSquareText size={14} /> summary</span>
          </div>
        </section>

        <section className="workspace-section" id="workspace">
          <div className="section-heading">
            <div>
              <div className="eyebrow muted-eyebrow">ANALYSIS WORKSPACE</div>
              <h2>Start with your text</h2>
            </div>
            <span className="privacy-note"><LockKeyhole size={14} /> Uploads are deleted after analysis</span>
          </div>

          <div className="workspace-grid">
            <form className="input-card panel" onSubmit={analyze}>
              <div className="card-heading">
                <div className="heading-icon"><FileText size={18} /></div>
                <div>
                  <h3>Choose your source</h3>
                  <p>Upload a document or paste text directly</p>
                </div>
              </div>

              <div className="source-tabs" role="tablist" aria-label="Text source">
                <button
                  type="button"
                  className={mode === 'upload' ? 'source-tab selected' : 'source-tab'}
                  onClick={() => setMode('upload')}
                  role="tab"
                  aria-selected={mode === 'upload'}
                >
                  <CloudUpload size={15} /> Upload file
                </button>
                <button
                  type="button"
                  className={mode === 'paste' ? 'source-tab selected' : 'source-tab'}
                  onClick={() => setMode('paste')}
                  role="tab"
                  aria-selected={mode === 'paste'}
                >
                  <MessageSquareText size={15} /> Paste text
                </button>
              </div>

              {mode === 'upload' ? (
                <div
                  className={`drop-zone ${file ? 'has-file' : ''}`}
                  onDragOver={(event) => {
                    event.preventDefault()
                    event.currentTarget.classList.add('is-dragging')
                  }}
                  onDragLeave={(event) => event.currentTarget.classList.remove('is-dragging')}
                  onDrop={handleDrop}
                  onClick={() => fileInput.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') fileInput.current?.click()
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload a document"
                >
                  <input
                    ref={fileInput}
                    className="file-input"
                    type="file"
                    accept=".txt,.pdf,.docx"
                    onChange={(event) => selectFile(event.target.files?.[0])}
                  />
                  <div className="upload-symbol">
                    {file ? <Check size={23} /> : <CloudUpload size={23} />}
                  </div>
                  {file ? (
                    <>
                      <strong className="drop-title">{file.name}</strong>
                      <span className="drop-hint">{(file.size / 1024).toFixed(0)} KB · Ready to analyze</span>
                    </>
                  ) : (
                    <>
                      <strong className="drop-title">Drop your document here</strong>
                      <span className="drop-hint">or <span className="browse-link">browse files</span> from your device</span>
                    </>
                  )}
                  <span className="file-types">TXT <i /> PDF <i /> DOCX <i /> UP TO 10 MB</span>
                  {file && (
                    <button
                      type="button"
                      className="remove-file"
                      aria-label="Remove selected file"
                      onClick={(event) => {
                        event.stopPropagation()
                        setFile(null)
                        if (fileInput.current) fileInput.current.value = ''
                      }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-entry">
                  <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Paste an article, customer review, report, or any text you want to understand..."
                    maxLength={50000}
                    aria-label="Text to analyze"
                  />
                  <div className="text-meta">
                    <span>{wordCount.toLocaleString()} words</span>
                    <span>{text.length.toLocaleString()} / 50,000 characters</span>
                  </div>
                </div>
              )}

              {error && <div className="error-banner" role="alert">{error}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  className="sample-button"
                  onClick={() => {
                    setMode('paste')
                    setFile(null)
                    setText(sampleText)
                    setError('')
                  }}
                >
                  <WandSparkles size={15} /> Try a sample
                </button>
                <button
                  className="analyze-button"
                  type="submit"
                  disabled={loading || (mode === 'upload' ? !file : !text.trim())}
                >
                  {loading ? <><LoaderCircle className="spin" size={17} /> Analyzing</> : <>Analyze text <ArrowRight size={17} /> </>}
                </button>
              </div>
              <div className="processing-note"><Zap size={13} /> Usually takes a few seconds</div>
            </form>

            <aside className="pipeline-card panel">
              <div className="pipeline-top">
                <div className="heading-icon accent-icon"><Activity size={18} /></div>
                <span className="live-label"><span className="status-dot" /> LIVE PIPELINE</span>
              </div>
              <h3>From words<br />to understanding.</h3>
              <p>One pass through a focused NLP pipeline gives you a complete picture of your text.</p>
              <div className="pipeline-steps">
                <div className="pipeline-step"><span className="step-number">01</span><span className="step-icon"><MessageSquareText size={15} /></span><span><b>Understand context</b><small>Clean & tokenize your text</small></span><CheckCircle2 size={15} className="step-check" /></div>
                <div className="pipeline-step"><span className="step-number">02</span><span className="step-icon"><Activity size={15} /></span><span><b>Measure sentiment</b><small>Reveal the overall tone</small></span><CheckCircle2 size={15} className="step-check" /></div>
                <div className="pipeline-step"><span className="step-number">03</span><span className="step-icon"><Brain size={15} /></span><span><b>Extract insights</b><small>Find entities & key themes</small></span><CheckCircle2 size={15} className="step-check" /></div>
                <div className="pipeline-step"><span className="step-number">04</span><span className="step-icon"><Sparkles size={15} /></span><span><b>Summarize</b><small>Get the gist at a glance</small></span><CheckCircle2 size={15} className="step-check" /></div>
              </div>
              <div className="pipeline-footer"><LockKeyhole size={13} /> Original uploads are removed after processing</div>
            </aside>
          </div>
        </section>

        <section className="results-section" id="results">
          {result ? (
            <>
              <div className="section-heading result-heading">
                <div>
                  <div className="eyebrow muted-eyebrow">YOUR RESULTS</div>
                  <h2>Analysis overview</h2>
                  <p className="result-source"><FileText size={14} /> {sourceName}</p>
                </div>
                <div className="result-actions">
                  <button className="icon-button" onClick={resetAnalysis} title="Start a new analysis"><RotateCcw size={16} /><span>New analysis</span></button>
                  <button className="icon-button export-button" onClick={downloadReport} title="Download JSON report"><ArrowDownToLine size={16} /><span>Export report</span></button>
                </div>
              </div>

              <div className="metrics-grid">
                <article className={`metric-card sentiment-card sentiment-${formatLabel(result.sentiment.label)}`}>
                  <div className="metric-label"><Activity size={15} /> OVERALL SENTIMENT</div>
                  <div className="sentiment-value">{result.sentiment.label}</div>
                  <div className="metric-foot"><span className="sentiment-indicator" /> {result.sentiment.polarity > 0 ? 'Positive tone detected' : result.sentiment.polarity < 0 ? 'Negative tone detected' : 'Neutral tone detected'}</div>
                  <div className="metric-orb" />
                </article>
                <article className="metric-card">
                  <div className="metric-label"><BarChart3 size={15} /> SENTIMENT STRENGTH</div>
                  <div className="metric-value">{Math.round(result.sentiment.score * 100)}<small>%</small></div>
                  <div className="meter-track"><span style={{ width: `${Math.round(result.sentiment.score * 100)}%` }} /></div>
                  <div className="metric-foot">Polarity {result.sentiment.polarity.toFixed(2)} on a −1 to +1 scale</div>
                </article>
                <article className="metric-card">
                  <div className="metric-label"><MessageSquareText size={15} /> WORDS PROCESSED</div>
                  <div className="metric-value">{result.tokens.length.toLocaleString()}</div>
                  <div className="metric-foot">After cleaning & stop-word removal</div>
                </article>
                <article className="metric-card">
                  <div className="metric-label"><Clock3 size={15} /> READING TIME</div>
                  <div className="metric-value">{Math.max(1, Math.ceil(result.tokens.length / 200))}<small> min</small></div>
                  <div className="metric-foot">Estimated from processed words</div>
                </article>
              </div>

              <div className="insights-grid">
                <article className="content-card panel summary-card">
                  <div className="content-card-heading">
                    <div className="section-icon summary-icon"><Sparkles size={17} /></div>
                    <div><h3>Executive summary</h3><p>The essential message, distilled</p></div>
                    <button className="quiet-icon-button" onClick={copySummary} aria-label="Copy summary" title="Copy summary">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="summary-copy">{result.summary}</p>
                </article>
                <article className="content-card panel keywords-card">
                  <div className="content-card-heading">
                    <div className="section-icon keyword-icon"><Tag size={17} /></div>
                    <div><h3>Key themes</h3><p>{result.keywords.length} relevant keywords</p></div>
                  </div>
                  <div className="keyword-list">
                    {result.keywords.length ? result.keywords.map((keyword, index) => (
                      <span className={`keyword-tag keyword-${index % 4}`} key={`${keyword}-${index}`}><span>#</span>{keyword}</span>
                    )) : <p className="empty-copy">No keywords found in this text.</p>}
                  </div>
                </article>
                <article className="content-card panel entities-card">
                  <div className="content-card-heading">
                    <div className="section-icon entity-icon"><Brain size={17} /></div>
                    <div><h3>Named entities</h3><p>People, places & organizations</p></div>
                    <span className="count-pill">{result.entities.length}</span>
                  </div>
                  {result.entities.length ? (
                    <div className="entity-list">
                      {result.entities.slice(0, 8).map(([name, kind], index) => (
                        <div className="entity-row" key={`${name}-${kind}-${index}`}>
                          <span className="entity-name">{name}</span>
                          <span className={`entity-type entity-${kind.toLowerCase()}`}>{kind}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="empty-copy">No named entities were detected.</p>}
                </article>
                <article className="content-card panel wordcloud-card">
                  <div className="content-card-heading">
                    <div className="section-icon cloud-icon"><CloudUpload size={17} /></div>
                    <div><h3>Word landscape</h3><p>Most prominent terms at a glance</p></div>
                  </div>
                  <img className="wordcloud-image" src={result.wordcloud_url} alt="Word cloud generated from the analyzed document" />
                </article>
                <article className="content-card panel tokens-card">
                  <div className="content-card-heading">
                    <div className="section-icon token-icon"><Zap size={17} /></div>
                    <div><h3>Processed tokens</h3><p>Showing {Math.min(result.tokens.length, 32)} of {result.tokens.length} terms</p></div>
                  </div>
                  <div className="token-list">
                    {result.tokens.slice(0, 32).map((token, index) => <span className="token" key={`${token}-${index}`}>{token}</span>)}
                  </div>
                </article>
              </div>
            </>
          ) : (
            <div className="empty-results panel">
              <div className="empty-illustration"><Brain size={30} /><span><Sparkles size={14} /></span></div>
              <div>
                <div className="eyebrow muted-eyebrow">READY WHEN YOU ARE</div>
                <h3>Your insights will appear here</h3>
                <p>Start an analysis to see sentiment, key themes, entities, and a concise summary.</p>
              </div>
              <ArrowRight className="empty-arrow" size={21} />
            </div>
          )}
        </section>

        <section className="history-section" id="history">
          <div className="section-heading history-heading">
            <div>
              <div className="eyebrow muted-eyebrow">PICK UP WHERE YOU LEFT OFF</div>
              <h2><History size={22} /> Recent analyses</h2>
            </div>
            <span className="history-count">{history.length} {history.length === 1 ? 'analysis' : 'analyses'}</span>
          </div>
          {historyError ? (
            <div className="history-empty" role="alert"><History size={16} /> {historyError}</div>
          ) : history.length ? (
            <div className="history-grid">
              {history.slice(0, 6).map((item) => (
                <button className="history-item panel" key={item.id} onClick={() => loadHistoryItem(item)}>
                  <span className="history-file-icon"><FileText size={17} /></span>
                  <span className="history-details">
                    <strong>{item.filename}</strong>
                    <small>{item.summary || 'Open saved analysis'}</small>
                  </span>
                  {item.sentiment && <span className={`history-sentiment sentiment-${formatLabel(item.sentiment)}`}>{item.sentiment}</span>}
                  <ArrowRight size={16} className="history-arrow" />
                </button>
              ))}
            </div>
          ) : (
            <div className="history-empty"><History size={16} /> Analyses you run will be saved here.</div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#"><span className="brand-mark"><Brain size={17} /></span><span>Text<span className="brand-accent">-Intel</span></span></a>
        <span>Clear insights, one document at a time.</span>
        <span className="footer-built"><Zap size={13} /> Built for curious minds</span>
      </footer>
    </div>
  )
}

export default App
