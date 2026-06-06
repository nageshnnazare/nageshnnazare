/** Profile content — mirrors resume sections as virtual workspace files */
window.PROFILE = {
  meta: {
    name: 'Nagesh N Nazare',
    title: 'Staff Engineer, R&D · Low-Level Systems',
    email: 'nageshnnazare.official@gmail.com',
    location: 'Bengaluru, India',
    links: {
      linkedin: 'https://linkedin.com/in/nagesh-n-nazare/',
      github: 'https://github.com/nageshnnazare',
      scholar: 'https://scholar.google.com/citations?user=KDOJ2IAAAAAJ&hl=en',
    },
  },

  files: {
    'about.md': {
      lang: 'markdown',
      content: `# Nagesh N Nazare

> Staff Engineer, R&D · 7+ years · Low-level systems · C/C++ · Bengaluru

## Overview

R&D Software Engineer with **7+ years** of experience in low-level systems development. Proven expertise in modern **C/C++** and delivering significant **performance & scalability** improvements for large-scale production software.

## Links

| Platform | Handle |
|----------|--------|
| Website  | [nageshnnazare.github.io](https://nageshnnazare.github.io/) |
| Email    | [nageshnnazare.official@gmail.com](mailto:nageshnnazare.official@gmail.com) |
| LinkedIn | [nagesh-n-nazare](https://linkedin.com/in/nagesh-n-nazare/) |
| GitHub   | [nageshnnazare](https://github.com/nageshnnazare) |
| Scholar  | [NageshNNazare](https://scholar.google.com/citations?user=KDOJ2IAAAAAJ) |

## Focus areas

- Compiler & EDA toolchains (Design Compiler, Fusion Compiler)
- Multi-threaded runtime optimization
- Memory safety & concurrency debugging (ASan, TSan, Valgrind)
- Embedded systems & real-time control (Zynq, EtherCAT, Satcom)

---

*Explore **skills.toml**, **experience/**, **projects/**, and more in the sidebar.*
`,
    },

    'skills.toml': {
      lang: 'toml',
      content: `# Technical Skills — nagesh.profile

[languages]
primary = ["C", "C++11/14/17", "CUDA", "x86 Assembly", "Python"]
hardware = ["Verilog"]
scripting = ["tcl", "bash", "csh", "sh", "Make"]

[debugging]
tools = ["gdb", "undodb", "Valgrind", "AddressSanitizer", "ThreadSanitizer", "Coverity"]

[tooling]
vcs = ["git", "perforce"]
workflow = ["jira", "VSCode", "Cursor"]

[libraries]
systems = ["stl", "tbb", "pthread"]
other = ["raylib", "ncurses"]
`,
      typeDelay: 10,
    },

    'experience/synopsys.md': {
      lang: 'markdown',
      folder: 'experience',
      content: `# Synopsys Inc.

> Staff Engineer, R&D Engineering · Sep 2022 — Present · Bengaluru
> Design Compiler / Fusion Compiler · C/C++/Tcl/Python/Verilog

## Highlights

- Optimized **Attribute System** in Design Compiler → **7%+** runtime & scalability across 21 production-scale designs (motivating designs **>15%**).
- Re-architected legacy **Timer Update Algorithm** → **6.5%+** on 16-core (motivating designs **25–30%**) via efficient multi-threading.
- Spearheaded **Non-Physical flow** in Fusion Compiler — buffering/sizing strategies, critical bugs, production readiness.
- Architected policy-based **Early Design** framework for dirty timing constraints → better convergence & runtime.
- Debugged **80+** critical customer issues, **500+** quality defects (non-determinism, leaks, races, UAF) with gdb/udb, Valgrind, TSan, ASan.
`,
    },

    'experience/bel.md': {
      lang: 'markdown',
      folder: 'experience',
      content: `# Bharat Electronics Ltd.

> Deputy Engineer, Product R&D · Oct 2018 — Aug 2022 · Bengaluru
> Strategic Communications · Embedded C/C++/CMake/Verilog

## Highlights

- End-to-end **Satcom-on-the-Move (SOTM)** — architecture, Xilinx **Zynq** SoC, **PetaLinux** bring-up.
- Real-time motion compensation **control algorithm** — pointing accuracy within **0.2%** under dynamic marine motion.
- **EtherCAT Master** on Zynq for high-precision closed-loop motor-drive control.
- **OpenAMIP** server for third-party satellite modem ↔ proprietary antenna control unit.
`,
    },

    'experience/nokia.md': {
      lang: 'markdown',
      folder: 'experience',
      content: `# Nokia

> Intern, R&D (YICP) · Aug 2017 — Dec 2017 · Bengaluru
> Networks · C/C++/Arduino

## Highlights

- Cellular-based gate control prototype replacing RFID infrastructure.
- **Runner-up** at Nokia Innovation Day 2017.
`,
    },

    'education.md': {
      lang: 'markdown',
      content: `# Education

> R.V. College of Engineering · Sep 2014 — May 2018 · Bengaluru

## Degree

**B.E. Electronics & Telecommunication**

## Highlights

- **CGPA: 9.07/10** — Gold Medal, first rank
- Outstanding in **9** courses, Excellent in **30** of 46
- Published **1 National** & **4 International** conference papers
`,
    },

    'awards.md': {
      lang: 'markdown',
      content: `# Awards & Achievements

> Recognition across Synopsys, BEL, RVCE, and industry events

## Highlights

- **Synopsys Quarterly Recognition** (Q4 2025 & Q2 2023) — critical high-impact issues; team execution awards
- **SILC Finalist** (2025, 2023) — technical posters on runtime & scalability strategies
- **BEL R&D Excellence Award 2022** — indigenous Satcom-on-the-Move system
- **First Rank 2018** — E&T Engineering, RVCE
- **Winner** — Cisco Ideathon 2018, RVCE
- **Runner-up** — Nokia Innovation Day 2017
`,
    },

    'certifications.json': {
      lang: 'json',
      content: `{
  "certifications": [
    {
      "title": "Modern C++11/14/17",
      "issuer": "Packt",
      "url": "https://www.coursera.org/account/accomplishments/specialization/0WUOG9B1QK7F"
    },
    {
      "title": "Accelerated Computing in CUDA C/C++",
      "issuer": "NVIDIA",
      "url": "https://learn.nvidia.com/certificates?id=PuisTXevQTSlMtpaG9bhpA"
    },
    {
      "title": "Claude Code",
      "issuer": "Anthropic",
      "url": "https://verify.skilljar.com/c/hnxf4b7eucfi"
    },
    {
      "title": "Accelerated Computer Science Fundamentals",
      "issuer": "UIUC",
      "url": "https://www.coursera.org/account/accomplishments/specialization/RTREEARS54NZ"
    },
    {
      "title": "Supervised Machine Learning",
      "issuer": "Stanford Online",
      "url": "https://www.coursera.org/account/accomplishments/verify/6SMC64US4VSV"
    },
    {
      "title": "Algorithmic Toolbox",
      "issuer": "UCSA",
      "url": "https://www.coursera.org/account/accomplishments/verify/XGH94G5FM357"
    }
  ]
}`,
      typeDelay: 16,
    },

    'projects/lldb.cpp': {
      lang: 'cpp',
      folder: 'projects',
      content: `// LLVM Debugger (lldb) — Console pane integration
// Author: Nagesh N Nazare
// PR: https://github.com/llvm/llvm-project/pull/177160

namespace lldb {
namespace console {

/// Dedicated console pane for real-time stdout/stderr capture
class StreamCapturePane {
public:
    void AttachToProcess(Process& proc);
    void OnStdout(const std::string& chunk);
    void OnStderr(const std::string& chunk);
    void FlushToLog();

private:
    std::mutex m_io_lock;
    RingBuffer m_buffer;  // bounded, thread-safe
};

} // namespace console
} // namespace lldb
`,
      typeDelay: 12,
    },

    'projects/cynide.cy': {
      lang: 'plaintext',
      folder: 'projects',
      content: `# cynide — Python-like syntax, AoT compiled via LLVM
# https://github.com/nageshnnazare/cynide

# Pipeline: lexer → parser → sema → LLVM IR → native code

def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

def main():
    print("cynide", version())
    for i in range(10):
        print(f"fib({i}) = {fib(i)}")
`,
      typeDelay: 14,
    },

    'publications.bib': {
      lang: 'plaintext',
      content: `@inproceedings{nazare2020barrel,
  title={Low-Power 8-Bit Adiabatic Barrel Shifter for DSP Applications},
  booktitle={ACIE 2020},
  publisher={Springer},
  doi={10.1007/978-981-15-1483-8_14}
}

@inproceedings{nazare2019han,
  title={Low-Power PFAL Based Speculative Han-Carlson Adder for Signal Processing},
  booktitle={ICICCT 2019},
  publisher={Springer},
  doi={10.1007/978-981-13-8461-5_74}
}

@article{nazare2019vedic,
  title={Design and Analysis of Adiabatic Vedic Multipliers},
  journal={IJPAM},
  year={2019},
  url={https://acadpubl.eu/hub/2018-119-14/articles/3/75.pdf}
}

@inproceedings{nazare2018prefix,
  title={Design and Analysis of Low-Power 16-bit Parallel-Prefix Adiabatic Adders},
  booktitle={RCEICT 2018},
  publisher={IEEE},
  doi={10.1109/RTEICT42901.2018.9012343}
}
`,
      typeDelay: 10,
    },

    'contact.json': {
      lang: 'json',
      content: `{
  "name": "Nagesh N Nazare",
  "role": "Staff Engineer, R&D Engineering",
  "company": "Synopsys Inc.",
  "location": "Bengaluru, India",
  "email": "nageshnnazare.official@gmail.com",
  "linkedin": "https://linkedin.com/in/nagesh-n-nazare/",
  "github": "https://github.com/nageshnnazare",
  "google_scholar": "https://scholar.google.com/citations?user=KDOJ2IAAAAAJ&hl=en",
  "website": "https://nageshnnazare.github.io/"
}`,
      typeDelay: 18,
    },

    'benchmark.sh': {
      lang: 'shell',
      content: `#!/usr/bin/env bash
# Simulated perf run — Design Compiler attribute path

DESIGNS=21
CORES=16
THREADS=$(nproc)

echo "=== Timer Update Benchmark ==="
echo "Designs: $DESIGNS | Cores: $CORES | Threads: $THREADS"
echo ""

for i in $(seq 1 $DESIGNS); do
  runtime=$(echo "scale=2; 100 - $RANDOM % 15" | bc)
  printf "design_%02d: %s%% baseline improvement\\n" "$i" "$runtime"
done

echo ""
echo "Aggregate: 6.5%+ (16-core), motivating designs 25-30%"
`,
      typeDelay: 8,
    },
  },

  fileTree: [
    { name: 'about.md', path: 'about.md' },
    { name: 'skills.toml', path: 'skills.toml' },
    {
      name: 'experience',
      children: [
        { name: 'synopsys.md', path: 'experience/synopsys.md' },
        { name: 'bel.md', path: 'experience/bel.md' },
        { name: 'nokia.md', path: 'experience/nokia.md' },
      ],
    },
    { name: 'education.md', path: 'education.md' },
    { name: 'awards.md', path: 'awards.md' },
    { name: 'certifications.json', path: 'certifications.json' },
    {
      name: 'projects',
      children: [
        { name: 'lldb.cpp', path: 'projects/lldb.cpp' },
        { name: 'cynide.cy', path: 'projects/cynide.cy' },
      ],
    },
    { name: 'publications.bib', path: 'publications.bib' },
    { name: 'contact.json', path: 'contact.json' },
    { name: 'benchmark.sh', path: 'benchmark.sh' },
  ],

  terminalScript: [
    { cmd: 'whoami', out: 'nagesh@jarvis', delay: 400 },
    { cmd: 'uname -a', out: 'Linux eda-build 6.8.0 #1 SMP x86_64 GNU/Linux', delay: 500 },
    { cmd: 'gcc --version | head -1', out: 'gcc (GCC) 13.2.0', delay: 400 },
    { cmd: 'cat about.md | head -3', out: '# About\n\nR&D Software Engineer with **7+ years**...', delay: 600 },
    { cmd: './benchmark.sh 2>/dev/null | tail -3', out: 'design_20: 12.00% baseline improvement\n\nAggregate: 6.5%+ (16-core), motivating designs 25-30%', delay: 800 },
    { cmd: 'git log --oneline -3', out: 'a3f91c2 perf: attribute system — 7%+ across 21 designs\n8b2e104 fix: timer update MT scaling on 16-core\nc1d0a88 feat: fusion compiler non-physical flow', delay: 700 },
    { cmd: 'echo "Profile loaded ✓"', out: 'Profile loaded ✓', delay: 300 },
  ],

  aiScript: [
    {
      role: 'user',
      text: 'Profile the timer update hot path — we need better scaling on 16-core.',
    },
    {
      role: 'agent',
      text: `Analyzing **Timer Update Algorithm** in Design Compiler…

Found bottlenecks:
1. Lock contention on timing path group updates
2. Job scheduling load imbalance
3. Cache-unfriendly path group updates`,
      delay: 1200,
    },
    {
      role: 'user',
      text: 'Run TSan on the latest customer repro — possible data race in attribute cache.',
    },
    {
      role: 'agent',
      text: `Running ThreadSanitizer…

\`\`\`
WARNING: ThreadSanitizer: data race
  Write at attribute_cache.cpp:412 by thread T3
  Read  at attribute_lookup.cpp:89 by thread T7
\`\`\`

Matches your track record: **500+** quality defects including races & UAF. Suggest atomic \`shared_ptr\` swap for cache generation + RCU-style readers.`,
      delay: 1500,
    },
    {
      role: 'user',
      text: 'Summarize my open-source lldb contribution for about.md.',
    },
    {
      role: 'agent',
      text: `**LLVM lldb** — integrated a dedicated **console pane** for real-time stdout/stderr capture ([PR #177160](https://github.com/llvm/llvm-project/pull/177160)).

Improves debugger visibility during interactive sessions — fits your systems/debugging focus.`,
      delay: 1000,
    },
  ],
};
