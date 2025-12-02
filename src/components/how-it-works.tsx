'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: 1,
    title: 'Create Intent',
    description: 'Define your swap parameters',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Get Quote',
    description: 'Generate shielded quote',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Execute Private',
    description: 'Hidden sender, amount, recipient',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    number: 4,
    title: 'Settle Anywhere',
    description: 'NEAR Intents handles the rest',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function HowItWorks() {
  return (
    <div className="relative">
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:block">
        {/* Connection line */}
        <div className="absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-purple-500/20 via-purple-500/50 to-purple-500/20" />

        <div className="grid grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-purple-400">
                  {step.icon}
                </div>
                {/* Number badge */}
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                  {step.number}
                </div>
              </motion.div>

              {/* Content */}
              <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical layout */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative flex items-start gap-4"
          >
            {/* Vertical line */}
            {index < steps.length - 1 && (
              <div className="absolute left-7 top-16 h-full w-0.5 bg-gradient-to-b from-purple-500/50 to-purple-500/20" />
            )}

            {/* Step circle */}
            <div className="relative z-10 flex-shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-purple-400">
                  {step.icon}
                </div>
              </div>
              {/* Number badge */}
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                {step.number}
              </div>
            </div>

            {/* Content */}
            <div className="pt-2">
              <h3 className="text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-0.5 text-sm text-gray-400">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
