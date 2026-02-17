// ===================================
// Mental Health Dashboard - Main JavaScript
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
});

// ===================================
// Navigation Component
// ===================================

function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
  }
  
  // Smooth scroll navigation for all nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Get the target section ID from href
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Smooth scroll to target section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      
      // Close mobile menu when a link is clicked
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = event.target.closest('.navbar');
    if (!isClickInsideNav && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

// ===================================
// Chatbot Component
// ===================================

const Chatbot = {
  messages: [],
  
  init() {
    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');
    
    if (sendButton && chatInput) {
      // Send message on button click
      sendButton.addEventListener('click', () => {
        this.sendMessage();
      });
      
      // Send message on Enter key
      chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.sendMessage();
        }
      });
    }
  },
  
  sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const userMessage = chatInput.value.trim();
    
    // Prevent empty messages
    if (!userMessage) {
      chatInput.classList.add('shake');
      setTimeout(() => chatInput.classList.remove('shake'), 500);
      return;
    }
    
    // Add user message to conversation
    this.displayMessage(userMessage, 'user');
    this.messages.push({ text: userMessage, sender: 'user', timestamp: new Date().toISOString() });
    
    // Clear input
    chatInput.value = '';
    
    // Generate and display bot response
    setTimeout(() => {
      const botResponse = this.generateResponse(userMessage);
      this.displayMessage(botResponse, 'bot');
      this.messages.push({ text: botResponse, sender: 'bot', timestamp: new Date().toISOString() });
    }, 500);
  },
  
  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Pattern matching for mental health responses
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried')) {
      return "I hear that you're feeling anxious. Remember to take deep breaths - inhale for 4 counts, hold for 4, exhale for 4. You're not alone in this feeling, and it will pass.";
    }
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
      return "I'm sorry you're feeling down. It's okay to not be okay sometimes. Consider reaching out to someone you trust, or try doing something small that usually brings you joy.";
    }
    
    if (message.includes('stress') || message.includes('overwhelmed')) {
      return "Feeling stressed is completely normal. Try breaking tasks into smaller steps, and remember to take breaks. You don't have to do everything at once.";
    }
    
    if (message.includes('sleep') || message.includes('tired') || message.includes('insomnia')) {
      return "Sleep is so important for mental health. Try establishing a bedtime routine, avoiding screens before bed, and keeping your bedroom cool and dark. If sleep issues persist, consider talking to a healthcare provider.";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm here whenever you need support. Remember, taking care of your mental health is a sign of strength.";
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to support you. You can talk to me about how you're feeling, track your mood, or explore our wellness tips. If you're in crisis, please reach out to a mental health professional or crisis helpline.";
    }
    
    if (message.includes('happy') || message.includes('great') || message.includes('good')) {
      return "That's wonderful to hear! It's important to celebrate the good moments. What's contributing to your positive mood today?";
    }
    
    if (message.includes('lonely') || message.includes('alone') || message.includes('isolated')) {
      return "Feeling lonely can be really difficult. Remember that reaching out is a brave step. Consider connecting with friends, family, or support groups. You matter, and your feelings are valid.";
    }
    
    // Default empathetic response
    return "Thank you for sharing that with me. I'm here to listen and support you. How are you feeling right now? Remember, it's okay to take things one step at a time.";
  },
  
  displayMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    
    chatMessages.appendChild(messageDiv);
    
    // Auto-scroll to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
};

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  Chatbot.init();
});

// ===================================
// Mood Tracker Component
// ===================================

