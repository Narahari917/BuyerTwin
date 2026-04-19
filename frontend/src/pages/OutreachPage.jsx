import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../api/api'

export default function OutreachPage() {
  const { id } = useParams()
  const { token } = useAuth()

  const [outreach, setOutreach] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    const fetchOutreach = async () => {
      try {
        setLoading(true)
        const data = await apiRequest(`/outreach/${id}`, {
          method: 'POST',
          token,
        })
        setOutreach(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOutreach()
  }, [id, token])

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard')
    } catch {
      alert('Copy failed')
    }
  }

  const sendEmail = async () => {
    try {
      setSending(true)
      setEmailSent(false)
      await apiRequest(`/outreach/${id}/send-email`, {
        method: 'POST',
        token,
      })
      setEmailSent(true)
      alert('Email sent successfully!')
    } catch (err) {
      alert(`Failed to send email: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  const refreshOutreach = async () => {
    try {
      setLoading(true)
      const data = await apiRequest(`/outreach/${id}/refresh`, {
        method: 'POST',
        token,
      })
      setOutreach(data.outreach)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-10 text-xl">Loading outreach...</div>
  }

  if (error) {
    return <div className="p-10 text-xl text-red-500">Error: {error}</div>
  }

  if (!outreach) {
    return <div className="p-10 text-xl">No outreach data found.</div>
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Outreach Studio</h1>
            <p className="mt-1 text-sm text-slate-500">
              Personalized drafts for buyer {id}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={refreshOutreach}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
              type="button"
            >
              Regenerate
            </button>
            <Link
              to={`/buyer/${id}`}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Back to Buyer
            </Link>
          </div>
        </div>

        {/* Send Email Button */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Top matched listing outreach</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {outreach.email_subject}
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={sendEmail}
              disabled={sending}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              type="button"
            >
              {sending ? 'Sending...' : 'Send Recommendation Email'}
            </button>

            {emailSent && (
              <span className="text-sm font-medium text-green-600">
                ✓ Email sent successfully
              </span>
            )}
          </div>
        </div>

        {/* Draft Cards */}
        <div className="space-y-5">
          <DraftCard
            title="SMS Draft"
            text={outreach.sms_text}
            onCopy={() => copyText(outreach.sms_text)}
          />

          <DraftCard
            title="Email Draft"
            text={`Subject: ${outreach.email_subject}\n\n${outreach.email_body}`}
            onCopy={() => copyText(`Subject: ${outreach.email_subject}\n\n${outreach.email_body}`)}
          />

          <DraftCard
            title="Call Script"
            text={outreach.call_script}
            onCopy={() => copyText(outreach.call_script)}
          />
        </div>
      </div>
    </div>
  )
}

function DraftCard({ title, text, onCopy }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

        <button
          onClick={onCopy}
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          type="button"
        >
          Copy
        </button>
      </div>

      <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">
        {text}
      </pre>
    </div>
  )
}