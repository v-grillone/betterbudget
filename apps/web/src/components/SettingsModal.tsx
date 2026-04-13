'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { changeName, changePassword, deleteAccount, signOut } from '@/app/actions/auth'
import { sendFeedback } from '@/app/actions/feedback'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, Settings } from 'lucide-react'
import { useState } from 'react'
import { useSectionForm } from '@/hooks/useSectionForm'

type Section = 'name' | 'password' | 'feature' | 'problem' | 'delete' | null

const rowBtn = 'flex w-full items-center justify-between text-sm text-stone-800 hover:bg-stone-300 cursor-pointer rounded px-2 -mx-2 py-3 transition-colors duration-150'

export default function SettingsModal({ name }: { name: string | null }) {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>(null)

  const close = () => setActiveSection(null)

  const nameForm     = useSectionForm(changeName,     close)
  const passwordForm = useSectionForm(changePassword, close)
  const featureForm  = useSectionForm((s, fd) => sendFeedback(s, fd), close)
  const problemForm  = useSectionForm((s, fd) => sendFeedback(s, fd), close)

  function toggle(section: Section) {
    setActiveSection(prev => prev === section ? null : section)
  }

  const sectionOpen = ['name', 'password', 'feature', 'problem'].includes(activeSection as string)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-1.5 rounded text-stone-500 hover:bg-stone-300 cursor-pointer transition-colors duration-150"
        aria-label="Settings"
      >
        <Settings size={18} />
      </button>

      <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setActiveSection(null) }}>
        <DialogContent className="max-w-sm bg-white border border-stone-200 shadow-sm rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-stone-800">Settings</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col divide-y divide-stone-100">

            {/* Change name */}
            <div>
              <button type="button" onClick={() => toggle('name')} className={rowBtn}>
                <span>{nameForm.success ? 'Name updated' : 'Change name'}</span>
                {activeSection === 'name'
                  ? <ChevronUp size={14} className="text-stone-400" />
                  : <ChevronDown size={14} className="text-stone-400" />}
              </button>
              {activeSection === 'name' && (
                <form action={nameForm.handleSubmit} className="mt-3 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Name</label>
                    <Input name="name" defaultValue={name ?? ''} placeholder="Your name" required />
                  </div>
                  {nameForm.error && <p className="text-xs text-red-600">{nameForm.error}</p>}
                  <button type="submit" disabled={nameForm.pending} className="w-full px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800 disabled:opacity-50 cursor-pointer">
                    {nameForm.pending ? 'Saving...' : 'Save name'}
                  </button>
                </form>
              )}
            </div>

            {/* Change password */}
            <div>
              <button type="button" onClick={() => toggle('password')} className={rowBtn}>
                <span>{passwordForm.success ? 'Password updated' : 'Change password'}</span>
                {activeSection === 'password'
                  ? <ChevronUp size={14} className="text-stone-400" />
                  : <ChevronDown size={14} className="text-stone-400" />}
              </button>
              {activeSection === 'password' && (
                <form action={passwordForm.handleSubmit} className="mt-3 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">New password</label>
                    <Input name="password" type="password" placeholder="Min. 8 characters" required />
                  </div>
                  {passwordForm.error && <p className="text-xs text-red-600">{passwordForm.error}</p>}
                  <button type="submit" disabled={passwordForm.pending} className="w-full px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800 disabled:opacity-50 cursor-pointer">
                    {passwordForm.pending ? 'Saving...' : 'Save password'}
                  </button>
                </form>
              )}
            </div>

            {/* Request a feature */}
            <div>
              <button type="button" onClick={() => toggle('feature')} className={rowBtn}>
                <span>{featureForm.success ? 'Request sent' : 'Request a feature'}</span>
                {activeSection === 'feature'
                  ? <ChevronUp size={14} className="text-stone-400" />
                  : <ChevronDown size={14} className="text-stone-400" />}
              </button>
              {activeSection === 'feature' && (
                <form action={featureForm.handleSubmit} className="mt-3 flex flex-col gap-3">
                  <input type="hidden" name="type" value="feature" />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Description</label>
                    <textarea name="message" rows={3} placeholder="What would you like to see?" required className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none" />
                  </div>
                  {featureForm.error && <p className="text-xs text-red-600">{featureForm.error}</p>}
                  <button type="submit" disabled={featureForm.pending} className="w-full px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800 disabled:opacity-50 cursor-pointer">
                    {featureForm.pending ? 'Sending...' : 'Send request'}
                  </button>
                </form>
              )}
            </div>

            {/* Report a problem */}
            <div>
              <button type="button" onClick={() => toggle('problem')} className={rowBtn}>
                <span>{problemForm.success ? 'Report sent' : 'Report a problem'}</span>
                {activeSection === 'problem'
                  ? <ChevronUp size={14} className="text-stone-400" />
                  : <ChevronDown size={14} className="text-stone-400" />}
              </button>
              {activeSection === 'problem' && (
                <form action={problemForm.handleSubmit} className="mt-3 flex flex-col gap-3">
                  <input type="hidden" name="type" value="problem" />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Description</label>
                    <textarea name="message" rows={3} placeholder="What went wrong?" required className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none" />
                  </div>
                  {problemForm.error && <p className="text-xs text-red-600">{problemForm.error}</p>}
                  <button type="submit" disabled={problemForm.pending} className="w-full px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800 disabled:opacity-50 cursor-pointer">
                    {problemForm.pending ? 'Sending...' : 'Send report'}
                  </button>
                </form>
              )}
            </div>

            {/* Delete account */}
            <div>
              <button type="button" onClick={() => toggle('delete')} className={rowBtn}>
                <span>Delete account</span>
                {activeSection === 'delete'
                  ? <ChevronUp size={14} className="text-stone-400" />
                  : <ChevronDown size={14} className="text-stone-400" />}
              </button>
              {activeSection === 'delete' && (
                <div className="mt-3 flex flex-col gap-3">
                  <p className="text-xs text-stone-500">This will permanently delete your account and all data. This cannot be undone.</p>
                  <form action={async () => { await deleteAccount() }}>
                    <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-red-500 bg-white border border-red-200 rounded hover:bg-red-50 cursor-pointer transition-colors duration-150">
                      Yes, delete my account
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Sign out */}
            <div className="pt-3">
              <form action={signOut}>
                <button
                  type="submit"
                  className={sectionOpen
                    ? 'w-full px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded hover:bg-stone-50 cursor-pointer transition-colors duration-150'
                    : 'w-full px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800 cursor-pointer transition-colors duration-150'
                  }
                >
                  Sign out
                </button>
              </form>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
