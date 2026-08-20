import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const FAQS = [
  {
    question: 'Do participants need to register or create an account?',
    answer: 'No registration or login is required! Code Room is designed for maximum speed and zero friction. You simply generate a Room ID, choose your display name, and start coding immediately.'
  },
  {
    question: 'Which programming languages can I write and execute?',
    answer: 'Code Room supports real-time compilation and execution for JavaScript (Node.js), Python 3.10, C++ (GCC), and Java (OpenJDK) through containerized execution sandboxes.'
  },
  {
    question: 'What happens if my connection drops or I refresh the page?',
    answer: 'Your progress is safe. Code Room continuously mirrors and persists room states in MongoDB. When you reconnect or rejoin with the same Room ID, your workspace restores the exact latest code buffer.'
  },
  {
    question: 'Is the editor engine compatible with VS Code shortcuts?',
    answer: 'Yes! Code Room utilizes Microsoft Monaco Editor, which is the foundational core of VS Code. You get native multi-cursor selection, intelligent autocomplete, bracket colorization, auto-indentation, and standard IDE shortcuts.'
  },
  {
    question: 'Can multiple people type at the same exact time?',
    answer: 'Absolutely. Code Room is powered by low-latency Socket.io synchronization channels. Keystrokes, code formatting, and cursor changes stream across all participants in under 10 milliseconds.'
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Everything you need to know about Code Room's real-time engine and collaboration capabilities.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-semibold text-base sm:text-lg text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-blue-300' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
