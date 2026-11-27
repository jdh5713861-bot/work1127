// 대학 AI 활용 윤리 가이드라인 원페이지 인터랙티브 스크립트 (Vanilla JS)
document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------
  // 1. 상단 네비게이션 스크롤 스파이 (ScrollSpy) & 맨위로 버튼
  // -------------------------------------------------------------
  const sections = document.querySelectorAll('.guide-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const btnTop = document.getElementById('btnTop');
  const toast = document.getElementById('toast');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }

    // 맨위로 버튼 표시 여부
    if (window.scrollY > 300) {
      btnTop.classList.add('show');
    } else {
      btnTop.classList.remove('show');
    }
  });

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 토스트 메시지 함수
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // -------------------------------------------------------------
  // 2. 5대 핵심 원칙 인터랙티브 카드 아코디언 토글
  // -------------------------------------------------------------
  const principleCards = document.querySelectorAll('.principle-card');
  const principleDetailTitle = document.getElementById('principleDetailTitle');
  const principleDetailDesc = document.getElementById('principleDetailDesc');

  const principleDetails = [
    {
      title: '01. 학문적 진실성 (Academic Integrity)',
      desc: '• 기관 및 강의계획서의 윤리 지침을 최우선 준수합니다.<br>• 활용 방식, 사용 범위, 생성 프롬프트를 명확히 기록하고 출처를 반드시 명기합니다.'
    },
    {
      title: '02. 인간 중심성과 책임성 (Human-Centered Accountability)',
      desc: '• 최종 결과물에 대한 결정권과 수정·통제 권한은 항상 학습자에게 있습니다.<br>• 발생할 수 있는 오답, 표절, 저작권 분쟁의 모든 책임은 인간(본인)이 부담합니다.'
    },
    {
      title: '03. 투명성과 신뢰성 (Transparency & Verification)',
      desc: '• 과제 제출 시 AI 활용 사실과 과정을 솔직하게 공개합니다.<br>• AI의 답변은 2차 자료이므로 반드시 1차 공인 문헌(학술 논문, 공식 통계)으로 교차 검증합니다.'
    },
    {
      title: '04. 공정성 (Fairness & Inclusivity)',
      desc: '• 성별, 인종, 출신 배경에 따른 차별과 편향된 표현이 있는지 산출물을 철저히 검토합니다.<br>• 모든 학생이 공평하게 접근하고 포용할 수 있는 학습 환경을 지향합니다.'
    },
    {
      title: '05. 정보 보호 및 안전성 (Data Privacy & Safety)',
      desc: '• 본인 및 타인의 개인정보(이름, 학번, 연락처) 및 비공개 과제·시험 문제를 절대 입력하지 않습니다.<br>• 대학이 승인한 안전한 도구를 우선 활용하고 서비스 약관을 사전 점검합니다.'
    }
  ];

  principleCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      principleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (principleDetailTitle && principleDetails[idx]) {
        principleDetailTitle.innerHTML = principleDetails[idx].title;
        principleDetailDesc.innerHTML = principleDetails[idx].desc;
      }
    });
  });

  // -------------------------------------------------------------
  // 3. APA / MLA 출처 표기 자동 생성기
  // -------------------------------------------------------------
  const toolSelect = document.getElementById('citeTool');
  const versionInput = document.getElementById('citeVersion');
  const formatSelect = document.getElementById('citeFormat');
  const citeOutput = document.getElementById('citeOutput');
  const btnCopyCite = document.getElementById('btnCopyCite');

  function updateCitation() {
    if (!citeOutput) return;
    const tool = toolSelect ? toolSelect.value : 'ChatGPT';
    const version = (versionInput && versionInput.value.trim()) ? versionInput.value.trim() : 'Aug 20 version';
    const format = formatSelect ? formatSelect.value : 'APA';

    let result = '';
    if (format === 'APA') {
      const dev = tool === 'ChatGPT' ? 'OpenAI' : (tool === 'Gemini' ? 'Google' : 'Anthropic');
      const url = tool === 'ChatGPT' ? 'https://chat.openai.com/chat' : (tool === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai');
      result = `${dev}. (2026). ${tool} (${version}) [Large language model]. ${url}`;
    } else {
      // MLA
      result = `"${tool} response to prompt about assignment topic." ${tool}, ${version}, 2026.`;
    }
    citeOutput.textContent = result;
  }

  if (toolSelect) toolSelect.addEventListener('change', updateCitation);
  if (versionInput) versionInput.addEventListener('input', updateCitation);
  if (formatSelect) formatSelect.addEventListener('change', updateCitation);
  updateCitation();

  if (btnCopyCite) {
    btnCopyCite.addEventListener('click', () => {
      if (!citeOutput) return;
      navigator.clipboard.writeText(citeOutput.textContent).then(() => {
        showToast('📋 인용 표기 양식이 클립보드에 복사되었습니다!');
      }).catch(() => {
        showToast('복사에 실패했습니다. 수동으로 복사해주세요.');
      });
    });
  }

  // -------------------------------------------------------------
  // 4. 위반 등급 판정 퀴즈
  // -------------------------------------------------------------
  const quizButtons = document.querySelectorAll('.btn-quiz-opt');
  const quizFeedback = document.getElementById('quizFeedback');

  quizButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.grade;
      if (!quizFeedback) return;
      quizFeedback.classList.remove('correct', 'wrong', 'show');

      if (selected === 'warning') {
        quizFeedback.classList.add('correct', 'show');
        quizFeedback.innerHTML = '<strong>정답: [경고 (Moderate)] 등급</strong><br>AI가 생성한 글을 직접 검증이나 재구성 없이 본인 창작물인 것처럼 제출(기만적 표절)한 행위는 해당 과제 0점 처리 및 학문윤리 교육 이수 대상이 됩니다.';
      } else {
        quizFeedback.classList.add('wrong', 'show');
        quizFeedback.innerHTML = '<strong>오답입니다!</strong><br>생성 내용을 출처 없이 본인의 글인 것처럼 위장하여 제출하는 행위는 단순 주의(Minor)를 넘어선 <strong>[경고(Moderate)]</strong> 등급에 해당하여 0점 처리될 수 있습니다.';
      }
    });
  });

  // -------------------------------------------------------------
  // 5. 실시간 자가 체크리스트 진단기
  // -------------------------------------------------------------
  const sliderAi = document.getElementById('sliderAi');
  const valAi = document.getElementById('valAi');
  const valStudent = document.getElementById('valStudent');
  const checkBoxes = document.querySelectorAll('.checklist-checkbox');
  const scoreNumber = document.getElementById('scoreNumber');
  const scoreStatus = document.getElementById('scoreStatus');
  const btnCopyReport = document.getElementById('btnCopyReport');

  function calculateEthicalScore() {
    let checkedCount = 0;
    checkBoxes.forEach(cb => {
      if (cb.checked) checkedCount++;
    });

    const aiPercent = sliderAi ? parseInt(sliderAi.value, 10) : 30;
    const studentPercent = 100 - aiPercent;
    if (valAi) valAi.textContent = `${aiPercent}%`;
    if (valStudent) valStudent.textContent = `${studentPercent}%`;

    // 기본 점수 계산 (체크된 항목 비중)
    let score = Math.round((checkedCount / checkBoxes.length) * 100);

    // AI 기여도가 70% 초과인 경우 감점
    if (aiPercent > 70) {
      score = Math.max(0, score - 20);
    }

    if (scoreNumber) scoreNumber.textContent = `${score}점`;

    if (scoreStatus) {
      if (score >= 85) {
        scoreStatus.textContent = '안전 및 윤리 기준 충족 ✅';
        scoreStatus.style.color = '#15803d';
      } else if (score >= 60) {
        scoreStatus.textContent = '주의 필요 (보완 후 제출 권고) ⚠️';
        scoreStatus.style.color = '#b45309';
      } else {
        scoreStatus.textContent = '위반 위험 (부정행위 간주 가능성 높음) ❌';
        scoreStatus.style.color = '#b91c1c';
      }
    }
  }

  if (sliderAi) sliderAi.addEventListener('input', calculateEthicalScore);
  checkBoxes.forEach(cb => cb.addEventListener('change', calculateEthicalScore));
  calculateEthicalScore();

  if (btnCopyReport) {
    btnCopyReport.addEventListener('click', () => {
      const aiPercent = sliderAi ? sliderAi.value : 30;
      const studentPercent = 100 - aiPercent;
      let checkedItems = [];
      checkBoxes.forEach(cb => {
        if (cb.checked) checkedItems.push(`  [v] ${cb.dataset.label || cb.parentElement.textContent.trim()}`);
      });

      const reportText = 
`[대학 과제 AI 활용 자가 점검표]
• 학생 기여도: ${studentPercent}% / AI 기여도: ${aiPercent}%
• 자가 점검 충족 항목 (${checkedItems.length}/${checkBoxes.length}):
${checkedItems.join('\n')}
• 진단 결과: ${scoreNumber ? scoreNumber.textContent : ''} (${scoreStatus ? scoreStatus.textContent : ''})
• 서명: 본인은 위 점검 사항이 사실임을 서약하며, 과제 결과에 대한 모든 책임을 집니다.`;

      navigator.clipboard.writeText(reportText).then(() => {
        showToast('📋 자가 점검표 요약본이 클립보드에 복사되었습니다!');
      }).catch(() => {
        showToast('복사에 실패했습니다.');
      });
    });
  }

});
