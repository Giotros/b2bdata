// Privacy-friendly analytics utility
// Tracks user actions without personal data or third-party services

const ANALYTICS_ENDPOINT = '/api/analytics';

class Analytics {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.eventQueue = [];
    this.flushInterval = null;
  }

  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('analyticsSessionId');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analyticsSessionId', sessionId);
    }
    return sessionId;
  }

  async track(eventName, properties = {}) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      properties: {
        ...properties,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'direct',
        path: window.location.pathname,
      }
    };

    this.eventQueue.push(event);

    // Auto-flush if queue gets large
    if (this.eventQueue.length >= 10) {
      await this.flush();
    } else {
      // Schedule a flush if not already scheduled
      if (!this.flushInterval) {
        this.flushInterval = setTimeout(() => this.flush(), 5000);
      }
    }
  }

  async flush() {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    if (this.flushInterval) {
      clearTimeout(this.flushInterval);
      this.flushInterval = null;
    }

    try {
      await fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend }),
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Don't retry to avoid overwhelming the server
    }
  }

  // Track specific events
  trackPageView() {
    this.track('page_view');
  }

  trackSnapshotCreated(source, productCount) {
    this.track('snapshot_created', {
      source, // 'file', 'url', or 'paste'
      productCount,
    });
  }

  trackComparisonMade(changesCount, newProducts, removedProducts) {
    this.track('comparison_made', {
      totalChanges: changesCount,
      newProducts,
      removedProducts,
    });
  }

  trackCsvExport(rowCount) {
    this.track('csv_export', {
      rowCount,
    });
  }

  trackSnapshotDownload() {
    this.track('snapshot_download');
  }

  trackError(errorType, errorMessage) {
    this.track('error', {
      errorType,
      errorMessage,
    });
  }

  trackFeatureUsage(feature) {
    this.track('feature_usage', {
      feature,
    });
  }

  trackCookieConsent(accepted) {
    this.track('cookie_consent', {
      accepted,
    });
  }
}

// Create singleton instance
const analytics = new Analytics();

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    analytics.flush();
  });
}

export default analytics;
