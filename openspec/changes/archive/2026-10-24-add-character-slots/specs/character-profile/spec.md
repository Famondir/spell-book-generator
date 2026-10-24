## ADDED Requirements

### Requirement: Mehrere lokale Profile
`data/profile.local.js` SHALL neben `PROFILE_LOCAL` mehrere Profile als `PROFILES_LOCAL = { schlüssel: { label, … } }` registrieren können; jeder Charakter MUST eines davon oder das neutrale Profil wählen können.

#### Scenario: Profil wählen
- **WENN** ein Charakter das Profil „mirla“ wählt
- **DANN** erscheinen nach dem Neuladen Randnotizen, Kalender und Kosmologie aus diesem Profil