const MoodTracker = {
  moods: [],
  
  init() {
    // Load moods from localStorage
    this.loadMoods();
    
    // Set up event listeners for mood buttons
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(button => {
      button.addEventListener('click', () => {
        const mood = button.getAttribute('data-mood');
        this.logMood(mood);
      });
    });
    
    // Display existing moods
    this.displayMoods();
  },
  
  logMood(mood) {
    // Create mood entry with timestamp
    const timestamp = new Date().toISOString();
    const date = new Date().toISOString().split('T')[0];
    
    const moodEntry = {
      mood: mood,
      timestamp: timestamp,
      date: date
    };
    
    // Add to moods array
    this.moods.unshift(moodEntry); // Add to beginning for newest first
    
    // Save to localStorage
    this.saveMoods();
    
    // Display updated moods
    this.displayMoods();
    
    // Show feedback
    this.showFeedback(mood);
  },
  
  saveMoods() {
    try {
      localStorage.setItem('mentalHealthMoods', JSON.stringify({ moods: this.moods }));
    } catch (error) {
      console.error('Error saving moods to localStorage:', error);
      // Handle quota exceeded or other errors
      if (error.name === 'QuotaExceededError') {
        // Remove oldest entries if quota exceeded
        this.moods = this.moods.slice(0, 50); // Keep only 50 most recent
        try {
          localStorage.setItem('mentalHealthMoods', JSON.stringify({ moods: this.moods }));
        } catch (e) {
          console.error('Still unable to save after cleanup:', e);
        }
      }
    }
  },
  
  loadMoods() {
    try {
      const stored = localStorage.getItem('mentalHealthMoods');
      if (stored) {
        const data = JSON.parse(stored);
        this.moods = data.moods || [];
      }
    } catch (error) {
      console.error('Error loading moods from localStorage:', error);
      this.moods = [];
    }
  },
  
  displayMoods() {
    const moodHistoryList = document.getElementById('moodHistoryList');
    
    if (!moodHistoryList) return;
    
    // Clear existing entries
    moodHistoryList.innerHTML = '';
    
    if (this.moods.length === 0) {
      moodHistoryList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: var(--spacing-lg);">No mood logs yet. Start tracking your mood above!</p>';
      return;
    }
    
    // Display each mood entry
    this.moods.forEach(entry => {
      const moodDiv = document.createElement('div');
      moodDiv.className = 'mood-entry';
      moodDiv.setAttribute('data-mood', entry.mood);
      moodDiv.setAttribute('role', 'listitem');
      
      const emoji = this.getMoodEmoji(entry.mood);
      const formattedTime = this.formatTimestamp(entry.timestamp);
      
      moodDiv.innerHTML = `
        <span class="mood-entry-emoji" aria-hidden="true">${emoji}</span>
        <div class="mood-entry-info">
          <div class="mood-entry-mood">${entry.mood}</div>
          <div class="mood-entry-time">${formattedTime}</div>
        </div>
      `;
      
      moodHistoryList.appendChild(moodDiv);
    });
  },
  
  getMoodEmoji(mood) {
    const emojiMap = {
      'great': '😊',
      'good': '🙂',
      'okay': '😐',
      'sad': '😢',
      'stressed': '😰'
    };
    return emojiMap[mood] || '😐';
  },
  
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  },
  
  showFeedback(mood) {
    const feedback = document.createElement('div');
    feedback.className = 'mood-logged-feedback';
    feedback.textContent = `Mood logged: ${mood}`;
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(feedback);
      }, 300);
    }, 2000);
  }
};

// Update initialization
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  Chatbot.init();
  MoodTracker.init();
});


// ===================================
// Symptom Checker Component
// ===================================

