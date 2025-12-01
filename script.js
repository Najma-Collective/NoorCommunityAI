const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const micState = document.getElementById('mic-state');
const statusText = document.getElementById('status-text');
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const ttsToggle = document.getElementById('tts-toggle');
const apiKeyInput = document.getElementById('google-api-key');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let speaking = false;

const loadSettings = () => {
  const ttsEnabled = localStorage.getItem('ttsEnabled') === 'true';
  const apiKey = localStorage.getItem('googleApiKey') || '';
  ttsToggle.checked = ttsEnabled;
  apiKeyInput.value = apiKey;
};

const saveSettings = () => {
  localStorage.setItem('ttsEnabled', ttsToggle.checked);
  localStorage.setItem('googleApiKey', apiKeyInput.value.trim());
};

settingsToggle.addEventListener('click', () => {
  const isOpen = !settingsPanel.hidden;
  settingsPanel.hidden = isOpen;
  settingsToggle.setAttribute('aria-expanded', (!isOpen).toString());
  if (!isOpen) {
    settingsPanel.querySelector('input, button, textarea, select')?.focus();
  } else {
    settingsToggle.focus();
  }
});

ttsToggle.addEventListener('change', saveSettings);
apiKeyInput.addEventListener('input', saveSettings);

const updateMicState = (state) => {
  micState.classList.remove('listening', 'processing');
  micBtn.setAttribute('aria-pressed', state === 'listening');
  switch (state) {
    case 'listening':
      micState.classList.add('listening');
      statusText.textContent = 'Listening…';
      micBtn.textContent = '🛑';
      micBtn.setAttribute('aria-label', 'Stop recording');
      break;
    case 'processing':
      micState.classList.add('processing');
      statusText.textContent = 'Processing voice…';
      micBtn.textContent = '⏳';
      micBtn.setAttribute('aria-label', 'Processing recording');
      break;
    default:
      statusText.textContent = 'Idle';
      micBtn.textContent = '🎤';
      micBtn.setAttribute('aria-label', 'Start recording');
  }
};

const appendMessage = (role, content) => {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar-icon';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = role === 'ai' ? '🤖' : '🧑';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `<div class="meta">${role === 'ai' ? 'Assistant' : 'You'}</div>${content}`;
  bubble.tabIndex = 0;

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  if (role === 'ai' && ttsToggle.checked) {
    speakText(content.replace(/<[^>]*>?/gm, ''));
  }
};

const speakText = (text) => {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  speaking = true;
  utterance.onend = () => {
    speaking = false;
  };
  speechSynthesis.speak(utterance);
};

const simulateAIResponse = async (userMessage) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return `You said: ${userMessage}`;
};

const sendMessage = async (content) => {
  if (!content.trim()) return;
  appendMessage('user', content);
  inputEl.value = '';

  updateMicState('idle');
  appendMessage('ai', 'Thinking…');
  const thinkingBubble = messagesEl.querySelector('.message.ai:last-child .bubble');

  const aiText = await simulateAIResponse(content.trim());
  thinkingBubble.innerHTML = `<div class="meta">Assistant</div>${aiText}`;
  if (ttsToggle.checked) {
    speakText(aiText);
  }
};

sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(inputEl.value);
  }
});

const startRecording = async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    alert('Microphone is not available in this browser.');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.onstop = handleRecordingStop;
    mediaRecorder.start();
    isRecording = true;
    updateMicState('listening');
  } catch (err) {
    console.error('Mic error', err);
    alert('Could not access microphone. Please check permissions.');
  }
};

const handleRecordingStop = async () => {
  isRecording = false;
  updateMicState('processing');

  const blob = new Blob(audioChunks, { type: 'audio/webm' });
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64Audio = reader.result.split(',')[1];
    try {
      const transcript = await transcribeWithGoogle(base64Audio);
      if (transcript) {
        sendMessage(transcript);
      } else {
        statusText.textContent = 'Could not transcribe. Please type your message.';
        updateMicState('idle');
      }
    } catch (error) {
      console.error('Transcription failed', error);
      statusText.textContent = 'Voice failed. Type to continue.';
      updateMicState('idle');
    }
  };

  reader.readAsDataURL(blob);
};

const transcribeWithGoogle = async (base64Audio) => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    alert('Please enter your Google Speech API key in settings.');
    updateMicState('idle');
    return '';
  }

  const body = {
    config: {
      encoding: 'WEBM_OPUS',
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
    },
    audio: {
      content: base64Audio,
    },
  };

  const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Google Speech API error');
  }

  const data = await response.json();
  const result = data.results?.[0]?.alternatives?.[0]?.transcript;
  return result || '';
};

micBtn.addEventListener('click', () => {
  if (isRecording) {
    mediaRecorder.stop();
    micBtn.setAttribute('aria-pressed', 'false');
  } else {
    startRecording();
  }
});

loadSettings();
