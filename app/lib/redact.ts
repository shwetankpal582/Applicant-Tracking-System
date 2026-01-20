/**
 * Redaction utility for PII (Personally Identifiable Information)
 * masking before sending data to AI.
 */

export const redactText = (text: string): string => {
    let redacted = text;

    // Email regex
    redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]');

    // Phone number regex (common formats)
    redacted = redacted.replace(/(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g, '[PHONE_REDACTED]');

    // Basic address pattern (Street numbers + Street names)
    // This is aggressive but useful for privacy
    redacted = redacted.replace(/\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct)/gi, '[ADDRESS_REDACTED]');

    return redacted;
};
