import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TrustBadge } from '../components/common/TrustBadge.jsx';
import { WorkerCard } from '../components/worker/WorkerCard.jsx';
import { LanguageProvider } from '../context/LanguageContext.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import { Navbar } from '../components/common/Navbar.jsx';
import { AiAssistantBot } from '../components/common/AiAssistantBot.jsx';
import { AiVoiceNotificationPlayer } from '../components/common/AiVoiceNotificationPlayer.jsx';
import { globalVoiceCoordinator } from '../services/voiceTranslationService.js';

describe('KaaryaMithra Client Components & Brand Verification', () => {
  it('renders TrustBadge with verified explanation tooltip', () => {
    render(<TrustBadge type="phone_confirmed" />);
    const badgeBtn = screen.getByRole('button', { name: /phone confirmed/i });
    expect(badgeBtn).toBeInTheDocument();

    // Hover to reveal explanation
    fireEvent.mouseEnter(badgeBtn);
    expect(
      screen.getByText(/this worker controls this phone number/i)
    ).toBeInTheDocument();
  });

  it('never displays forbidden badges like "background checked" or "certified"', () => {
    // Attempting to render an unallowed badge should render nothing
    const { container } = render(<TrustBadge type="background_checked" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders WorkerCard with pricing guidance, locality, and honest trust labels', () => {
    const mockWorker = {
      _id: '12345',
      slug: 'ramesh-electrician',
      displayName: 'Ramesh Kumar',
      categories: [{ name: 'Electrician', slug: 'electrician' }],
      skills: ['MCB repair', 'Wiring'],
      locality: 'MVP Colony',
      districtCity: 'Visakhapatnam',
      indicativePriceMin: 250,
      indicativePriceMax: 800,
      experienceYears: 8,
      availability: 'available',
      averageRating: 4.8,
      reviewCount: 3,
      verificationStatus: {
        phoneConfirmed: true,
        communityReferenceAdded: true,
        skillEvidenceSubmitted: false,
      },
    };

    render(
      <BrowserRouter>
        <WorkerCard worker={mockWorker} />
      </BrowserRouter>
    );

    expect(screen.getByText('Ramesh Kumar')).toBeInTheDocument();
    expect(screen.getByText('Electrician')).toBeInTheDocument();
    expect(screen.getByText('MVP Colony')).toBeInTheDocument();
    expect(screen.getByText(/250 – 800/)).toBeInTheDocument();
    expect(screen.getByText('Phone confirmed')).toBeInTheDocument();
    expect(screen.getByText('Community reference added')).toBeInTheDocument();
  });

  it('renders Navbar with KaaryaMithra branding, language selector, and profile option', () => {
    render(
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    );

    expect(screen.getByText('Kaarya')).toBeInTheDocument();
    expect(screen.getByText('Mithra')).toBeInTheDocument();

    // Verify forbidden team names are NOT in the document
    expect(screen.queryByText(/samavesh bharat/i)).toBeNull();
    expect(screen.queryByText(/dreamstack/i)).toBeNull();

    // Verify language selector and profile menu buttons exist
    const langBtn = screen.getByRole('button', { name: /select language/i });
    const profileBtn = screen.getByRole('button', { name: /profile and account menu/i });
    expect(langBtn).toBeInTheDocument();
    expect(profileBtn).toBeInTheDocument();

    // Click profile button to open dropdown
    fireEvent.click(profileBtn);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.getByText(/join as a worker/i)).toBeInTheDocument();
  });

  it('renders AiAssistantBot and opens chat window with operational guidance', () => {
    render(
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AiAssistantBot />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    );

    // Initial floating button should be present
    const toggleBtn = screen.getByLabelText(/open kaaryamithra ai assistant/i);
    expect(toggleBtn).toBeInTheDocument();

    // Click to open assistant
    fireEvent.click(toggleBtn);

    // Check assistant modal header and greeting
    expect(screen.getByText('KaaryaMithra AI')).toBeInTheDocument();
    expect(screen.getByText(/Doubts & Operations Bot/i)).toBeInTheDocument();
    expect(screen.getByText(/How do I find & hire a worker\?/i)).toBeInTheDocument();
  });

  it('operates in clean Light Theme and ensures dark theme class is removed', () => {
    localStorage.clear();
    document.documentElement.classList.add('dark');

    render(
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Navbar />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    );

    // document.documentElement should NOT contain dark class
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('kaaryamithra_theme')).toBeNull();
  });

  it('renders prominent teal "Listen to Notification" button and expands audio controls', () => {
    // Mock SpeechSynthesis for JSDOM
    window.speechSynthesis = {
      speak: vitest.fn(),
      cancel: vitest.fn(),
      pause: vitest.fn(),
      resume: vitest.fn(),
      getVoices: vitest.fn().mockReturnValue([
        { lang: 'te-IN', name: 'Telugu', default: false },
        { lang: 'hi-IN', name: 'Hindi', default: false },
        { lang: 'en-IN', name: 'English', default: true },
      ]),
    };
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
      this.lang = 'en-IN';
      this.rate = 1;
      this.pitch = 1;
      this.volume = 1;
    };

    const mockEnquiry = {
      _id: 'enq-101',
      customerContact: { name: 'Ananya Sharma', phone: '9876543210' },
      locality: 'MVP Colony',
      categoryId: { name: 'Electrician' },
      message: 'Main switchboard keeps tripping when air conditioner starts. Need inspection of MCB and connection.',
      preferredTime: 'Tomorrow morning around 10:00 AM',
      status: 'New',
    };

    render(
      <LanguageProvider>
        <AiVoiceNotificationPlayer enquiry={mockEnquiry} />
      </LanguageProvider>
    );

    // 1. Prominent teal button is visible
    const listenBtn = screen.getByRole('button', { name: /listen to voice notification/i });
    expect(listenBtn).toBeInTheDocument();
    expect(screen.getByText(/🔊 Listen to Notification/i)).toBeInTheDocument();

    // 2. Click button to expand controls and trigger speech
    fireEvent.click(listenBtn);
    expect(window.speechSynthesis.speak).toHaveBeenCalled();

    // 3. Audio Controls Deck is displayed
    expect(screen.getByText('AI Voice Notification Player')).toBeInTheDocument();

    // 4. Language selector contains Telugu, Hindi, English, Tamil, Kannada, Bengali
    expect(screen.getByRole('button', { name: /telugu/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hindi/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tamil/i })).toBeInTheDocument();

    // 5. Displays original notification text alongside voice controls
    expect(screen.getByText(/Original Customer Message:/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/Main switchboard keeps tripping when air conditioner starts/i).length
    ).toBeGreaterThanOrEqual(1);

    // 6. Displays translated voice script
    expect(screen.getByText(/Spoken Voice Script/i)).toBeInTheDocument();

    // 7. Playback controls (Play/Pause, Replay, Volume)
    expect(screen.getByRole('button', { name: /replay/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/audio volume slider/i)).toBeInTheDocument();
  });

  it('stops previous notification when a new notification begins playback', () => {
    window.speechSynthesis = {
      speak: vitest.fn(),
      cancel: vitest.fn(),
      pause: vitest.fn(),
      resume: vitest.fn(),
      getVoices: vitest.fn().mockReturnValue([]),
    };
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };

    const mockEnqA = {
      _id: 'enq-A',
      customerContact: { name: 'Customer A' },
      message: 'Repair ceiling fan',
    };
    const mockEnqB = {
      _id: 'enq-B',
      customerContact: { name: 'Customer B' },
      message: 'Repair bathroom pipe',
    };

    const { rerender } = render(
      <div>
        <AiVoiceNotificationPlayer enquiry={mockEnqA} />
        <AiVoiceNotificationPlayer enquiry={mockEnqB} />
      </div>
    );

    const buttons = screen.getAllByRole('button', { name: /listen to voice notification/i });
    expect(buttons).toHaveLength(2);

    // Play first notification
    fireEvent.click(buttons[0]);
    expect(globalVoiceCoordinator.isActive('enq-A')).toBe(true);

    // Play second notification -> first must be stopped
    fireEvent.click(buttons[1]);
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(globalVoiceCoordinator.isActive('enq-B')).toBe(true);
  });
});


