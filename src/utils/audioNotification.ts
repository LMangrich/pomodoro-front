export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playNote = (freq: number, startTime: number) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      // Softer attack and decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    };

    // Play two notes (a perfect fifth) for a pleasant "ding-dong" effect
    playNote(880, audioContext.currentTime);        // High A
    playNote(1318.51, audioContext.currentTime + 0.1); // High E
    
  } catch (error) {
    console.error('Audio error:', error);
  }
};