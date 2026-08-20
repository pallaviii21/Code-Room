import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  Code2, 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  Cpu, 
  ExternalLink,
  Zap,
  Layers
} from 'lucide-react';

const CODE_PRESETS = {
  javascript: {
    name: 'JavaScript (Node.js)',
    icon: 'JS',
    color: 'text-yellow-400',
    snippets: [
      {
        title: 'Two Sum Algorithm',
        code: `// Two Sum: Find indices of two numbers that add to target
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const numbers = [2, 7, 11, 15];
const target = 9;
console.log("Input Array:", numbers);
console.log("Target:", target);
console.log("Matching Indices:", twoSum(numbers, target));`,
        output: `Input Array: [ 2, 7, 11, 15 ]
Target: 9
Matching Indices: [ 0, 1 ]
[Execution Status]: 0 (Success)
Execution Time: 114ms | Memory: 12.8 MB`
      },
      {
        title: 'Async Task Queue',
        code: `async function processQueue(tasks) {
  console.log("Starting concurrent task execution...");
  const results = await Promise.all(
    tasks.map(async (task, idx) => {
      const duration = 50 * (idx + 1);
      return \`Task \${task} completed in \${duration}ms\`;
    })
  );
  return results;
}

processQueue(['Sync', 'Compile', 'Broadcast']).then(res => {
  res.forEach(item => console.log("✓", item));
});`,
        output: `Starting concurrent task execution...
✓ Task Sync completed in 50ms
✓ Task Compile completed in 100ms
✓ Task Broadcast completed in 150ms
[Execution Status]: 0 (Success)
Execution Time: 98ms | Memory: 11.2 MB`
      }
    ]
  },
  python: {
    name: 'Python 3.10',
    icon: 'PY',
    color: 'text-blue-400',
    snippets: [
      {
        title: 'Fibonacci DP with Memoization',
        code: `# Dynamic Programming: Fibonacci with Memoization
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]

test_values = [5, 10, 20, 30]
print("⚡ Computing Fibonacci sequence:")
for val in test_values:
    print(f"Fib({val}) = {fibonacci_memo(val)}")`,
        output: `⚡ Computing Fibonacci sequence:
Fib(5) = 5
Fib(10) = 55
Fib(20) = 6765
Fib(30) = 832040
[Execution Status]: 0 (Success)
Execution Time: 86ms | Memory: 8.4 MB`
      },
      {
        title: 'QuickSort Implementation',
        code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

unsorted_data = [64, 34, 25, 12, 22, 11, 90]
print("Unsorted:", unsorted_data)
sorted_data = quicksort(unsorted_data)
print("Sorted  :", sorted_data)`,
        output: `Unsorted: [64, 34, 25, 12, 22, 11, 90]
Sorted  : [11, 12, 22, 25, 34, 64, 90]
[Execution Status]: 0 (Success)
Execution Time: 92ms | Memory: 7.9 MB`
      }
    ]
  },
  cpp: {
    name: 'C++ (GCC 12)',
    icon: 'C++',
    color: 'text-sky-400',
    snippets: [
      {
        title: 'Binary Search Algorithm',
        code: `#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> sortedVec = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;
    int index = binarySearch(sortedVec, target);
    
    std::cout << "Vector Size: " << sortedVec.size() << std::endl;
    std::cout << "Target " << target << " found at index: " << index << std::endl;
    return 0;
}`,
        output: `Vector Size: 10
Target 23 found at index: 5
[Execution Status]: 0 (Success)
Compilation Time: 135ms | Binary Size: 18 KB`
      }
    ]
  },
  java: {
    name: 'Java (OpenJDK 17)',
    icon: 'JAVA',
    color: 'text-orange-400',
    snippets: [
      {
        title: 'LRU Cache Concept',
        code: `import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        int capacity = 3;
        LinkedHashMap<String, Integer> cache = new LinkedHashMap<>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<String, Integer> eldest) {
                return size() > capacity;
            }
        };

        cache.put("user_1", 100);
        cache.put("user_2", 200);
        cache.put("user_3", 300);
        cache.get("user_1"); // Access user_1
        cache.put("user_4", 400); // Evicts user_2

        System.out.println("Active Keys in LRU Cache: " + cache.keySet());
    }
}`,
        output: `Active Keys in LRU Cache: [user_3, user_1, user_4]
[Execution Status]: 0 (Success)
Compilation Time: 210ms | JVM Heap: 24.5 MB`
      }
    ]
  }
};

export const InteractivePlayground = ({ onLaunchRoom }) => {
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState(
    CODE_PRESETS.javascript.snippets[0].output
  );

  const currentLangData = CODE_PRESETS[selectedLang];
  const currentSnippet = currentLangData.snippets[snippetIndex] || currentLangData.snippets[0];

  const handleLangChange = (langKey) => {
    setSelectedLang(langKey);
    setSnippetIndex(0);
    setOutputResult(CODE_PRESETS[langKey].snippets[0].output);
  };

  const handleSnippetChange = (index) => {
    setSnippetIndex(index);
    setOutputResult(currentLangData.snippets[index].output);
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutputResult('Compiling and executing against cloud container sandbox...');
    setTimeout(() => {
      setIsRunning(false);
      setOutputResult(currentSnippet.output);
    }, 600);
  };

  return (
    <section id="playground" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Demo Environment</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Test Drive the{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              In-Browser Runner
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Switch between languages, examine real algorithm patterns, and experience how fast Code Room executes your code.
          </p>
        </div>

        {/* Playground Window Container */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          
          {/* Top Bar: Language Tabs & Actions */}
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* Language Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {Object.keys(CODE_PRESETS).map((langKey) => {
                const item = CODE_PRESETS[langKey];
                const isActive = selectedLang === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => handleLangChange(langKey)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600/30 text-white border border-blue-500/50 shadow-lg shadow-blue-500/20' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <span className={`font-mono text-xs ${item.color} font-bold`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Run Button & Snippet Selector */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {currentLangData.snippets.length > 1 && (
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  {currentLangData.snippets.map((snip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSnippetChange(idx)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        snippetIndex === idx ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {snip.title}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
                <span>{isRunning ? 'Compiling...' : 'Run Algorithm'}</span>
              </button>
            </div>
          </div>

          {/* Editor & Terminal Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
            
            {/* Code View Area */}
            <div className="lg:col-span-7 p-6 bg-slate-950/80 font-mono text-xs sm:text-sm text-slate-200 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-x-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs text-slate-400 font-sans">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  {currentSnippet.title}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Syntax: {selectedLang}
                </span>
              </div>
              <pre className="leading-relaxed whitespace-pre font-mono selection:bg-blue-500/30">
                {currentSnippet.code}
              </pre>
            </div>

            {/* Terminal Live Output Area */}
            <div className="lg:col-span-5 p-6 bg-[#070b13] font-mono text-xs text-slate-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-slate-400 font-sans">
                  <span className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Standard Output (stdout)
                  </span>
                  <span className="text-[11px] text-slate-500">Piston Cloud Engine</span>
                </div>
                <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800/80 min-h-[200px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                  {outputResult}
                </div>
              </div>

              {/* Bottom Quick-Start Note */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-sans flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Ready to write custom code?</span>
                </div>
                <a
                  href="#quick-join"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline cursor-pointer font-sans"
                >
                  <span>Launch Live Room</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default InteractivePlayground;
