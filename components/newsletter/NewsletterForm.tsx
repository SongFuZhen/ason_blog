'use client'

import { FormEvent, useRef, useState } from 'react'

type NewsletterFormProps = {
  title?: string
  apiUrl?: string
}

export default function NewsletterForm({
  title = '订阅邮件通讯',
  apiUrl = '/api/newsletter',
}: NewsletterFormProps) {
  const inputEl = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = inputEl.current
    const email = input?.value
    if (!input || !email) return

    const res = await fetch(apiUrl, {
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    const { error: responseError } = await res.json()

    if (responseError) {
      setError(true)
      setMessage('你的邮箱地址无效，或你已经订阅了！')
      return
    }

    input.value = ''
    setError(false)
    setSubscribed(true)
  }

  return (
    <div>
      <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</div>
      <form className="flex flex-col sm:flex-row" onSubmit={subscribe}>
        <div>
          <label htmlFor="email-input">
            <span className="sr-only">Email address</span>
            <input
              autoComplete="email"
              className="focus:ring-primary-600 w-72 rounded-md px-4 focus:border-transparent focus:ring-2 focus:outline-none dark:bg-black"
              disabled={subscribed}
              id="email-input"
              name="email"
              placeholder={subscribed ? '你已订阅' : '输入你的邮箱'}
              ref={inputEl}
              required
              type="email"
            />
          </label>
        </div>
        <div className="mt-2 flex w-full rounded-md shadow-sm sm:mt-0 sm:ml-3">
          <button
            className={`bg-primary-500 focus:ring-primary-600 w-full rounded-md px-4 py-2 font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none sm:py-0 dark:ring-offset-black ${
              subscribed ? 'cursor-default' : 'hover:bg-primary-700 dark:hover:bg-primary-400'
            }`}
            disabled={subscribed}
            type="submit"
          >
            {subscribed ? '谢谢！' : '订阅'}
          </button>
        </div>
      </form>
      {error && <div className="w-72 pt-2 text-sm text-red-500 sm:w-96">{message}</div>}
    </div>
  )
}
