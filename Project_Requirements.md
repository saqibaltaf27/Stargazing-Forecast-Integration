# Midnight Forest - Stargazing Forecast Integration

## Overview

The goal of this project is to create an interactive and visually appealing web component that helps guests at the midnight Forest glamping site plan their stargazing experience.

The component connects to a public astronomy API to fetch real-time environmental and celestial data using specific geographic coordinates. Base on this data, the system calculates a Stargazing Quality Score (1 to 5 stars), primarily influenced by cloud cover and moon illumination.

The UI must present:
- Current moon phase (text + icon)
- Moon illumination percentage
- Cloud cover percentage
- Stargazing Quality Score (visual stars)
- Smart stargazing tips based on conditions

The component must:
- Be responsive (mobile + tablet friendly)
- Follow a dark-mode aesthetic suitable for a night theme
- Handle API failures gracefully with fallback UI states
- Secure API keys using environment variables (no hardcoding)

## Deliverables
1. ZIP file containing the complete codebase, including a .env.example file.
2. Public GitHub Repository link with a detailed README explaining how to set up the API keys and run the project locally.
3. Deployed Demo Link (using Vercel, Netlify, or GitHub Pages) showing the component in a live environment.
4. Screenshots of the component showing different states (e.g., Clear Night vs. Cloudy Night).