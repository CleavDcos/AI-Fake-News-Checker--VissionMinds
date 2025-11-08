/**
 * Service to evaluate news source credibility
 * This can integrate with external APIs or use a local database of known sources
 */

// Known reliable and unreliable sources database
// In production, this should be stored in a database or fetched from an API
const sourceDatabase = {
    reliable: [
        'reuters.com',
        'bbc.com',
        'ap.org',
        'npr.org',
        'pbs.org',
        'theguardian.com',
        'wsj.com',
        'nytimes.com',
        'washingtonpost.com',
        'economist.com'
    ],
    unreliable: [
        'infowars.com',
        'naturalnews.com',
        'beforeitsnews.com'
    ]
};

const sourceCheckService = {
    /**
     * Check source reliability and return a score (0-1)
     * @param {String} domain - Domain name to check
     * @returns {Number} Reliability score between 0 and 1
     */
    checkSourceReliability: async (domain) => {
        if (!domain) {
            return 0.5; // Default neutral score
        }

        const normalizedDomain = domain.toLowerCase().replace('www.', '');

        // Check against known sources
        if (sourceDatabase.reliable.includes(normalizedDomain)) {
            return 0.9; // High reliability
        }

        if (sourceDatabase.unreliable.includes(normalizedDomain)) {
            return 0.2; // Low reliability
        }

        // TODO: Integrate with external credibility APIs such as:
        // - NewsGuard API
        // - Media Bias/Fact Check API
        // - Custom ML model for source credibility

        // For unknown sources, return a default score
        // In production, you might want to check external APIs
        return 0.5; // Neutral score for unknown sources
    },

    /**
     * Get source information
     * @param {String} domain - Domain name
     * @returns {Object} Source information
     */
    getSourceInfo: async (domain) => {
        const normalizedDomain = domain.toLowerCase().replace('www.', '');
        const reliabilityScore = await sourceCheckService.checkSourceReliability(domain);

        let category = 'unknown';
        if (sourceDatabase.reliable.includes(normalizedDomain)) {
            category = 'reliable';
        } else if (sourceDatabase.unreliable.includes(normalizedDomain)) {
            category = 'unreliable';
        }

        return {
            domain: normalizedDomain,
            reliabilityScore,
            category,
            verified: category !== 'unknown'
        };
    }
};

module.exports = sourceCheckService;

