import { Scale, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function LicensePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-gray-800/50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400">
              <Scale className="h-6 w-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">License</h1>
          </div>
          <p className="text-lg text-gray-400">
            SIP Protocol is open source software released under the MIT License.
          </p>
        </div>
      </section>

      {/* License Text */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800">
            <h2 className="text-xl font-bold mb-6 text-center">MIT License</h2>

            <div className="font-mono text-sm text-gray-300 space-y-6 leading-relaxed">
              <p>Copyright (c) 2025 RECTOR Labs</p>

              <p>
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the &quot;Software&quot;), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
              </p>

              <p>
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>

              <p className="text-gray-400">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </p>
            </div>
          </div>

          {/* What MIT License Allows */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">What This Means</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/30">
                <h3 className="font-semibold text-green-400 mb-3">You Can</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Use commercially
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Modify the source code
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Distribute copies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Use privately
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Sublicense
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                <h3 className="font-semibold text-yellow-400 mb-3">Conditions</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">!</span>
                    Include copyright notice
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">!</span>
                    Include license text
                  </li>
                </ul>
                <h3 className="font-semibold text-gray-400 mt-4 mb-3">No Warranty</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-gray-500">—</span>
                    No liability for damages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-500">—</span>
                    No warranty of any kind
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Covered Projects */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Covered Repositories</h2>
            <div className="space-y-3">
              {[
                { name: 'sip-protocol/sip-protocol', desc: 'Core SDK and types' },
                { name: 'sip-protocol/sip-website', desc: 'This website and demo' },
                { name: 'sip-protocol/docs-sip', desc: 'Documentation' },
                { name: 'sip-protocol/circuits', desc: 'ZK circuits (Noir)' },
              ].map((repo) => (
                <a
                  key={repo.name}
                  href={`https://github.com/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    <div>
                      <p className="font-mono text-sm">{repo.name}</p>
                      <p className="text-xs text-gray-500">{repo.desc}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/sip-protocol/sip-protocol/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:border-purple-500/50 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
              <Link
                href="/security"
                className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:border-purple-500/50 hover:text-white transition-colors"
              >
                Security →
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:border-purple-500/50 hover:text-white transition-colors"
              >
                About →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