const SymptomChecker = {
  selectedSymptoms: [],
  
  init() {
    const symptomBtns = document.querySelectorAll('.symptom-btn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearSymptomsBtn');
    
    symptomBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const symptom = btn.getAttribute('data-symptom');
        this.toggleSymptom(symptom, btn);
      });
    });
    
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.analyzeSymptoms());
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearSymptoms());
    }
  },
  
  toggleSymptom(symptom, btn) {
    const index = this.selectedSymptoms.indexOf(symptom);
    
    if (index > -1) {
      this.selectedSymptoms.splice(index, 1);
      btn.classList.remove('selected');
    } else {
      this.selectedSymptoms.push(symptom);
      btn.classList.add('selected');
    }
    
    this.updateSelectedList();
  },
  
  updateSelectedList() {
    const listDiv = document.getElementById('selectedSymptomsList');
    if (!listDiv) return;
    
    if (this.selectedSymptoms.length === 0) {
      listDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No symptoms selected</p>';
      return;
    }
    
    listDiv.innerHTML = this.selectedSymptoms.map(symptom => {
      const displayName = symptom.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `<span class="selected-tag">${displayName} <span class="remove" onclick="SymptomChecker.removeSymptom('${symptom}')">×</span></span>`;
    }).join('');
  },
  
  removeSymptom(symptom) {
    const btn = document.querySelector(`[data-symptom="${symptom}"]`);
    if (btn) {
      btn.classList.remove('selected');
    }
    const index = this.selectedSymptoms.indexOf(symptom);
    if (index > -1) {
      this.selectedSymptoms.splice(index, 1);
    }
    this.updateSelectedList();
  },
  
  clearSymptoms() {
    this.selectedSymptoms = [];
    document.querySelectorAll('.symptom-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    this.updateSelectedList();
    document.getElementById('symptomResults').style.display = 'none';
  },
  
  analyzeSymptoms() {
    if (this.selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }
    
    const diagnosis = this.getDiagnosis(this.selectedSymptoms);
    this.displayResults(diagnosis);
  },
  
  getDiagnosis(symptoms) {
    const hasEmergency = symptoms.some(s => ['chest-pain', 'breathing'].includes(s));
    
    if (hasEmergency) {
      return {
        condition: 'Emergency Symptoms Detected',
        description: 'You have symptoms that may require immediate medical attention.',
        recommendations: [
          'Call emergency services immediately (108)',
          'Do not drive yourself to the hospital',
          'Stay calm and sit in a comfortable position',
          'Have someone stay with you'
        ],
        emergency: true
      };
    }
    
    if (symptoms.includes('fever') && symptoms.includes('cough')) {
      return {
        condition: 'Possible Respiratory Infection',
        description: 'Your symptoms suggest a respiratory infection like flu or cold.',
        recommendations: [
          'Rest and stay hydrated',
          'Take paracetamol for fever',
          'Consult a doctor if fever persists for more than 3 days',
          'Wear a mask to prevent spreading',
          'Monitor your temperature regularly'
        ],
        emergency: false
      };
    }
    
    if (symptoms.includes('stomach-pain') && symptoms.includes('nausea')) {
      return {
        condition: 'Possible Digestive Issue',
        description: 'Your symptoms indicate a digestive problem.',
        recommendations: [
          'Avoid spicy and oily foods',
          'Drink plenty of water',
          'Eat light, bland foods',
          'Consult a doctor if pain is severe',
          'Consider ORS for hydration'
        ],
        emergency: false
      };
    }
    
    if (symptoms.includes('headache') && symptoms.includes('dizziness')) {
      return {
        condition: 'Possible Migraine or Dehydration',
        description: 'Your symptoms could be due to migraine, dehydration, or stress.',
        recommendations: [
          'Rest in a dark, quiet room',
          'Drink plenty of water',
          'Take pain relief medication if needed',
          'Check your blood pressure',
          'Consult a doctor if symptoms persist'
        ],
        emergency: false
      };
    }
    
    return {
      condition: 'General Health Concern',
      description: 'Based on your symptoms, we recommend monitoring your condition.',
      recommendations: [
        'Rest and stay hydrated',
        'Monitor your symptoms for 24-48 hours',
        'Consult a doctor if symptoms worsen',
        'Maintain a healthy diet',
        'Get adequate sleep'
      ],
      emergency: false
    };
  },
  
  displayResults(diagnosis) {
    const resultsDiv = document.getElementById('symptomResults');
    const contentDiv = document.getElementById('diagnosisContent');
    const emergencyDiv = document.getElementById('emergencyWarning');
    
    if (!resultsDiv || !contentDiv) return;
    
    contentDiv.innerHTML = `
      <div class="diagnosis-card">
        <h4>${diagnosis.condition}</h4>
        <p>${diagnosis.description}</p>
      </div>
      <div class="recommendations">
        <h4>Recommendations:</h4>
        <ul>
          ${diagnosis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    `;
    
    if (emergencyDiv) {
      emergencyDiv.style.display = diagnosis.emergency ? 'block' : 'none';
    }
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

// ===================================
// Nutrition Planner Component
// ===================================

const NutritionPlanner = {
  selectedGoal: null,
  selectedPreference: null,
  
  init() {
    const goalBtns = document.querySelectorAll('.goal-btn');
    const prefBtns = document.querySelectorAll('.pref-btn');
    const generateBtn = document.getElementById('generatePlanBtn');
    
    goalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        goalBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedGoal = btn.getAttribute('data-goal');
      });
    });
    
    prefBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        prefBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedPreference = btn.getAttribute('data-pref');
      });
    });
    
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateMealPlan());
    }
  },
  
  generateMealPlan() {
    if (!this.selectedGoal || !this.selectedPreference) {
      alert('Please select both a goal and dietary preference');
      return;
    }
    
    const mealPlan = this.getMealPlan(this.selectedGoal, this.selectedPreference);
    this.displayMealPlan(mealPlan);
  },
  
  getMealPlan(goal, preference) {
    const plans = {
      'weight-loss': {
        breakfast: 'Oatmeal with fruits and nuts',
        lunch: 'Grilled chicken salad with olive oil',
        dinner: 'Vegetable soup with whole grain bread',
        snacks: 'Greek yogurt, apple slices',
        calories: '1200-1500 kcal/day'
      },
      'muscle-gain': {
        breakfast: 'Scrambled eggs with whole wheat toast',
        lunch: 'Chicken breast with brown rice and vegetables',
        dinner: 'Grilled fish with quinoa',
        snacks: 'Protein shake, almonds',
        calories: '2500-3000 kcal/day'
      },
      'healthy-living': {
        breakfast: 'Smoothie bowl with berries and granola',
        lunch: 'Mixed vegetable curry with roti',
        dinner: 'Grilled paneer with salad',
        snacks: 'Fruits, nuts, green tea',
        calories: '1800-2200 kcal/day'
      },
      'diabetes': {
        breakfast: 'Vegetable upma with low-fat milk',
        lunch: 'Dal with brown rice and salad',
        dinner: 'Grilled fish with steamed vegetables',
        snacks: 'Cucumber, carrot sticks',
        calories: '1500-1800 kcal/day'
      },
      'heart-health': {
        breakfast: 'Oats with walnuts and berries',
        lunch: 'Grilled fish with leafy greens',
        dinner: 'Vegetable stir-fry with quinoa',
        snacks: 'Almonds, dark chocolate',
        calories: '1800-2000 kcal/day'
      },
      'energy-boost': {
        breakfast: 'Banana smoothie with peanut butter',
        lunch: 'Chicken wrap with vegetables',
        dinner: 'Salmon with sweet potato',
        snacks: 'Energy bars, dried fruits',
        calories: '2000-2400 kcal/day'
      }
    };
    
    let plan = plans[goal] || plans['healthy-living'];
    
    if (preference === 'vegetarian') {
      plan.lunch = plan.lunch.replace('chicken', 'paneer').replace('Chicken', 'Paneer');
      plan.dinner = plan.dinner.replace('fish', 'tofu').replace('Fish', 'Tofu');
    } else if (preference === 'vegan') {
      plan = {
        ...plan,
        breakfast: plan.breakfast.replace('eggs', 'tofu scramble').replace('milk', 'almond milk'),
        lunch: 'Chickpea curry with brown rice',
        dinner: 'Lentil soup with vegetables',
        snacks: 'Fruits, nuts, seeds'
      };
    }
    
    return plan;
  },
  
  displayMealPlan(plan) {
    const resultsDiv = document.getElementById('mealPlanResults');
    const contentDiv = document.getElementById('mealPlanContent');
    
    if (!resultsDiv || !contentDiv) return;
    
    contentDiv.innerHTML = `
      <div class="meal-card">
        <h4>🌅 Breakfast</h4>
        <p>${plan.breakfast}</p>
      </div>
      <div class="meal-card">
        <h4>🌞 Lunch</h4>
        <p>${plan.lunch}</p>
      </div>
      <div class="meal-card">
        <h4>🌙 Dinner</h4>
        <p>${plan.dinner}</p>
      </div>
      <div class="meal-card">
        <h4>🍎 Snacks</h4>
        <p>${plan.snacks}</p>
      </div>
      <div class="meal-card" style="border-left-color: #10b981;">
        <h4>📊 Daily Target</h4>
        <p class="calories">${plan.calories}</p>
      </div>
    `;
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

// Update initialization
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  Chatbot.init();
  MoodTracker.init();
  SymptomChecker.init();
  NutritionPlanner.init();
});
