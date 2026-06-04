
```mermaid
---
title: Fishing Reels Model
---
erDiagram
    Angler {
        uuid id PK
        timestamptz created_at
        timestamptz updated_at
        varchar display_name "120"
        varchar slug UK "80, unique, lowercased"
        text bio "nullable"
        varchar avatar_url "2048, nullable"
        angler_status status "default active"
        varchar home_state "2, US state code, nullable"
        varchar home_town "100, nullable"
    }

    Angler ||--o{ AnglerStream : has
    AnglerStream }o--|| Stream : has
    
    Angler ||--o{ AnglerHighlight : has
    AnglerHighlight ||--|| Highlight : is
    
    Tourney ||--|{ TourneyDay : has
    Tourney ||--o{ TourneyHighlight : has
    TourneyHighlight ||--|| Highlight : is
    TourneyDay ||--o{ TourneyDayHighlight : has
    TourneyDayHighlight ||--|| Highlight : is
    
    Tourney ||--o{ TourneyRankedPayout : has
    Tourney ||--o| TourneyResult : has
    TourneyResult ||--o{ TourneyRankedResult : has
    TourneyRankedResult |o--|| TourneyParticipant : is 
    TourneyRankedResult |o--o| TourneyRankedPayout : has
    
    
    TourneyDay ||--o{ TourneyStream : has
    TourneyStream }o--|| Stream : has
    Tourney ||--o{ TourneyParticipant : has
    TourneyParticipant }o--|| Angler : is
    TourneyParticipant ||--o{ TourneyParticipantCatch : has
    TourneyParticipantCatch }o--|| TourneyDay : has
    TourneyParticipantCatch ||--o| TourneyParticipantCatchHighlight : has
    TourneyParticipantCatchHighlight ||--|| Highlight : has
    TourneyParticipant ||--o{ TourneyParticipantPenalty : has
    TourneyParticipantPenalty }o--|| TourneyDay : has
    TourneyDay ||--o{ TourneyDayParticipant : has
    TourneyDayParticipant }o--|| TourneyParticipant : is
    
    
    Angler ||--o{ AnglerSponsor : has
    AnglerSponsor }o--|| Sponsor : is
    Sponsor ||--o{ SponsorAsset : has
    Tourney ||--o{ TourneySponsor : has
    TourneySponsor }o--|| Sponsor : is
    
    League ||--o{ LeagueAngler : has
    LeagueAngler }o--|| Angler : is
    League ||--o{ LeagueEvent : contains
    LeagueEvent |o--o| Tourney : is
    League ||--o{ LeagueHighlight : has
    LeagueHighlight ||--|| Highlight : is
    
    User ||--o| AnglerUser : is 
    AnglerUser ||--|| Angler : is
    User ||--o{ TourneyStaff : is 
    TourneyStaff }o--|| Tourney : has
```

## Conventions

- **Primary keys:** every table uses a UUID primary key.
- **Enum columns (not lookup tables):** the following are modeled as enum columns on their parent entity rather than separate tables, so they don't appear as entities above:
  - `Angler.status` — `active` | `hidden` | `archived` (native PG enum `angler_status`)
  - `User.user_type` — `angler` | `tourney` | `admin`
  - `SponsorAsset.asset_type`
  - `TourneyParticipantCatch.catch_type`

