// Configure a real server endpoint to enable live handoff.
// It must accept a POST with { portal, name, email, issue, created_at, status }
// and return JSON, e.g. {"reference":"TICKET-123"}.
// Leave empty for the safe front-end demo; nothing is submitted.
window.BEAMISH_SUPPORT_CONFIG = { endpoint: "", aiEndpoint: "" };
